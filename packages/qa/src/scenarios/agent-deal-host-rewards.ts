import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  createApprovedAgentDeal,
  createNativeDacAs,
  dealProposeVoteExecuteAs,
  getChainTimestamp,
  listAgentActionTypes,
  mintMockToken,
  proposeVoteExecute,
  proposeVoteExecuteAs,
  readErc20Allowance,
  readErc20Balance,
  readVotes,
  sameAddress,
  setupNativeDacWithDeal,
} from "./fixtures/index.js";

/**
 * Scenario: AgentDeal — join an approved host deal, earn, route rewards home, exit
 *
 * The second way into a host deal: the deal already exists and is approved, so the
 * agent-deal cannot stake directly. It approves a stake (HOST_APPROVE_STAKE) and the
 * host deal's own agents pull it in through a host ADD_STAKE proposal.
 *
 * Roles: founder = host DAC founder + host agent, agent1 = home DAC founder + home agent.
 *
 * Flow:
 *   1. Host DAC with an approved treasury deal (founder staked 10k)
 *   2. Home DAC + approved agent-deal bound to the host DAC
 *   3. Host deal returns capital through the kernel
 *   4. HOST_APPROVE_STAKE → host ADD_STAKE: agent-deal holds 5k host stake with voting power;
 *      host deal is evaluated: full reward, closed
 *   5. HOST_CLAIM_REWARD: host main token lands on the agent-deal
 *   6. RETURN_ASSET_TO_DAC: host main token routed to the home treasury
 *   7. RETURN_ASSET_TO_DAC refuses the home main token (NotAllowed)
 *   8. HOST_UNSTAKE: host agent tokens come back to the agent-deal
 */
