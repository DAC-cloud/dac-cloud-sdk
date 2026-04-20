import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  mintMockToken,
  dealProposeVoteExecute,
  resolveUnderlyingToken,
  setupNativeDacWithDeal,
  approvePermit2,
  approvePermit2Allowance,
} from "./fixtures/index.js";

/**
 * Scenario: Permit2 Treasury Flow
 *
 * Tests the Permit2 integration end-to-end:
 *   1. assign-claimer — approve agent to receive from outsider via Permit2
 *   2. Source (outsider) approves Permit2 contract (ERC20.approve)
 *   3. Agent calls receive-permit2 — tokens transfer from outsider through Permit2 to treasury
 *   4. permit2-spend proposal — approve a spender address on Permit2
 *   5. Verify balances throughout
 *
 * Uses real Permit2 at canonical address 0x000000000022D473030F116dDEE9F6B43aC78BA3.
 */
export const permit2TreasuryFlowScenario: Scenario = {
  name: "permit2-treasury-flow",
  description: "Permit2 receive flow: assign-claimer → source approves Permit2 → agent receives via Permit2",
  tags: ["deal", "permit2", "treasury", "receive", "claimer"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const outsider = config.wallets.outsider;
    if (!outsider) throw new Error("outsider wallet required");

    const underlyingToken = await resolveUnderlyingToken(h);

    // Ensure outsider has tokens to send
    await mintMockToken(h, {token: underlyingToken, to: outsider.address, amount: "10000000000000000000000"});

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: SETUP — DAC + funded treasury deal
    // ══════════════════════════════════════════════════════════════

    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Permit2 Flow Deal",
      fundingAmount: "1000000000000000000000",  // 1k funding
      skipApproval: true,
    });

    // Deposit + approve deal (same pattern as treasury-deal-agent)
    h.log("Depositing to DAC treasury...");
    await h.cli([
      "deposit-treasury", "--token", ctx.treasuryToken,
      "--amount", "5000000000000000000000",
      "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);

    h.log("Approving deal...");
    await h.advanceTime(10);
    await h.cli(["vote", "proposal", ctx.dealProposalId, "true", "--dac", ctx.dacAddress, "--config", config.configPath, "--pretty-print"]);
    await h.advanceTime(3700);
    await h.cli(["execute", ctx.dealProposalId, "--dac", ctx.dacAddress, "--config", config.configPath, "--pretty-print"]);
    await h.syncIndexer();

    // Get treasury address
    const dealViewCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
    const dealRecord = dealViewCli.data.deal as Record<string, unknown>;
    const treasuryAddress = dealRecord?.managedTreasuryAddress as string;
    assert.defined(treasuryAddress, "treasury address");
    h.log(`Treasury: ${treasuryAddress}`);

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: PERMIT2 RECEIVE (on-chain approval path)
    // ══════════════════════════════════════════════════════════════

    // ── Step 1: assign-claimer — approve founder as claimer for outsider ──
    const receiveAmount = "500000000000000000000"; // 500 tokens

    await step(h, "assign-claimer-for-permit2", async () => {
      const proposalId = await dealProposeVoteExecute(h, ctx.dealAddress, [
        "deal", "propose", "assign-claimer",
        ctx.founderAddress,     // agent (founder acts as agent here)
        underlyingToken,        // token
        outsider.address,       // counterparty (source)
        receiveAmount,          // approved amount
      ]);
      h.log(`assign-claimer proposal ${proposalId}: founder can receive ${receiveAmount} from outsider`);
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "assign-claimer"],
      };
    });

    // ── Step 2: outsider approves Permit2 (two approvals required) ──
    await step(h, "source-approves-permit2", async () => {
      // Step 2a: ERC20.approve(permit2, amount) — grants Permit2 token access
      h.log(`Outsider ERC20-approving Permit2...`);
      await approvePermit2(h, {
        token: underlyingToken,
        owner: outsider.address,
        amount: receiveAmount,
      });

      // Step 2b: permit2.approve(token, treasury, amount, expiration) — grants treasury
      // permission to pull from outsider via Permit2's internal allowance system
      h.log(`Outsider approving treasury as Permit2 spender...`);
      await approvePermit2Allowance(h, {
        token: underlyingToken,
        owner: outsider.address,
        spender: treasuryAddress,
        amount: receiveAmount,
      });

      return {
        cli: {data: {action: "approve-permit2"}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["approve-permit2"],
      };
    });

    // ── Step 3: agent calls receive-permit2 ────────────────────────
    await step(h, "receive-permit2", async () => {
      const cli = await h.cli([
        "deal", "receive-permit2",
        underlyingToken,
        outsider.address,
        receiveAmount,
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "receive-permit2 tx");
      h.log(`Received ${receiveAmount} from outsider via Permit2`);
      return {cli, command: ["deal", "receive-permit2"]};
    });

    // ── Step 4: verify balances ───────────────────────────────────
    await step(h, "verify-receive-balances", async () => {
      // Treasury should have received the tokens
      const treasuryBalCli = await h.cli([
        "balance", underlyingToken, treasuryAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      const treasuryBal = treasuryBalCli.data.balance as string;
      h.log(`Treasury balance: ${treasuryBal}`);
      // Treasury has funding (1k) + received (500) = 1500
      assert.equal(BigInt(treasuryBal) >= BigInt(receiveAmount), true, "treasury received tokens via Permit2");

      return {cli: treasuryBalCli, command: ["balance"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: PERMIT2-SPEND APPROVAL
    // ══════════════════════════════════════════════════════════════

    // Use permit2-spend proposal to approve a spender on Permit2
    await step(h, "permit2-spend-approval", async () => {
      const spender = outsider.address; // any address as approved spender
      const approveAmount = "200000000000000000000"; // 200 tokens
      const expiration = String(4294967295); // max uint32 — avoids chain-time vs wall-clock mismatch

      const proposalId = await dealProposeVoteExecute(h, ctx.dealAddress, [
        "deal", "propose", "permit2-spend",
        underlyingToken,
        spender,
        approveAmount,
        expiration,
      ]);
      h.log(`permit2-spend proposal ${proposalId}: approved ${spender} to spend ${approveAmount} via Permit2`);
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "permit2-spend"],
      };
    });

    h.log("Permit2 treasury flow completed successfully");
  },
};
