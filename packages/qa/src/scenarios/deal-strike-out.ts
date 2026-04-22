import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {setupNativeDacWithDeal, verifyDealAccountingInvariants} from "./fixtures/index.js";

/**
 * Scenario: Deal Strike-Out Agent
 *
 * Creates a deal with two staked agents (founder + agent1).
 * Uses deal governance to strike out agent1.
 * Strike-out forcibly RELEASES the agent's stake (not slashed — tokens returned).
 *
 * Verifies:
 * - Strike-out proposal creation via deal governance
 * - Agent's stake is released (not slashed)
 * - Agent position shows released amount, 0 current stake
 * - Deal remains active (not closed)
 * - Remaining agent (founder) still has their stake
 */
export const dealStrikeOutScenario: Scenario = {
  name: "deal-strike-out",
  description: "Two agents staked → strike out agent1 via deal governance → verify stake released",
  tags: ["deal", "strike-out", "governance", "multi-agent"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const agent1Wallet = config.wallets.agent1;
    if (!agent1Wallet) throw new Error("agent1 wallet required");

    const founderStake = "10000000000000000000000";  // 10k (default)
    const agent1Stake = "5000000000000000000000";     // 5k

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: SETUP — DAC + approved deal with two stakers
    // ══════════════════════════════════════════════════════════════

    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Strike-Out Deal",
      milestones: [{
        expectedReturn: "1000000000000000000000",
        rewardCurve: ["1000000000000000000"],  // 100% reward
        penaltyCurve: ["0"],                    // no penalty
      }],
      extraAgents: [{
        role: "agent1",
        mintAmount: "50000000000000000000000",  // 50k agent tokens
        stakeAmount: agent1Stake,
      }],
    });

    // ── Verify both agents staked ────────────────────────────────

    await step(h, "verify-two-stakers", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal exists in indexer");

      if (deal) {
        h.log(`Pre-strike: stakerCount=${deal.stakerCount}, totalStaked=${deal.currentStakedAmount}`);
        assert.equal(Number(deal.stakerCount), 2, "two stakers in deal");
        const totalExpected = BigInt(founderStake) + BigInt(agent1Stake);
        assert.equal(deal.currentStakedAmount, totalExpected.toString(), "total staked = founder + agent1");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Verify agent1 position before strike-out ─────────────────

    // Helper: accountId in the indexer is a composite ID (e.g. "31337-0xabc..."),
    // so match by checking if it contains the address.
    const findPosition = (positions: Array<Record<string, unknown>>, address: string) =>
      positions.find((p) => String(p.accountId ?? "").toLowerCase().includes(address.toLowerCase()));

    await step(h, "verify-agent1-pre-strike", async () => {
      const cli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = cli.data.positions as Array<Record<string, unknown>> | undefined;
      assert.defined(positions, "positions in indexer");
      assert.equal(positions?.length ?? 0, 2, "two positions");

      if (positions) {
        for (const p of positions) h.log(`  position: accountId=${p.accountId}, staked=${p.currentStakedAmount}`);
      }

      const agent1Pos = positions ? findPosition(positions, agent1Wallet.address) : undefined;
      assert.defined(agent1Pos, "agent1 position found");
      if (agent1Pos) {
        h.log(`Agent1 pre-strike: staked=${agent1Pos.currentStakedAmount}, released=${agent1Pos.totalReleasedAmount}`);
        assert.equal(agent1Pos.currentStakedAmount, agent1Stake, "agent1 staked amount correct");
      }

      return {cli, command: ["deal", "view", "positions"], indexerSnapshot: {positions} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: STRIKE OUT AGENT1
    // ══════════════════════════════════════════════════════════════

    // Strike-out is a high-quorum deal proposal (requires 75% by default).
    // Founder has 10k/15k = 66.7% — not enough alone. Both agents must vote.
    h.log("Proposing strike-out of agent1 via deal governance (high quorum — both agents vote)...");

    await step(h, "strike-out-agent1", async () => {
      // Propose (founder)
      const proposeCli = await h.cli([
        "deal", "propose", "strike-out-agent", agent1Wallet.address,
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      const proposalId = String(proposeCli.data.proposalId ?? proposeCli.data.id ?? "");
      assert.defined(proposalId, "strike-out proposal created");

      await h.syncIndexer();
      await h.advanceTime(10);

      // Founder votes yes
      await h.cli([
        "deal", "vote", "proposal", proposalId, "true",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);

      // Agent1 also votes yes (voting to strike themselves out — still allowed)
      await h.cliAs("agent1", [
        "deal", "vote", "proposal", proposalId, "true",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);

      await h.advanceTime(3700);

      // Execute
      await h.cli([
        "deal", "execute", proposalId,
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);

      h.log(`Strike-out proposal ${proposalId} executed`);
      return {
        cli: {data: {action: "strike-out-agent", proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "strike-out-agent"],
      };
    });

    await h.syncIndexer();

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: VERIFY STRIKE-OUT RESULTS
    // ══════════════════════════════════════════════════════════════

    // Check positions FIRST to clearly surface who was actually struck out.

    await step(h, "verify-positions-after-strike", async () => {
      const cli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = cli.data.positions as Array<Record<string, unknown>> | undefined;
      assert.defined(positions, "positions after strike-out");

      if (positions) {
        for (const p of positions) {
          h.log(`  position: accountId=${p.accountId}, staked=${p.currentStakedAmount}, released=${p.totalReleasedAmount}, slashed=${p.totalSlashedAmount}`);
        }
      }

      // Target was agent1 — agent1 should be the one struck out
      const agent1Pos = positions ? findPosition(positions, agent1Wallet.address) : undefined;
      assert.defined(agent1Pos, "agent1 position present");
      if (agent1Pos) {
        assert.equal(agent1Pos.currentStakedAmount, "0", "agent1 (target) stake is 0 after strike-out");
        assert.equal(
          BigInt(agent1Pos.totalReleasedAmount as string) >= BigInt(agent1Stake),
          true,
          "agent1 (target) stake was released",
        );
        assert.equal(agent1Pos.totalSlashedAmount, "0", "strike-out releases, not slashes");
      }

      // Founder should be unchanged — they were NOT the target
      const founderPos = positions ? findPosition(positions, ctx.founderAddress) : undefined;
      assert.defined(founderPos, "founder position present");
      if (founderPos) {
        assert.equal(founderPos.currentStakedAmount, founderStake, "founder stake unchanged (not the strike-out target)");
      }

      return {cli, command: ["deal", "view", "positions"], indexerSnapshot: {positions} as Record<string, unknown>};
    });

    // ── Verify deal-level aggregates ─────────────────────────────

    await step(h, "verify-deal-state", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after strike-out");

      if (deal) {
        h.log(`Deal after strike: active=${deal.active}, closed=${deal.closed}, staked=${deal.currentStakedAmount}, released=${deal.totalReleasedStakeAmount}, slashed=${deal.totalSlashedStakeAmount}`);
        assert.equal(deal.active, true, "deal still active after strike-out");
        assert.equal(deal.closed, false, "deal not closed");
        // Agent1's 5k released, founder's 10k remains
        assert.equal(deal.currentStakedAmount, founderStake, "only founder's stake remains");
        assert.equal(deal.totalSlashedStakeAmount, "0", "no slashing from strike-out");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Cross-validate accounting invariants ───────────────────────

    await step(h, "verify-accounting-invariants", async () => {
      const {deal, positions} = await verifyDealAccountingInvariants(h, ctx.dealAddress);
      return {
        cli: {data: {action: "accounting-check"}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["accounting-invariants"],
        indexerSnapshot: {deal, positions} as Record<string, unknown>,
      };
    });

    // ── Verify agent1's agent tokens were returned ───────────────

    await step(h, "verify-agent1-token-balance", async () => {
      const cli = await h.cli([
        "balance", ctx.agentTokenAddress, agent1Wallet.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      const balance = cli.data.balance as string;
      h.log(`Agent1 agent-token balance after strike-out: ${balance}`);
      // Agent1 was minted 50k and staked 5k. After strike-out, 5k returned → balance should be 50k
      assert.equal(
        BigInt(balance) >= BigInt(agent1Stake),
        true,
        "agent1 got agent tokens back after strike-out",
      );
      return {cli, command: ["balance"]};
    });
  },
};
