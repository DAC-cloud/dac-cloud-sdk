import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {setupNativeDacWithDeal} from "./fixtures/index.js";

/**
 * Scenario: Deal Veto (Challenge) — All Four Paths
 *
 * Exercises the full DAC challenge state machine end-to-end. Uses one deal
 * (vetoEnabled=true) and creates four independent deal proposals — one per
 * path — so the cause of each `execute()` outcome can be isolated.
 *
 * Contract semantics (DealManagementProposal.registerDACChallenge):
 *   - Challenge is registered IMMEDIATELY when the DAC `propose challenge-deal`
 *     proposal is created — not when it's voted/executed. This flips
 *     `dealProposal.challenged=true` and suspends execution before any DAC
 *     vote happens.
 *   - Challenges are single-shot per deal proposal (ProposalAlreadyChallenged
 *     on second attempt). Allowed any time while
 *     `!isExecuted() && !isExecutionExpired()`.
 *   - Execution gating (`_executionAvailableFrom`):
 *       • No challenge → available at resolutionTime (normal)
 *       • Challenge unresolved → blocked indefinitely → ProposalNotExecutable
 *       • Challenge resolved-failed → available at max(resolution times)
 *       • Challenge resolved-passed-executed → permanently blocked
 *       • Challenge resolved-passed-EXPIRED-unexecuted → lifts (challenge lapsed)
 *
 * Quorum-isolation: the deal must reach quorum on the deal proposal before
 * attempting execute, otherwise the revert reason is `VoteNotPassed()`
 * (under-quorum) and we can't tell whether the veto was the actual cause.
 * Founder (10k stake) + agent1 (5k stake) both vote yes on every deal
 * proposal — 15k of 15k = 100%, comfortably above 75% high quorum.
 *
 * Paths:
 *   Path 1: Challenge filed DURING deal voting    → blocks (challenge unresolved)
 *   Path 2: Challenge filed AFTER deal resolves   → blocks (challenge unresolved)
 *   Path 3: Challenge passes but NEVER EXECUTES   → lapses past executionValidityDuration
 *                                                → deal proposal CAN execute
 *   Path 4: Challenge PASSES and is executed      → deal proposal permanently blocked
 *
 * Reverts:
 *   - Blocked deal execute → ProposalNotExecutable() (the veto signal)
 *   - In Path 4, the deal proposal has passed=true, so the only possible
 *     cause of ProposalNotExecutable is the veto — quorum is ruled out.
 *
 * Indexer fields verified:
 *   - Proposal (deal scope): challenged, executed, passed
 *   - Deal: proposalChallenges relation (one entry per filed challenge)
 */