export const agentDealHostRewardsScenario: Scenario = {
  name: "agent-deal-host-rewards",
  description: "AgentDeal joins an approved host deal via approve-stake, claims host rewards, returns them home, unstakes",
  tags: ["deal", "agent-deal", "cross-dac", "rewards"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    if (!config.wallets.agent1) throw new Error("agent1 wallet required");

    const hostAgentMint = "20000000000000000000000";  // 20k host agent tokens to the agent-deal
    const hostStake = "5000000000000000000000";       // 5k joins the founder's 10k: a third of host stake
    const founderStake = "10000000000000000000000";
    const rewardsLimit = "90000000000000000000000";   // 90k host main token, divisible by the 1:2 split
    const expectedReturn = "1000000000000000000000";
    const returnedCapital = "1200000000000000000000";

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: host deal, home DAC, agent-deal
    // ══════════════════════════════════════════════════════════════

    const hostCtx = await setupNativeDacWithDeal(h, {
      dacName: "Rewards Host DAC",
      dealName: "Host Deal Joined By Agent-Deal",
      stakeAmount: founderStake,
      rewardsLimit,
      milestones: [{
        expectedReturn,
        rewardCurve: ["0"],
        penaltyCurve: ["0"],
        rewardPercentage: "1000000000000000000",
      }],
    });

    const hostDealCli = await h.dealView("deal", ["--deal-address", hostCtx.dealAddress]);
    const hostDealRecord = hostDealCli.data.deal as Record<string, unknown>;
    const hostStakeToken = hostDealRecord.stakeTokenAddress as string;
    const hostTreasury = hostDealRecord.managedTreasuryAddress as string;

    const home = await createNativeDacAs(h, "agent1", {name: "Rewards Home DAC", symbol: "RHOME"});
    await proposeVoteExecuteAs(h, "agent1", home.dacAddress, [
      "propose", "mint-agent-tokens", "100000000000000000000000", home.founderAddress,
    ]);
    await h.syncIndexer();

    const agentDeal = await createApprovedAgentDeal(h, "agent1", home, hostCtx.dacAddress);
    h.log(`Agent-deal ready: deal=${agentDeal.dealAddress}, host deal cell=${hostCtx.dealCell}`);

    // The host DAC recognises the agent-deal as an agent.
    await proposeVoteExecute(h, hostCtx.dacAddress, [
      "propose", "mint-agent-tokens", hostAgentMint, agentDeal.dealAddress,
    ]);
    await h.syncIndexer();

    await step(h, "host-deal-returns-capital", async () => {
      // Only capital the kernel records as returned counts toward the milestone,
      // so the return goes treasury → deal → DAC through a return-capital proposal.
      // Done while the founder is the only host staker: toggle-early-returns is a
      // high-quorum type the founder could not pass alone once the agent-deal joins.
      await mintMockToken(h, {token: hostCtx.treasuryToken, to: hostTreasury, amount: returnedCapital});

      await dealProposeVoteExecuteAs(h, "founder", hostCtx.dealAddress, [
        "deal", "propose", "toggle-early-returns", "true",
      ]);

      const {execute} = await dealProposeVoteExecuteAs(h, "founder", hostCtx.dealAddress, [
        "deal", "propose", "return-capital", hostCtx.treasuryToken, returnedCapital,
      ]);
      return {cli: execute, command: ["deal", "propose", "return-capital"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: HOST_APPROVE_STAKE → host ADD_STAKE
    // ══════════════════════════════════════════════════════════════

    await step(h, "host-invite-agent-deal", async () => {
      const cli = await h.cli([
        "deal", "invite", agentDeal.dealAddress,
        "--deal-address", hostCtx.dealCell,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "host founder invites the agent-deal");
      return {cli, command: ["deal", "invite"]};
    });

    await step(h, "host-approve-stake", async () => {
      const {execute} = await dealProposeVoteExecuteAs(h, "agent1", agentDeal.dealAddress, [
        "deal", "propose", "host-approve-stake", hostCtx.dealAddress, hostStake,
      ]);

      const allowance = await readErc20Allowance(h, hostCtx.agentTokenAddress, agentDeal.dealAddress, hostCtx.dealCell);
      assert.equal(allowance.toString(), hostStake, "host deal cell may pull the approved stake");
      assert.equal(
        (await readErc20Balance(h, hostStakeToken, agentDeal.dealAddress)).toString(), "0",
        "no host stake until the host deal adds it",
      );
      return {cli: execute, command: ["deal", "propose", "host-approve-stake"]};
    });

    await step(h, "host-add-stake", async () => {
      // A staked host agent pulls the approved amount in through host deal governance.
      const {execute} = await dealProposeVoteExecuteAs(h, "founder", hostCtx.dealAddress, [
        "deal", "propose", "add-stake", agentDeal.dealAddress, "--from-request", "--dac", hostCtx.dacAddress,
      ]);

      assert.equal(
        (await readErc20Balance(h, hostStakeToken, agentDeal.dealAddress)).toString(), hostStake,
        "agent-deal holds host StakedAgent",
      );
      // Delegation was set by HOST_APPROVE_STAKE before any stake existed.
      const votes = await readVotes(h, hostStakeToken, agentDeal.dealAddress);
      assert.equal(votes.toString(), hostStake, "added host stake carries voting power");

      await h.syncIndexer();
      const agentCli = await h.dealView("agent-deal", ["--deal-address", agentDeal.dealAddress]);
      const positions = agentCli.data.hostPositions as Array<Record<string, unknown>>;
      const position = positions.find((entry) => sameAddress(entry.hostDealCellAddress, hostCtx.dealCell));
      assert.defined(position, "host position indexed");
      assert.equal(String(position?.approvedStakeAmount), hostStake, "host position approvedStakeAmount");
      assert.equal(position?.originatedByAgent, false, "host deal was not originated by the agent-deal");

      return {cli: execute, command: ["deal", "propose", "add-stake"], indexerSnapshot: position};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: host deal evaluated — full reward
    // ══════════════════════════════════════════════════════════════

    await step(h, "evaluate-host-deal", async () => {
      const milestoneTs = hostCtx.chainTimestamp + 86400 * 7;
      const currentTs = await getChainTimestamp(h);
      await h.advanceTime(Math.max(milestoneTs - currentTs + 3600, 3600));

      const cli = await h.cli([
        "deal", "evaluate",
        "--deal-id", hostCtx.dealNumericId, "--dac", hostCtx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "host deal evaluated");

      await h.syncIndexer();
      const dealCli = await h.dealView("deal", ["--deal-address", hostCtx.dealAddress]);
      const deal = dealCli.data.deal as Record<string, unknown>;
      assert.equal(deal.closed, true, "host deal closed on full reward");
      assert.equal(String(deal.totalRewardAllocatedAmount), rewardsLimit, "full host reward allocated");
      return {cli, command: ["deal", "evaluate"], indexerSnapshot: deal};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: HOST_CLAIM_REWARD → RETURN_ASSET_TO_DAC
    // ══════════════════════════════════════════════════════════════

    // 5k of 15k staked → a third of the host reward.
    const expectedReward = (BigInt(rewardsLimit) / 3n).toString();

    await step(h, "host-claim-reward", async () => {
      const {execute} = await dealProposeVoteExecuteAs(h, "agent1", agentDeal.dealAddress, [
        "deal", "propose", "host-claim-reward", hostCtx.dealAddress, "0",
      ]);
      const balance = await readErc20Balance(h, hostCtx.mainTokenAddress, agentDeal.dealAddress);
      assert.equal(balance.toString(), expectedReward, "host main-token reward sits on the agent-deal");
      return {cli: execute, command: ["deal", "propose", "host-claim-reward"]};
    });

    await step(h, "return-asset-to-home-dac", async () => {
      const treasuryBefore = await readErc20Balance(h, hostCtx.mainTokenAddress, home.treasuryHolderAddress);

      const {execute} = await dealProposeVoteExecuteAs(h, "agent1", agentDeal.dealAddress, [
        "deal", "propose", "return-asset", hostCtx.mainTokenAddress, expectedReward,
      ]);

      const treasuryAfter = await readErc20Balance(h, hostCtx.mainTokenAddress, home.treasuryHolderAddress);
      assert.equal((treasuryAfter - treasuryBefore).toString(), expectedReward, "home treasury received the host main token");
      assert.equal(
        (await readErc20Balance(h, hostCtx.mainTokenAddress, agentDeal.dealAddress)).toString(), "0",
        "agent-deal holds no host main token after routing it home",
      );

      await h.syncIndexer();
      const holdingsCli = await h.view("treasury-holdings", ["--dac", home.dacAddress]);
      const holdings = (holdingsCli.data.holdings as Array<Record<string, unknown>> | undefined) ?? [];
      const hostMainHolding = holdings.find((entry) => sameAddress(entry.tokenAddress, hostCtx.mainTokenAddress));
      assert.defined(hostMainHolding, "home treasury holding of the host main token indexed");

      return {cli: execute, command: ["deal", "propose", "return-asset"], indexerSnapshot: hostMainHolding};
    });

    await step(h, "return-asset-refuses-home-main-token", async () => {
      const {execute} = await dealProposeVoteExecuteAs(h, "agent1", agentDeal.dealAddress, [
        "deal", "propose", "return-asset", home.mainTokenAddress, "1",
      ], {allowExecuteFailure: true});
      assert.notEqual(execute.exitCode, 0, "returning the home main token is refused at execution");
      assert.includes(String(execute.data.error ?? execute.stdout), "NotAllowed", "reverts NotAllowed");
      return {cli: execute, command: ["deal", "propose", "return-asset", "(home main token)"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 5: HOST_UNSTAKE
    // ══════════════════════════════════════════════════════════════

    await step(h, "host-unstake", async () => {
      const {execute} = await dealProposeVoteExecuteAs(h, "agent1", agentDeal.dealAddress, [
        "deal", "propose", "host-unstake", hostCtx.dealAddress,
      ]);

      assert.equal(
        (await readErc20Balance(h, hostStakeToken, agentDeal.dealAddress)).toString(), "0",
        "host stake released",
      );
      assert.equal(
        (await readErc20Balance(h, hostCtx.agentTokenAddress, agentDeal.dealAddress)).toString(), hostAgentMint,
        "host agent tokens are back on the agent-deal",
      );
      return {cli: execute, command: ["deal", "propose", "host-unstake"]};
    });

    await step(h, "verify-agent-actions-indexed", async () => {
      await h.syncIndexer();
      const actionTypes = await listAgentActionTypes(h, agentDeal.dealAddress);
      for (const expected of ["HOST_STAKE_APPROVED", "HOST_REWARD_CLAIMED", "ASSET_RETURNED_TO_DAC", "HOST_UNSTAKED"]) {
        assert.truthy(actionTypes.includes(expected), `agent action ${expected} indexed`);
      }

      const cli = await h.dealView("agent-deal", ["--deal-address", agentDeal.dealAddress]);
      const positions = cli.data.hostPositions as Array<Record<string, unknown>>;
      const position = positions.find((entry) => sameAddress(entry.hostDealCellAddress, hostCtx.dealCell));
      assert.equal(String(position?.rewardsClaimedCount), "1", "host position rewardsClaimedCount");
      assert.equal(position?.unstaked, true, "host position unstaked");

      return {cli, command: ["deal", "view", "agent-deal"], indexerSnapshot: position};
    });
  },
};
