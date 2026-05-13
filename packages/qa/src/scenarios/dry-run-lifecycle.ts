import {writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, resolveUnderlyingToken, ZERO_ADDR} from "./fixtures/common.js";

/**
 * Walks the native-DAC happy path with every mutating call routed through
 * `--dry-run` and then signed+broadcast by the harness (viem). Mirrors
 * `setupNativeDacWithDeal` but never lets the CLI sign on our behalf —
 * proves the dry-run output is broadcastable and produces the expected
 * indexer state.
 *
 * Note: `dac join` is run via direct CLI rather than dry-run because that
 * command does not yet implement the dry-run branch. It is, however, required
 * — without it the founder holds 0 mainToken and `dac propose` reverts with
 * NotAuthorized(). Wire join up to --dry-run and switch this call over.
 */
export const dryRunLifecycleScenario: Scenario = {
  name: "dry-run-lifecycle",
  description:
    "Native DAC lifecycle (create → propose/vote/execute → deal create → stake → approve → evaluate → claim) "
    + "with every write routed through --dry-run and broadcast by the harness via viem",
  tags: ["dry-run", "lifecycle", "smoke"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain for time manipulation. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founder = config.wallets.founder;
    if (!founder) throw new Error("founder wallet required");

    const treasuryToken = resolveUnderlyingToken(h);

    // ── 1. dac create (dry-run, single tx) ──────────────────────────

    const createBefore = await h.view("dacs", []);
    const dacsBefore = (createBefore.data.dacs as Array<Record<string, unknown>> | undefined) ?? [];
    const beforeAddresses = new Set(dacsBefore.map((d) => String(d.address).toLowerCase()));

    await h.submitDryRun("founder", [
      "create",
      "--name", "Dry-Run Lifecycle DAC",
      "--description", "Exercises --dry-run end-to-end",
      "--symbol", "DRY1",
      "--max-supply", "10000000000000000000000000",
      "--default-quorum", "50",
      "--allocation", "1000000000000000000000000",
      "--treasury-token", treasuryToken,
      "--commitment", "0",
    ]);

    await h.syncIndexer();

    // Identify the newly created DAC (newest one not present before)
    const createAfter = await h.view("dacs", []);
    const dacsAfter = (createAfter.data.dacs as Array<Record<string, unknown>>) ?? [];
    const newDac = dacsAfter.find((d) => !beforeAddresses.has(String(d.address).toLowerCase()));
    assert.defined(newDac, "new DAC appeared in indexer after dry-run create");
    if (!newDac) return;

    const dacAddress = String(newDac.address);
    const mainTokenAddress = String(newDac.mainTokenAddress);
    const agentTokenAddress = String(newDac.agentTokenAddress);
    const dealManagerAddress = String(newDac.dealManagerAddress);

    // Note: `creator` in the indexer is the deploying contract (DACFactory), not the
    // EOA tx originator — existing scenarios never check it. Identity is established
    // by the new-address diff above; assert on metadata fields we actually set.
    assert.equal(newDac.name, "Dry-Run Lifecycle DAC", "name matches");
    h.log(`DAC: ${dacAddress} mainToken=${mainTokenAddress} agentToken=${agentTokenAddress}`);

    // ── 2. join (direct CLI — claim the founder's mainToken allocation) ──
    // The dry-run path of `dac create` only emits the deploy tx and stops there;
    // the founder's `founderAllocation` is set up as a pending capital call that
    // must be claimed via `dac join`. Without it the founder holds 0 mainToken
    // and `dac propose` reverts with NotAuthorized() (0xea8e4eb5).
    // `dac join` itself has no --dry-run branch (CLI gap), so use direct CLI.
    await h.cli([
      "join", "--dac", dacAddress, "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);

    await h.syncIndexer();

    // ── 3. delegate (dry-run) ───────────────────────────────────────

    await h.submitDryRun("founder", [
      "delegate", "--delegatee", founder.address, "--dac", dacAddress,
    ]);

    await h.syncIndexer();

    // ── 4. propose → vote → execute mint-agent-tokens (all dry-run) ─
    // Dry-run `propose` does not echo the assigned proposalNumericId because
    // that's only known once the tx is mined. Resolve it by listing the
    // flat `proposals` resource (ordered by proposalNumericId desc) and
    // taking the newest entry.

    const mintAmount = "100000000000000000000000";

    await h.submitDryRun("founder", [
      "propose", "mint-agent-tokens", mintAmount, founder.address, "--dac", dacAddress,
    ]);
    await h.syncIndexer();

    const proposalsAfter = await h.view("proposals", ["--dac", dacAddress]);
    const proposalsList = (proposalsAfter.data.proposals as Array<Record<string, unknown>>) ?? [];
    assert.equal(proposalsList.length > 0, true, "at least one proposal recorded after dry-run propose");

    const mintProposal = proposalsList[0];
    const mintProposalId = String(mintProposal.proposalNumericId);
    assert.equal(
      mintProposalId !== "undefined" && mintProposalId !== "",
      true,
      "resolved newest proposalNumericId from indexer",
    );
    h.log(`Mint proposal id=${mintProposalId}`);

    await h.advanceTime(10);
    await h.submitDryRun("founder", [
      "vote", "proposal", mintProposalId, "true", "--dac", dacAddress,
    ]);

    await h.advanceTime(3700);
    await h.submitDryRun("founder", [
      "execute", mintProposalId, "--dac", dacAddress,
    ]);

    await h.syncIndexer();

    // Verify the proposal executed by re-listing and finding our entry by
    // numericId. (`view proposal <id>` resolves by GraphQL composite id, not
    // by numericId, so it can't accept "1" directly.)
    const proposalsAfterExec = await h.view("proposals", ["--dac", dacAddress]);
    const proposalsAfterExecList = (proposalsAfterExec.data.proposals as Array<Record<string, unknown>>) ?? [];
    const executedProposal = proposalsAfterExecList.find(
      (p) => String(p.proposalNumericId) === mintProposalId,
    );
    assert.defined(executedProposal, "proposal present in indexer after execute");
    assert.equal(executedProposal?.executed, true, "mint proposal executed");

    // ── 4. deal create (dry-run) ────────────────────────────────────

    const chainTimestamp = await getChainTimestamp(h);
    const dealConfig = {
      dealKind: "permit2-treasury",
      name: "Dry-Run Lifecycle Deal",
      description: "QA dry-run deal",
      linkHash: "seed://qa-dry-run",
      fundingToken: treasuryToken,
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
          token: treasuryToken,
          oracle: ZERO_ADDR,
          valuationMode: 0,
          fundingToken: ZERO_ADDR,
          expectedReturn: "1000000000000000000000",
          timestamp: String(chainTimestamp + 86400 * 7),
          rewardPercentage: "1000000000000000000",
          rewardCurve: ["1000000000000000000"],   // 100% reward at 100% progress
          penaltyCurve: ["0"],
          minPercentGrace: "0",
          extension: "0",
        }],
      },
      vetoEnabled: false,
      agentsLimit: "0",
      minimalStake: "0",
    };
    const dealConfigPath = join(tmpdir(), `qa-dry-run-deal-${Date.now()}.json`);
    writeFileSync(dealConfigPath, JSON.stringify(dealConfig, null, 2));

    const dealsBefore = await h.view("deals", ["--dac", dacAddress]);
    const dealCountBefore = ((dealsBefore.data.deals as Array<unknown> | undefined) ?? []).length;

    await h.submitDryRun("founder", [
      "deal", "create", dealConfigPath, "--dac", dacAddress,
    ]);
    await h.syncIndexer();

    const dealsAfter = await h.view("deals", ["--dac", dacAddress]);
    const dealsList = (dealsAfter.data.deals as Array<Record<string, unknown>>) ?? [];
    assert.equal(dealsList.length, dealCountBefore + 1, "exactly one new deal in indexer");

    const newDeal = dealsList[0]; // newest first
    const dealAddress = String(newDeal.dealAddress);
    const dealCell = String(newDeal.cellAddress);
    const dealNumericId = String(newDeal.dealNumericId);
    const dealProposalId = String(newDeal.proposalNumericId);
    h.log(`Deal address=${dealAddress} cell=${dealCell} numericId=${dealNumericId} proposalId=${dealProposalId}`);
    assert.equal(newDeal.active, false, "new deal not yet active");
    assert.equal(String(newDeal.proposer ?? "").toLowerCase(), founder.address.toLowerCase(), "founder is proposer");

    // ── 5. deal stake (dry-run, single tx — no auto-delegate) ───────

    const stakeAmount = "10000000000000000000000";
    await h.submitDryRun("founder", [
      "deal", "stake", stakeAmount,
      "--deal-address", dealCell, "--dac", dacAddress,
    ]);
    await h.syncIndexer();

    // ── 6. Approve deal: vote + execute (both dry-run) ──────────────

    await h.advanceTime(10);
    await h.submitDryRun("founder", [
      "vote", "proposal", dealProposalId, "true", "--dac", dacAddress,
    ]);

    await h.advanceTime(3700);
    await h.submitDryRun("founder", [
      "execute", dealProposalId, "--dac", dacAddress,
    ]);

    await h.syncIndexer();

    const dealAfterApprove = await h.dealView("deal", ["--deal-address", dealAddress]);
    const dealRecord = dealAfterApprove.data.deal as Record<string, unknown> | undefined;
    assert.defined(dealRecord, "deal present after approval");
    assert.equal(dealRecord?.active, true, "deal is active after dry-run approval");
    assert.equal(dealRecord?.closed, false, "deal is not closed");
    assert.equal(dealRecord?.currentStakedAmount, stakeAmount, "deal staked amount matches dry-run stake");

    // ── 7. Advance past milestone, evaluate (dry-run) ───────────────

    const milestoneTs = chainTimestamp + 86400 * 7;
    const currentTs = await getChainTimestamp(h);
    const advance = Math.max(milestoneTs - currentTs + 3600, 3600);
    await h.advanceTime(advance);

    await h.submitDryRun("founder", [
      "deal", "evaluate",
      "--deal-id", dealNumericId,
      "--dac", dacAddress,
    ]);
    await h.syncIndexer();

    const evalView = await h.dealView("deal", ["--deal-address", dealAddress]);
    const evalDeal = evalView.data.deal as Record<string, unknown> | undefined;
    assert.defined(evalDeal, "deal present after evaluation");
    assert.equal(evalDeal?.closed, true, "deal closed after milestone evaluation (full reward)");
    // 100% reward curve → totalRewardAllocatedAmount > 0
    const allocated = BigInt(String(evalDeal?.totalRewardAllocatedAmount ?? "0"));
    assert.equal(allocated > 0n, true, "main-token reward was allocated after evaluation");

    // ── 8. Claim main-token reward (dry-run) ────────────────────────

    await h.submitDryRun("founder", [
      "deal", "claim",
      "--deal-address", dealCell,
    ]);
    await h.syncIndexer();

    const claimView = await h.dealView("deal", ["--deal-address", dealAddress]);
    const claimDeal = claimView.data.deal as Record<string, unknown> | undefined;
    const claimed = BigInt(String(claimDeal?.totalRewardClaimedAmount ?? "0"));
    assert.equal(claimed.toString(), allocated.toString(), "claimed equals allocated after dry-run claim");

    h.log(`Lifecycle complete via dry-run: dac=${dacAddress} deal=${dealAddress} claimed=${claimed}`);
  },
};