export const dealVetoScenario: Scenario = {
  name: "deal-veto",
  description: "DAC challenge state machine — 4 paths (during voting, after resolve, failed, passed)",
  tags: ["deal", "veto", "challenge", "governance"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;

    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Veto Test Deal",
      vetoEnabled: true,
      extraAgents: [{
        role: "agent1",
        mintAmount: "50000000000000000000000",
        stakeAmount: "5000000000000000000000",
      }],
    });

    // ── Verify veto is enabled on the deal ──────────────────────

    await step(h, "verify-veto-enabled", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal exists");
      if (deal) {
        h.log(`Deal: vetoEnabled=${deal.vetoEnabled}`);
        assert.equal(deal.vetoEnabled, true, "veto enabled on deal");
      }
      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Configure full DAC voting config (required for challenge auto-resolve) ──
    // Native `dac create` only sets `defaultQuorum` (=50%). Other config
    // fields — including `executionValidityDuration` — default to 0 on the
    // contract. Challenges created with executionValidityDuration=0 never
    // compute an `executionDeadline` and cannot transition to resolved-failed
    // via the time-based path. We set the full config here so Path 3's
    // auto-resolve-after-timeout works correctly.
    h.log("Configuring full DAC voting config (quorum=50, blocking=25, highQuorum=75, duration=3600, qualification=0, execValidityDuration=86400)...");
    await h.cli([
      "propose", "update-voting-config", "50", "25", "75", "3600", "0", "86400",
      "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    // Proposal IDs after fixture setup: 1=mint(founder), 2=approve-deal,
    // 3=mint(agent1) — so this update-voting-config is proposal 4.
    const updateConfigProposalId = "4";
    await h.advanceTime(10);
    await h.cli([
      "vote", "proposal", updateConfigProposalId, "true",
      "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", updateConfigProposalId,
      "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // NOTE on timing throughout this scenario:
    //   Deal proposals auto-resolve via _checkAndEmitResolution the moment
    //   their yes votes reach quorum. With founder (10k) + agent1 (5k) = 15k
    //   and high-quorum at 75% × 15k = 11.25k, the proposal resolves-passed
    //   on agent1's vote — we do NOT need to advance to votingDuration
    //   endTime for the deal proposal to become executable.
    //
    //   Challenge proposals (CAST_VETO_DEAL) auto-resolve as failed when
    //   their voting period expires without reaching quorum. To keep a
    //   challenge UNRESOLVED in Paths 1 and 2, we must attempt the deal
    //   execute BEFORE the challenge's votingDuration (3600s) has elapsed.
    //   For Path 3 (resolved-failed) we deliberately advance past the
    //   challenge voting period so the no-quorum auto-fail fires.

    // ── Helpers scoped to this scenario ─────────────────────────

    async function proposeDealAction(actionLabel: string, payload: string): Promise<string> {
      const cli = await h.cliAs("agent1", [
        "deal", "propose", "toggle-early-returns", payload,
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath,
        "--pretty-print",
      ]);
      const id = String(cli.data.proposalId ?? cli.data.id ?? "");
      assert.defined(cli.data.proposalId, `${actionLabel}: deal proposal id present`);
      h.log(`${actionLabel}: created deal proposal id=${id}`);
      return id;
    }

    async function voteDealProposal(proposalId: string, role: "founder" | "agent1", support: boolean) {
      const args = [
        "deal", "vote", "proposal", proposalId, String(support),
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath,
        "--pretty-print",
      ];
      if (role === "founder") {
        await h.cli(args);
      } else {
        await h.cliAs(role, args);
      }
    }

    async function dacChallengeDealProposal(dealProposalId: string): Promise<string> {
      const cli = await h.cli([
        "propose", "challenge-deal", ctx.dealNumericId, dealProposalId,
        "--dac", ctx.dacAddress,
        "--config", config.configPath,
        "--pretty-print",
      ]);
      const id = String(cli.data.proposalId ?? cli.data.id ?? "");
      assert.defined(cli.data.proposalId, "DAC challenge proposal id present");
      return id;
    }

    async function voteAndExecuteDacChallenge(challengeProposalId: string, support: boolean) {
      await h.advanceTime(10);
      await h.cli([
        "vote", "proposal", challengeProposalId, String(support),
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      await h.advanceTime(3700);
      // For support=true → execute should succeed
      // For support=false → execute should fail (VoteNotPassed) but still
      //   triggers _checkAndEmitResolution and resolves the challenge as failed
      return h.cli([
        "execute", challengeProposalId,
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: !support});
    }

    async function attemptDealExecute(proposalId: string, role: "founder" | "agent1") {
      const args = [
        "deal", "execute", proposalId,
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ];
      return role === "founder"
        ? h.cli(args, {allowFailure: true})
        : h.cliAs(role, args, {allowFailure: true});
    }

    async function readDealProposal(proposalId: string): Promise<Record<string, unknown> | undefined> {
      const cli = await h.dealView("proposals", ["--deal-address", ctx.dealAddress]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      return proposals?.find((p) => String(p.proposalNumericId ?? p.id) === proposalId);
    }

    // ══════════════════════════════════════════════════════════════
    // PATH 1: CHALLENGE FILED DURING DEAL PROPOSAL VOTING PHASE
    // ══════════════════════════════════════════════════════════════
    //
    // Deal proposal created → challenge filed BEFORE any deal vote →
    // founder+agent1 vote yes (deal proposal reaches quorum & resolves) →
    // attempt deal execute → blocked because challenge is unresolved.

    let path1DealProposalId: string;
    let path1ChallengeProposalId: string;

    await step(h, "path1-create-deal-proposal", async () => {
      path1DealProposalId = await proposeDealAction("path1", "true");
      await h.syncIndexer();
      const dp = await readDealProposal(path1DealProposalId);
      assert.defined(dp, "path1 deal proposal in indexer");
      assert.equal(dp?.challenged, false, "path1: not yet challenged");
      const cli = await h.dealView("proposals", ["--deal-address", ctx.dealAddress]);
      return {cli, command: ["deal", "view", "proposals"], indexerSnapshot: {dealProposal: dp} as Record<string, unknown>};
    });

    await step(h, "path1-dac-files-challenge-during-voting", async () => {
      path1ChallengeProposalId = await dacChallengeDealProposal(path1DealProposalId!);
      h.log(`path1: DAC challenge filed during deal voting, challengeProposalId=${path1ChallengeProposalId}`);
      await h.syncIndexer();

      const dp = await readDealProposal(path1DealProposalId!);
      assert.defined(dp, "path1 deal proposal after challenge");
      assert.equal(dp?.challenged, true, "path1: challenged=true immediately after DAC propose");

      const cli = await h.view("proposals", ["--dac", ctx.dacAddress]);
      return {cli, command: ["view", "proposals"], indexerSnapshot: {dealProposal: dp, challengeProposalId: path1ChallengeProposalId} as Record<string, unknown>};
    });

    await step(h, "path1-vote-deal-proposal-to-quorum", async () => {
      // Both stakers vote yes — 10k + 5k = 15k of 15k → comfortably above
      // 75% high quorum (11.25k). The deal proposal auto-resolves on
      // agent1's vote (quorum reached mid-vote). We do NOT advance past
      // challenge voting period (3600s) — Path 1 specifically tests the
      // "challenge unresolved" state, which requires us to attempt execute
      // while the challenge is still within its voting window.
      await h.advanceTime(10);
      await voteDealProposal(path1DealProposalId!, "founder", true);
      await voteDealProposal(path1DealProposalId!, "agent1", true);
      await h.syncIndexer();

      const dp = await readDealProposal(path1DealProposalId!);
      assert.defined(dp, "path1 deal proposal after voting");
      h.log(`path1 after voting: passed=${dp?.passed}, resolved=${dp?.resolved}, yesVotes=${dp?.yesVotes}, executed=${dp?.executed}`);
      assert.equal(dp?.passed, true, "path1: deal proposal passed quorum (only challenge can block now)");
      assert.equal(dp?.executed, false, "path1: not yet executed");
      assert.equal(dp?.challenged, true, "path1: still challenged");

      const cli = await h.dealView("proposals", ["--deal-address", ctx.dealAddress]);
      return {cli, command: ["deal", "view", "proposals"], indexerSnapshot: {dealProposal: dp} as Record<string, unknown>};
    });

    await step(h, "path1-execute-blocked-by-unresolved-challenge", async () => {
      const cli = await attemptDealExecute(path1DealProposalId!, "agent1");
      h.log(`path1 execute: exitCode=${cli.exitCode}, stderr=${cli.stderr?.slice(0, 200)}`);

      assert.equal(cli.exitCode !== 0, true, "path1: execute reverted");
      assert.equal(
        cli.stderr?.includes("ProposalNotExecutable") ?? false, true,
        "path1: revert reason is ProposalNotExecutable (challenge unresolved), NOT VoteNotPassed",
      );

      await h.syncIndexer();
      const dp = await readDealProposal(path1DealProposalId!);
      assert.equal(dp?.executed, false, "path1: deal proposal still not executed");
      return {cli, command: ["deal", "execute"], indexerSnapshot: {dealProposal: dp} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // PATH 2: CHALLENGE FILED AFTER DEAL PROPOSAL HAS PASSED
    // ══════════════════════════════════════════════════════════════
    //
    // Deal proposal voted-to-quorum first → challenge filed AFTER passing
    // (but before any execute attempt) → execute still blocked.

    let path2DealProposalId: string;
    let path2ChallengeProposalId: string;

    await step(h, "path2-create-and-vote-deal-proposal", async () => {
      path2DealProposalId = await proposeDealAction("path2", "false");
      await h.syncIndexer();
      await h.advanceTime(10);
      await voteDealProposal(path2DealProposalId, "founder", true);
      await voteDealProposal(path2DealProposalId, "agent1", true);
      // Deal proposal auto-resolves on agent1's vote (quorum reached).
      // We do not advance past challenge voting period because the challenge
      // will be filed shortly and must remain unresolved at execute time.
      await h.syncIndexer();

      const dp = await readDealProposal(path2DealProposalId);
      assert.equal(dp?.passed, true, "path2: deal proposal passed before any challenge");
      assert.equal(dp?.executed, false, "path2: not yet executed");
      assert.equal(dp?.challenged, false, "path2: no challenge yet");

      const cli = await h.dealView("proposals", ["--deal-address", ctx.dealAddress]);
      return {cli, command: ["deal", "view", "proposals"], indexerSnapshot: {dealProposal: dp} as Record<string, unknown>};
    });

    await step(h, "path2-dac-files-challenge-after-resolve", async () => {
      path2ChallengeProposalId = await dacChallengeDealProposal(path2DealProposalId!);
      h.log(`path2: DAC challenge filed AFTER deal proposal resolved, challengeProposalId=${path2ChallengeProposalId}`);
      await h.syncIndexer();

      const dp = await readDealProposal(path2DealProposalId!);
      assert.equal(dp?.challenged, true, "path2: challenged after registration");
      assert.equal(dp?.passed, true, "path2: passed flag preserved");

      const cli = await h.view("proposals", ["--dac", ctx.dacAddress]);
      return {cli, command: ["view", "proposals"], indexerSnapshot: {dealProposal: dp, challengeProposalId: path2ChallengeProposalId} as Record<string, unknown>};
    });

    await step(h, "path2-execute-blocked-by-unresolved-challenge", async () => {
      const cli = await attemptDealExecute(path2DealProposalId!, "agent1");
      h.log(`path2 execute: exitCode=${cli.exitCode}, stderr=${cli.stderr?.slice(0, 200)}`);

      assert.equal(cli.exitCode !== 0, true, "path2: execute reverted");
      assert.equal(
        cli.stderr?.includes("ProposalNotExecutable") ?? false, true,
        "path2: revert reason is ProposalNotExecutable (challenge unresolved)",
      );

      await h.syncIndexer();
      const dp = await readDealProposal(path2DealProposalId!);
      assert.equal(dp?.executed, false, "path2: deal proposal not executed");
      return {cli, command: ["deal", "execute"], indexerSnapshot: {dealProposal: dp} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // PATH 3: CHALLENGE INEFFECTIVE (PASSED BUT LAPSED) → DEAL EXECUTES
    // ══════════════════════════════════════════════════════════════
    //
    // Deal proposal voted to quorum → DAC challenge filed → DAC votes YES
    // and the challenge resolves-passed → BUT no one executes the challenge
    // within executionValidityDuration (86400s) → challenge "lapses"
    // (resolved-passed, NOT-executed, EXPIRED) → deal proposal's
    // _executionAvailableFrom returns `executionDeadline` → deal becomes
    // executable. This tests the "DAC fails to follow through" path: the
    // challenge was approved but governance never enacted it in time, so
    // the block is lifted.
    //
    // NOTE: The protocol-truth "challenge resolved-failed" path (via NO
    // votes triggering early-blocking) would require blockingQuorum > 0 on
    // the challenge proposal, but CAST_VETO_DEAL proposals use the kernel
    // default of blockingQuorum=0 even after update-voting-config — likely
    // a deliberate design choice (a DAC veto shouldn't be vote-blockable
    // by a small minority). Time-based auto-resolve via _checkAndEmitResolution
    // requires a non-reverting transaction; the "execute-to-trigger" pattern
    // reverts and rolls back the state change. The lapsed path is the
    // cleanest way to test "an ineffective challenge" given these constraints.

    let path3DealProposalId: string;
    let path3ChallengeProposalId: string;

    await step(h, "path3-create-and-vote-deal-proposal", async () => {
      path3DealProposalId = await proposeDealAction("path3", "true");
      await h.syncIndexer();
      await h.advanceTime(10);
      await voteDealProposal(path3DealProposalId, "founder", true);
      await voteDealProposal(path3DealProposalId, "agent1", true);
      await h.syncIndexer();
      const dp = await readDealProposal(path3DealProposalId);
      assert.equal(dp?.passed, true, "path3: deal proposal passed");
      const cli = await h.dealView("proposals", ["--deal-address", ctx.dealAddress]);
      return {cli, command: ["deal", "view", "proposals"], indexerSnapshot: {dealProposal: dp} as Record<string, unknown>};
    });

    await step(h, "path3-dac-files-and-passes-challenge-but-doesnt-execute", async () => {
      path3ChallengeProposalId = await dacChallengeDealProposal(path3DealProposalId!);
      h.log(`path3: challenge filed, challengeProposalId=${path3ChallengeProposalId}`);
      await h.syncIndexer();

      // Founder votes YES on challenge — with 1M voting power and 50%
      // quorum (=500k), the challenge resolves-passed immediately on this
      // vote (_checkAndEmitResolution fires).
      await h.advanceTime(10);
      await h.cli([
        "vote", "proposal", path3ChallengeProposalId, "true",
        "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);

      await h.syncIndexer();
      const challengeProp = (await h.view("proposals", ["--dac", ctx.dacAddress])).data.proposals as Array<Record<string, unknown>> | undefined;
      const cp = challengeProp?.find((p) =>
        String(p.proposalNumericId ?? p.proposalId) === path3ChallengeProposalId,
      );
      assert.equal(cp?.resolved, true, "path3: challenge resolved on yes vote");
      assert.equal(cp?.passed, true, "path3: challenge passed");
      assert.equal(cp?.executed, false, "path3: challenge NOT executed (we leave it pending)");

      // DELIBERATELY do not execute the challenge. Advance past its
      // executionValidityDuration (86400s = 1 day) so the challenge "lapses".
      h.log(`path3: skipping challenge execute on purpose, advancing past executionValidityDuration (86400s)...`);
      await h.advanceTime(86400 + 100);
      await h.syncIndexer();

      const cli = await h.view("proposals", ["--dac", ctx.dacAddress]);
      const updated = (cli.data.proposals as Array<Record<string, unknown>>)?.find((p) =>
        String(p.proposalNumericId ?? p.proposalId) === path3ChallengeProposalId,
      );
      h.log(`path3 challenge after lapse: resolved=${updated?.resolved}, passed=${updated?.passed}, executed=${updated?.executed}, executionExpired=${updated?.executionExpired}`);
      assert.equal(updated?.executed, false, "path3: challenge still not executed (lapsed)");

      return {cli, command: ["view", "proposals"], indexerSnapshot: {challengeProposal: updated} as Record<string, unknown>};
    });

    await step(h, "path3-deal-executes-after-challenge-lapsed", async () => {
      const cli = await attemptDealExecute(path3DealProposalId!, "agent1");
      h.log(`path3 deal execute: exitCode=${cli.exitCode}`);

      assert.equal(cli.exitCode, 0, "path3: deal execute SUCCEEDS after challenge lapsed (expired unexecuted)");
      assert.defined(cli.data.txHash, "path3: execute tx hash present");

      await h.syncIndexer();
      const dp = await readDealProposal(path3DealProposalId!);
      assert.equal(dp?.executed, true, "path3: deal proposal executed");
      assert.equal(dp?.passed, true, "path3: deal proposal passed (unchanged)");
      assert.equal(dp?.challenged, true, "path3: challenged flag preserved");
      return {cli, command: ["deal", "execute"], indexerSnapshot: {dealProposal: dp} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // PATH 4: APPROVED CHALLENGE → PERMANENT BLOCK
    // ══════════════════════════════════════════════════════════════
    //
    // Deal proposal voted to quorum → challenge filed → DAC votes YES on
    // challenge → challenge executed → deal proposal permanently blocked.
    // Crucially the deal proposal HAS reached quorum (`passed=true`), so
    // the only possible cause of `ProposalNotExecutable` on execute is the
    // challenge, not under-quorum.

    let path4DealProposalId: string;
    let path4ChallengeProposalId: string;

    await step(h, "path4-create-and-vote-deal-proposal", async () => {
      path4DealProposalId = await proposeDealAction("path4", "false");
      await h.syncIndexer();
      await h.advanceTime(10);
      await voteDealProposal(path4DealProposalId, "founder", true);
      await voteDealProposal(path4DealProposalId, "agent1", true);
      // Deal proposal auto-resolves on agent1's vote (15k > 11.25k quorum)
      await h.syncIndexer();

      const dp = await readDealProposal(path4DealProposalId);
      assert.equal(dp?.passed, true, "path4: deal proposal passed quorum BEFORE any challenge");
      assert.equal(dp?.executed, false, "path4: not yet executed");
      assert.equal(dp?.challenged, false, "path4: not yet challenged");

      const cli = await h.dealView("proposals", ["--deal-address", ctx.dealAddress]);
      return {cli, command: ["deal", "view", "proposals"], indexerSnapshot: {dealProposal: dp} as Record<string, unknown>};
    });

    await step(h, "path4-dac-files-and-passes-challenge", async () => {
      path4ChallengeProposalId = await dacChallengeDealProposal(path4DealProposalId!);
      h.log(`path4: challenge filed, challengeProposalId=${path4ChallengeProposalId}`);
      await h.syncIndexer();

      const cli = await voteAndExecuteDacChallenge(path4ChallengeProposalId, true);
      assert.equal(cli.exitCode, 0, "path4: challenge execute SUCCEEDS");

      await h.syncIndexer();
      const proposalsCli = await h.view("proposals", ["--dac", ctx.dacAddress]);
      const proposals = proposalsCli.data.proposals as Array<Record<string, unknown>> | undefined;
      const challengeProp = proposals?.find((p) =>
        String(p.proposalNumericId ?? p.proposalId) === path4ChallengeProposalId,
      );
      assert.equal(challengeProp?.passed, true, "path4: challenge passed");
      assert.equal(challengeProp?.executed, true, "path4: challenge executed");

      // Challenge state is tracked per deal proposal (Proposal.challenged
      // and DealProposal.challenges), not at the Deal entity level. The
      // authoritative proof that the veto took effect is the deal
      // proposal's blocked execution (next step) + the `proposalChallenges`
      // relation on the Deal showing all challenges filed.
      return {cli, command: ["execute", "challenge"], indexerSnapshot: {challengeProposal: challengeProp} as Record<string, unknown>};
    });

    await step(h, "path4-deal-execute-permanently-blocked", async () => {
      const cli = await attemptDealExecute(path4DealProposalId!, "agent1");
      h.log(`path4 deal execute: exitCode=${cli.exitCode}, stderr=${cli.stderr?.slice(0, 200)}`);

      assert.equal(cli.exitCode !== 0, true, "path4: deal execute reverted");
      assert.equal(
        cli.stderr?.includes("ProposalNotExecutable") ?? false, true,
        "path4: revert is ProposalNotExecutable (veto), NOT VoteNotPassed (quorum was reached)",
      );

      await h.syncIndexer();
      const dp = await readDealProposal(path4DealProposalId!);
      assert.equal(dp?.executed, false, "path4: deal proposal not executed (and never will be)");
      assert.equal(dp?.passed, true, "path4: deal proposal still shows passed=true (quorum was reached)");
      assert.equal(dp?.challenged, true, "path4: challenged=true");
      return {cli, command: ["deal", "execute"], indexerSnapshot: {dealProposal: dp} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // FINAL: Cross-path verification of indexer state
    // ══════════════════════════════════════════════════════════════

    await step(h, "final-verify-all-deal-proposals", async () => {
      const cli = await h.dealView("proposals", ["--deal-address", ctx.dealAddress]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      assert.defined(proposals, "deal proposals list");

      const findById = (id: string) =>
        proposals?.find((p) => String(p.proposalNumericId ?? p.id) === id);

      const dp1 = findById(path1DealProposalId!);
      const dp2 = findById(path2DealProposalId!);
      const dp3 = findById(path3DealProposalId!);
      const dp4 = findById(path4DealProposalId!);

      h.log(`Final state of all deal proposals:`);
      h.log(`  path1 (challenge during voting):    passed=${dp1?.passed}, executed=${dp1?.executed}, challenged=${dp1?.challenged}`);
      h.log(`  path2 (challenge after passing):    passed=${dp2?.passed}, executed=${dp2?.executed}, challenged=${dp2?.challenged}`);
      h.log(`  path3 (challenge passed but lapsed): passed=${dp3?.passed}, executed=${dp3?.executed}, challenged=${dp3?.challenged}`);
      h.log(`  path4 (challenge passed+executed):  passed=${dp4?.passed}, executed=${dp4?.executed}, challenged=${dp4?.challenged}`);

      // Only path3 executed
      assert.equal(dp1?.executed, false, "path1 not executed");
      assert.equal(dp2?.executed, false, "path2 not executed");
      assert.equal(dp3?.executed, true, "path3 executed (failed challenge lifted)");
      assert.equal(dp4?.executed, false, "path4 not executed (challenge blocked)");

      // All four are challenged
      assert.equal(dp1?.challenged, true, "path1 challenged");
      assert.equal(dp2?.challenged, true, "path2 challenged");
      assert.equal(dp3?.challenged, true, "path3 challenged");
      assert.equal(dp4?.challenged, true, "path4 challenged");

      // All four reached quorum (passed=true)
      assert.equal(dp1?.passed, true, "path1 passed quorum");
      assert.equal(dp2?.passed, true, "path2 passed quorum");
      assert.equal(dp3?.passed, true, "path3 passed quorum");
      assert.equal(dp4?.passed, true, "path4 passed quorum");

      return {cli, command: ["deal", "view", "proposals"], indexerSnapshot: {
        path1: dp1, path2: dp2, path3: dp3, path4: dp4,
      } as Record<string, unknown>};
    });
  },
};
