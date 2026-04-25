import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {setupNativeDacWithDeal} from "./fixtures/index.js";

/**
 * Scenario: Deal Approve Deadline Expired
 *
 * Creates TWO deals in one DAC:
 * - Deal 1: Very short approveDeadline, skipApproval=true → expires
 * - Deal 2: Normal timeline → approved and active
 *
 * Tests:
 * - Expired deal remains inactive (not approved)
 * - DAC can still have other active deals
 * - Indexer correctly tracks both deals with different states
 */
export const dealApproveExpiredScenario: Scenario = {
  name: "deal-approve-expired",
  description: "Two deals: one expires before approval, one succeeds",
  tags: ["deal", "approve-deadline", "expiry", "multi-deal"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;

    // ── Deal 1: short approve deadline, skip approval ────────────

    h.log("Creating deal with short approve deadline (will expire)...");

    const ctx1 = await setupNativeDacWithDeal(h, {
      dealName: "Expiring Deal",
      approveDeadlineDelta: 60, // 60 seconds — will expire quickly
      skipApproval: true,
    });

    // ── Advance time past the approve deadline ───────────────────

    h.log("Advancing past approve deadline...");
    await h.advanceTime(120); // past 60-second deadline

    // ── Try to approve — should fail ─────────────────────────────

    await step(h, "attempt-expired-approval", async () => {
      await h.advanceTime(10);
      await h.cli([
        "vote", "proposal", ctx1.dealProposalId, "true", "--dac", ctx1.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      await h.advanceTime(3700);

      const args = [
        "execute", ctx1.dealProposalId, "--dac", ctx1.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ];
      const cli = await h.cli(args, {allowFailure: true});

      h.log(`Expired deal execute attempt: exitCode=${cli.exitCode}, data=${JSON.stringify(cli.data)}`);
      // CLI may return exitCode=0 with empty {} or exitCode!=0 — either way the deal should not activate
      if (cli.exitCode === 0) {
        // Empty {} response is a known CLI UX observation — silent no-op on expired execution
        h.log("Note: CLI returned empty {} on expired execution (no error surfaced to user)");
      }

      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Verify deal 1 still inactive (approve deadline expired) ──

    await step(h, "verify-deal-1-inactive", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx1.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "expired deal in indexer");

      if (deal) {
        h.log(`Expired deal: active=${deal.active}, closed=${deal.closed}, updatedBlockNumber=${deal.updatedBlockNumber}`);
        assert.equal(deal.active, false, "expired deal not active");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // Verify the DAC proposal state — executed but deal approval failed
    await step(h, "verify-expired-proposal-state", async () => {
      const cli = await h.view("proposals", ["--dac", ctx1.dacAddress]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      const dealProp = proposals?.find((p) =>
        String(p.proposalNumericId ?? p.proposalId) === ctx1.dealProposalId,
      );
      assert.defined(dealProp, "deal approval proposal in indexer");
      if (dealProp) {
        h.log(`Deal approval proposal: executed=${dealProp.executed}, passed=${dealProp.passed}`);
      }
      return {cli, command: ["view", "proposals"], indexerSnapshot: {dealProposal: dealProp} as Record<string, unknown>};
    });

    // ── Deal 2: normal timeline in the same DAC ──────────────────

    h.log("Creating second deal with normal timeline...");

    // Need to re-mint agent tokens since the first batch was used for deal 1
    // Use proposeVoteExecute from the same DAC
    const {proposeVoteExecute} = await import("./fixtures/index.js");
    await proposeVoteExecute(h, ctx1.dacAddress, [
      "propose", "mint-agent-tokens", "100000000000000000000000", ctx1.founderAddress,
    ]);
    await h.syncIndexer();

    const {writeFileSync} = await import("node:fs");
    const {join} = await import("node:path");
    const {tmpdir} = await import("node:os");
    const {getChainTimestamp, resolveUnderlyingToken, ZERO_ADDR} = await import("./fixtures/index.js");

    const chainTimestamp = await getChainTimestamp(h);

    const deal2Config = {
      dealKind: "permit2-treasury",
      name: "Normal Deal (succeeds)",
      description: "Second deal with normal timeline",
      linkHash: "seed://qa-deal-normal",
      fundingToken: ctx1.treasuryToken,
      fundingAmount: "0",
      rewardsLimit: "100000000000000000000000",
      dealRewardPoolPercent: "0",
      approveDeadline: String(chainTimestamp + 86400 * 7),
      evaluationDeadline: String(chainTimestamp + 86400 * 15),
      dealDeadline: String(chainTimestamp + 86400 * 60),
      dealConfig: {},
      evaluatorSelector: "milestones-evaluator",
      evaluatorConfig: {
        rewardShare: "1000000000000000000",
        milestones: [{
          milestoneType: 0,
          token: ctx1.treasuryToken,
          oracle: ZERO_ADDR,
          valuationMode: 0,
          fundingToken: ZERO_ADDR,
          expectedReturn: "1000000000000000000000",
          timestamp: String(chainTimestamp + 86400 * 7),
          rewardPercentage: "1000000000000000000",
          rewardCurve: ["0"],
          penaltyCurve: ["0", "1000000000000000000"],
          minPercentGrace: "0",
          extension: "0",
        }],
      },
      vetoEnabled: false,
      agentsLimit: "0",
      minimalStake: "0",
    };

    const deal2Path = join(tmpdir(), `qa-deal-normal-${Date.now()}.json`);
    writeFileSync(deal2Path, JSON.stringify(deal2Config, null, 2));

    const deal2Cli = await h.cli([
      "deal", "create", deal2Path, "--dac", ctx1.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);

    const deal2Address = deal2Cli.data.dealAddress as string;
    const deal2Cell = deal2Cli.data.dealCell as string;
    const deal2ProposalId = String(deal2Cli.data.dacProposalId ?? "");

    await h.syncIndexer();

    // Stake + approve deal 2
    await h.cli([
      "deal", "stake", "10000000000000000000000",
      "--deal-address", deal2Cell, "--dac", ctx1.dacAddress, "--auto-delegate",
      "--config", config.configPath, "--pretty-print",
    ]);

    await h.advanceTime(10);
    await h.cli([
      "vote", "proposal", deal2ProposalId, "true", "--dac", ctx1.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", deal2ProposalId, "--dac", ctx1.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);

    await h.syncIndexer();

    // ── Verify deal 2 is active ──────────────────────────────────

    await step(h, "verify-deal-2-active", async () => {
      const cli = await h.dealView("deal", ["--deal-address", deal2Address]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "normal deal in indexer");

      if (deal) {
        h.log(`Normal deal: active=${deal.active}, closed=${deal.closed}`);
        assert.equal(deal.active, true, "normal deal is active");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Verify agents can unstake from expired deal 1 ─────────────
    // When a deal's approve deadline expires, staked agents should be able
    // to unstake and recover their AgentTokens.

    await step(h, "unstake-from-expired-deal", async () => {
      const cli = await h.cli([
        "deal", "unstake",
        "--deal-address", ctx1.dealCell,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "unstake from expired deal tx hash");
      h.log("Unstaked from expired deal");
      return {cli, command: ["deal", "unstake"]};
    });

    await h.syncIndexer();

    await step(h, "verify-unstake-from-expired", async () => {
      const cli = await h.dealView("positions", ["--deal-address", ctx1.dealAddress]);
      const positions = cli.data.positions as Array<Record<string, unknown>> | undefined;
      assert.defined(positions, "positions after unstake");
      if (positions && positions.length > 0) {
        const pos = positions[0];
        h.log(`After unstake: staked=${pos.currentStakedAmount}, released=${pos.totalReleasedAmount}`);
        assert.equal(pos.currentStakedAmount, "0", "stake is 0 after unstake from expired deal");
        assert.equal(
          BigInt(pos.totalReleasedAmount as string) > 0n,
          true,
          "tokens released on unstake from expired deal",
        );
      }
      return {cli, command: ["deal", "view", "positions"], indexerSnapshot: {positions} as Record<string, unknown>};
    });

    // ── Verify both deals visible in DAC ─────────────────────────

    await step(h, "verify-two-deals-in-dac", async () => {
      const cli = await h.view("deals", ["--dac", ctx1.dacAddress]);
      const deals = cli.data.deals as Array<Record<string, unknown>> | undefined;
      assert.defined(deals, "deals list");
      assert.gte(deals?.length ?? 0, 2, "at least 2 deals in DAC");

      if (deals) {
        const activeDeals = deals.filter((d) => d.active === true);
        const inactiveDeals = deals.filter((d) => d.active === false);
        h.log(`DAC deals: ${deals.length} total, ${activeDeals.length} active, ${inactiveDeals.length} inactive`);
      }

      return {cli, command: ["dac", "view", "deals"], indexerSnapshot: {deals} as Record<string, unknown>};
    });
  },
};
