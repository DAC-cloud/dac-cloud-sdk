import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {proposeVoteExecute, resolveUnderlyingToken} from "./fixtures/index.js";

/**
 * Scenario: Agent Token Distributor Lifecycle
 *
 * Tests the distributor mode for agent token minting — a mechanism where DAC
 * governance approves a "distributor" address and mints agent tokens into its
 * inventory. The distributor can later distribute tokens to individual agents.
 *
 * Flow:
 *   1. Create native DAC, join + delegate
 *   2. Approve agent1 as a distributor with 20k token inventory (mint-agent-tokens-distributor)
 *   3. Verify agent1 received agent tokens
 *   4. Disable agent1 as distributor (disable-agent-distributor)
 *   5. Also mint agent tokens directly to agent2 for comparison (mint-agent-tokens)
 *   6. Verify all balances and proposals in indexer
 */
export const dacAgentDistributorScenario: Scenario = {
  name: "dac-agent-distributor",
  description: "Approve distributor → mint inventory → disable → verify",
  tags: ["dac", "agent-tokens", "distributor", "governance"],

  async run(h: Harness) {
    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    const agent1Wallet = config.wallets.agent1;
    const agent2Wallet = config.wallets.agent2;
    if (!founderWallet) throw new Error("founder wallet required");
    if (!agent1Wallet) throw new Error("agent1 wallet required");
    if (!agent2Wallet) throw new Error("agent2 wallet required");

    const treasuryToken = resolveUnderlyingToken(h);

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: CREATE DAC
    // ══════════════════════════════════════════════════════════════

    let dacAddress: string;
    let agentTokenAddress: string;

    await step(h, "create-dac", async () => {
      const cli = await h.cli([
        "create",
        "--name", "Distributor QA DAC",
        "--description", "QA agent distributor testing",
        "--symbol", "QDIST",
        "--max-supply", "10000000000000000000000000",
        "--default-quorum", "50",
        "--allocation", "1000000000000000000000000", // 1M to founder
        "--treasury-token", treasuryToken,
        "--commitment", "0",
        "--auto-delegate",
        "--config", config.configPath, "--pretty-print",
      ]);
      dacAddress = cli.data.dac as string;
      agentTokenAddress = cli.data.agentToken as string;
      assert.isAddress(dacAddress, "DAC deployed");
      assert.isAddress(agentTokenAddress, "agent token deployed");
      return {cli, command: ["dac", "create"]};
    });

    await h.syncIndexer();

    // Join + delegate
    await h.cli([
      "join", "--dac", dacAddress!, "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.cli([
      "delegate", "--delegatee", founderWallet.address, "--dac", dacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: APPROVE DISTRIBUTOR (agent1)
    // ══════════════════════════════════════════════════════════════

    const distributorAmount = "20000000000000000000000"; // 20k tokens

    h.log(`Approving agent1 as distributor with ${distributorAmount} token inventory...`);

    await step(h, "approve-distributor", async () => {
      const proposalId = await proposeVoteExecute(h, dacAddress!, [
        "propose", "mint-agent-tokens-distributor", distributorAmount, agent1Wallet.address,
      ]);
      assert.defined(proposalId, "distributor proposal id");
      h.log(`Distributor approval proposal ${proposalId} executed`);
      return {
        cli: {data: {action: "mint-agent-tokens-distributor", proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "mint-agent-tokens-distributor"],
      };
    });

    await h.syncIndexer();

    // ── Verify distributor received agent tokens ─────────────────

    await step(h, "verify-distributor-balance", async () => {
      const cli = await h.cli([
        "balance", agentTokenAddress!, agent1Wallet.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      const balance = cli.data.balance as string;
      h.log(`Distributor (agent1) agent-token balance: ${balance}`);
      assert.equal(balance, distributorAmount, "distributor received agent tokens");
      return {cli, command: ["balance"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: DISABLE DISTRIBUTOR
    // ══════════════════════════════════════════════════════════════

    h.log("Disabling agent1 as distributor...");

    await step(h, "disable-distributor", async () => {
      const proposalId = await proposeVoteExecute(h, dacAddress!, [
        "propose", "disable-agent-distributor", agent1Wallet.address,
      ]);
      assert.defined(proposalId, "disable distributor proposal id");
      h.log(`Disable distributor proposal ${proposalId} executed`);
      return {
        cli: {data: {action: "disable-agent-distributor", proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "disable-agent-distributor"],
      };
    });

    await h.syncIndexer();

    // ── Verify distributor still has tokens (disable doesn't confiscate) ──

    await step(h, "verify-distributor-balance-after-disable", async () => {
      const cli = await h.cli([
        "balance", agentTokenAddress!, agent1Wallet.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      const balance = cli.data.balance as string;
      h.log(`Distributor balance after disable: ${balance}`);
      // Disabling revokes the distributor role but doesn't burn existing tokens
      assert.equal(balance, distributorAmount, "distributor tokens not confiscated on disable");
      return {cli, command: ["balance"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: DIRECT AGENT TOKEN MINT (comparison path)
    // ══════════════════════════════════════════════════════════════

    const directMintAmount = "15000000000000000000000"; // 15k

    h.log(`Minting ${directMintAmount} agent tokens directly to agent2...`);

    await step(h, "mint-direct-agent-tokens", async () => {
      const proposalId = await proposeVoteExecute(h, dacAddress!, [
        "propose", "mint-agent-tokens", directMintAmount, agent2Wallet.address,
      ]);
      assert.defined(proposalId, "direct mint proposal id");
      return {
        cli: {data: {action: "mint-agent-tokens", proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "mint-agent-tokens"],
      };
    });

    await h.syncIndexer();

    // ── Verify agent2 balance ────────────────────────────────────

    await step(h, "verify-agent2-balance", async () => {
      const cli = await h.cli([
        "balance", agentTokenAddress!, agent2Wallet.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      const balance = cli.data.balance as string;
      h.log(`Agent2 agent-token balance: ${balance}`);
      assert.equal(balance, directMintAmount, "agent2 received direct mint");
      return {cli, command: ["balance"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 5: VERIFY PROPOSALS + DAC STATE IN INDEXER
    // ══════════════════════════════════════════════════════════════

    await step(h, "verify-proposals", async () => {
      const cli = await h.view("proposals", ["--dac", dacAddress!]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      assert.defined(proposals, "proposals in indexer");
      // Expected: distributor approval + disable + direct mint = 3 proposals
      assert.gte(proposals?.length ?? 0, 3, "at least 3 governance proposals recorded");
      h.log(`Total proposals in DAC: ${proposals?.length}`);
      if (proposals) {
        for (const p of proposals) {
          h.log(`  Proposal #${p.proposalNumericId}: kind=${p.kindName ?? p.kindSelector}, executed=${p.executed}, passed=${p.passed}`);
        }
      }
      return {cli, command: ["dac", "view", "proposals"], indexerSnapshot: {proposals} as Record<string, unknown>};
    });

    // ── Verify DAC state + token entities ──────────────────────────

    await step(h, "verify-dac-state", async () => {
      const cli = await h.view("dac", ["--dac", dacAddress!]);
      const dac = cli.data.dac as Record<string, unknown>;
      assert.defined(dac, "DAC in indexer");
      h.log(`DAC: agentTokenAddress=${dac.agentTokenAddress}, mainTokenAddress=${dac.mainTokenAddress}`);
      return {cli, command: ["view", "dac"], indexerSnapshot: dac as Record<string, unknown>};
    });

    // ── Verify agent token total supply reflects all mints ────────
    // Distributor received 20k, agent2 received 15k = 35k total minted via governance
    // (founder allocation from DAC creation may also be reflected)

    await step(h, "verify-agent-token-balances", async () => {
      const agent1Cli = await h.cli([
        "balance", agentTokenAddress!, agent1Wallet.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      const agent2Cli = await h.cli([
        "balance", agentTokenAddress!, agent2Wallet.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      const agent1Balance = agent1Cli.data.balance as string;
      const agent2Balance = agent2Cli.data.balance as string;
      h.log(`Agent token balances: agent1(distributor)=${agent1Balance}, agent2(direct)=${agent2Balance}`);
      assert.equal(agent1Balance, distributorAmount, "agent1 distributor balance unchanged");
      assert.equal(agent2Balance, directMintAmount, "agent2 direct mint balance correct");

      return {
        cli: agent1Cli,
        command: ["balance"],
        indexerSnapshot: {agent1Balance, agent2Balance} as Record<string, unknown>,
      };
    });
  },
};
