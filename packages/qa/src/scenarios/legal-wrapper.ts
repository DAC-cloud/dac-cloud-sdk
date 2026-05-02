import {writeFileSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  proposeVoteExecute,
  setupNativeDacWithDeal,
} from "./fixtures/index.js";

/**
 * Scenario: Legal Wrapper Lifecycle
 *
 * Exercises all legal-wrapper related CLI/contract/indexer flows:
 *   1. Set legal wrapper on DAC via `update-legal-wrapper` proposal
 *   2. Verify legal wrapper state in indexer
 *   3. Legal wrapper authenticates with own JWT (gets `legal-wrapper` role)
 *   4. Send DAC legal wrapper message (as legal wrapper wallet)
 *   5. Verify message recorded in indexer
 *   6. Create deal, send deal legal wrapper message
 *   7. Approve offchain action via proposal
 *   8. Verify all legal wrapper data in indexer views
 */
export const legalWrapperScenario: Scenario = {
  name: "legal-wrapper-lifecycle",
  description: "Set legal wrapper → auth as wrapper → DAC + deal messages → offchain action → indexer verification",
  tags: ["legal-wrapper", "governance", "auth", "messages"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    const wrapperWallet = config.wallets.treasury; // use 'treasury' role (account9, unused elsewhere) as legal wrapper EOA
    if (!founderWallet) throw new Error("founder wallet required");
    if (!wrapperWallet) throw new Error("treasury wallet required (used as legal wrapper)");

    // ══════════════════════════════════════════════════════════════
    // SETUP: Native DAC with an approved deal
    // ══════════════════════════════════════════════════════════════

    const ctx = await setupNativeDacWithDeal(h, {
      dacName: "Legal Wrapper QA DAC",
      dealName: "Legal Wrapper QA Deal",
      milestones: [{
        expectedReturn: "1000000000000000000000",
        rewardCurve: ["0", "1000000000000000000"],
        penaltyCurve: ["0"],
      }],
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: Set legal wrapper via governance proposal
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 1: Setting legal wrapper via update-legal-wrapper proposal...");

    await step(h, "update-legal-wrapper", async () => {
      const proposalId = await proposeVoteExecute(h, ctx.dacAddress, [
        "propose", "update-legal-wrapper",
        wrapperWallet.address,                      // wrapperAddr
        "QmLegalWrapperAgreementHashForQA",         // operatingAgreementIPFS
        "QA Legal Wrapper LLC",                     // registeredAgent
        "0x",                                       // data (empty)
      ]);
      assert.defined(proposalId, "update-legal-wrapper proposal id");
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "update-legal-wrapper"],
      };
    });

    await h.syncIndexer();

    // ── Verify legal wrapper state in DAC view ──────────────────

    await step(h, "verify-wrapper-on-dac", async () => {
      const cli = await h.view("dac", ["--dac", ctx.dacAddress]);
      const dac = cli.data.dac as Record<string, unknown>;
      assert.defined(dac, "DAC record exists");

      h.log(`Legal wrapper address: ${dac.legalWrapperAddress}`);
      h.log(`Operating agreement: ${dac.legalWrapperOperatingAgreementIpfs}`);
      h.log(`Registered agent: ${dac.legalWrapperRegisteredAgent}`);

      assert.equal(
        String(dac.legalWrapperAddress).toLowerCase(),
        wrapperWallet.address.toLowerCase(),
        "DAC legalWrapperAddress matches",
      );
      assert.equal(
        dac.legalWrapperOperatingAgreementIpfs,
        "QmLegalWrapperAgreementHashForQA",
        "operating agreement IPFS matches",
      );
      assert.equal(
        dac.legalWrapperRegisteredAgent,
        "QA Legal Wrapper LLC",
        "registered agent matches",
      );

      return {cli, command: ["dac", "view", "dac"], indexerSnapshot: {
        legalWrapperAddress: dac.legalWrapperAddress,
        legalWrapperOperatingAgreementIpfs: dac.legalWrapperOperatingAgreementIpfs,
        legalWrapperRegisteredAgent: dac.legalWrapperRegisteredAgent,
      }};
    });

    // ── Verify legal wrapper state table ─────────────────────────

    await step(h, "verify-wrapper-state", async () => {
      const cli = await h.view("legal-wrapper-state", ["--dac", ctx.dacAddress]);
      const states = cli.data.states as Array<Record<string, unknown>> | undefined;
      assert.defined(states, "legal wrapper states exist");
      assert.gte(states?.length ?? 0, 1, "at least 1 legal wrapper state entry");

      if (states && states.length > 0) {
        const latest = states[0];
        h.log(`Wrapper state: addr=${latest.wrapperAddress}, agreement=${latest.operatingAgreementIpfs}, agent=${latest.registeredAgent}`);
        assert.equal(
          String(latest.wrapperAddress).toLowerCase(),
          wrapperWallet.address.toLowerCase(),
          "state wrapperAddress matches",
        );
        assert.equal(latest.operatingAgreementIpfs, "QmLegalWrapperAgreementHashForQA", "state agreement matches");
        assert.equal(latest.registeredAgent, "QA Legal Wrapper LLC", "state registeredAgent matches");
      }

      return {cli, command: ["dac", "view", "legal-wrapper-state"], indexerSnapshot: {states} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: Legal wrapper auth — verify JWT gets legal-wrapper role
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 2: Legal wrapper auth + status check...");

    // The wrapper wallet authenticates via CLI — it should get a member JWT
    // with the 'legal-wrapper' role for this DAC.
    await step(h, "wrapper-auth-login", async () => {
      const cli = await h.cliAs("treasury", [
        "auth", "login", "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.equal(cli.data.ok, true, "auth login succeeded");
      assert.equal(cli.data.kind, "member", "wrapper gets member JWT");

      const memberships = cli.data.memberships as Array<Record<string, unknown>> | undefined;
      assert.defined(memberships, "memberships present");
      assert.gte(memberships?.length ?? 0, 1, "at least 1 membership");

      if (memberships && memberships.length > 0) {
        const dacMembership = memberships.find(
          (m) => String(m.dac).toLowerCase() === ctx.dacAddress.toLowerCase(),
        );
        assert.defined(dacMembership, "membership for our DAC");

        if (dacMembership) {
          const roles = dacMembership.roles as string[];
          h.log(`Wrapper auth roles: ${JSON.stringify(roles)}`);
          assert.equal(roles.includes("legal-wrapper"), true, "wrapper has 'legal-wrapper' role");
        }
      }

      return {cli, command: ["dac", "auth", "login"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: Send DAC legal wrapper message (as legal wrapper)
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 3: Sending DAC legal wrapper message...");

    // Prepare message file — kind is bytes4, message is hex-encoded bytes
    const dacMessageFile = join(tmpdir(), `qa-legal-msg-dac-${Date.now()}.json`);
    writeFileSync(dacMessageFile, JSON.stringify({
      kind: "0x00000001",
      message: "0x48656c6c6f20776f726c64", // "Hello world" in hex
    }));

    await step(h, "send-dac-legal-message", async () => {
      const cli = await h.cliAs("treasury", [
        "legal-message", dacMessageFile,
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.equal(cli.data.action, "dac.legal-message", "dac legal message action");
      assert.defined(cli.data.txHash, "legal message tx hash");
      assert.equal(
        String(cli.data.caller).toLowerCase(),
        wrapperWallet.address.toLowerCase(),
        "caller is legal wrapper",
      );
      h.log(`DAC legal message tx: ${cli.data.txHash}`);
      return {cli, command: ["dac", "legal-message"]};
    });

    await h.syncIndexer();

    // ── Verify message in indexer ────────────────────────────────

    await step(h, "verify-dac-legal-message", async () => {
      const cli = await h.view("legal-wrapper-messages", ["--dac", ctx.dacAddress]);
      const messages = cli.data.messages as Array<Record<string, unknown>> | undefined;
      assert.defined(messages, "legal wrapper messages exist");
      assert.gte(messages?.length ?? 0, 1, "at least 1 legal wrapper message");

      if (messages && messages.length > 0) {
        const msg = messages[0];
        h.log(`Message: kind=${msg.messageKind}, wrapper=${msg.wrapperAddress}, tx=${msg.createdTransactionHash}`);
        assert.equal(
          String(msg.wrapperAddress).toLowerCase(),
          wrapperWallet.address.toLowerCase(),
          "message wrapperAddress is legal wrapper",
        );
        assert.equal(msg.messageKind, "0x00000001", "message kind matches");
      }

      return {cli, command: ["dac", "view", "legal-wrapper-messages"], indexerSnapshot: {messages} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: Send deal legal wrapper message (as legal wrapper)
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 4: Sending deal legal wrapper message...");

    const dealMessageFile = join(tmpdir(), `qa-legal-msg-deal-${Date.now()}.json`);
    writeFileSync(dealMessageFile, JSON.stringify({
      kind: "0x00000002",
      message: "0x4465616c206d657373616765", // "Deal message" in hex
    }));

    await step(h, "send-deal-legal-message", async () => {
      const cli = await h.cliAs("treasury", [
        "deal", "legal-message", ctx.dealNumericId, dealMessageFile,
        "--dac-address", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.equal(cli.data.action, "deal.legal-message", "deal legal message action");
      assert.defined(cli.data.txHash, "deal legal message tx hash");
      h.log(`Deal legal message tx: ${cli.data.txHash}`);
      return {cli, command: ["deal", "legal-message"]};
    });

    await h.syncIndexer();

    // ══════════════════════════════════════════════════════════════
    // PHASE 5: Approve offchain action via DAC governance
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 5: Approving offchain action...");

    await step(h, "approve-offchain-action", async () => {
      const proposalId = await proposeVoteExecute(h, ctx.dacAddress, [
        "propose", "approve-offchain-action",
        "0x12345678",  // arbitrary offchain action selector
        "0xabcdef",    // arbitrary data
      ]);
      assert.defined(proposalId, "offchain action proposal id");
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "approve-offchain-action"],
      };
    });

    await h.syncIndexer();

    // ══════════════════════════════════════════════════════════════
    // PHASE 6: Final verification — wrapper can still query indexer
    // ══════════════════════════════════════════════════════════════

    h.log("Phase 6: Final verification as legal wrapper...");

    // Legal wrapper views DAC state (uses their own JWT)
    await step(h, "wrapper-view-dac", async () => {
      const cli = await h.cliAs("treasury", [
        "view", "dac", "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      const dac = cli.data.dac as Record<string, unknown>;
      assert.defined(dac, "wrapper can view DAC");
      assert.equal(
        String(dac.legalWrapperAddress).toLowerCase(),
        wrapperWallet.address.toLowerCase(),
        "wrapper address still set",
      );
      return {cli, command: ["dac", "view", "dac"]};
    });

    // Legal wrapper views proposals (should see update-legal-wrapper + deal + offchain proposals)
    await step(h, "wrapper-view-proposals", async () => {
      const cli = await h.cliAs("treasury", [
        "view", "proposals", "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      assert.defined(proposals, "proposals list exists");
      // At least: mint-agent-tokens, deal approval, update-legal-wrapper, approve-offchain-action
      assert.gte(proposals?.length ?? 0, 4, "at least 4 proposals");
      h.log(`Total proposals: ${proposals?.length}`);
      return {cli, command: ["dac", "view", "proposals"], indexerSnapshot: {count: proposals?.length} as Record<string, unknown>};
    });

    h.log("Legal wrapper scenario completed successfully");
  },
};
