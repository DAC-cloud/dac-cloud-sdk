import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  dealProposeVoteExecuteQuorum,
  mintMockToken,
  proposeVoteExecute,
  readErc20Balance,
  sameAddress,
  setupNativeDacWithDeal,
  transferErc20,
} from "./fixtures/index.js";

/**
 * Scenario: governance toggles and recovery commands not exercised elsewhere
 *
 *   1. toggle-whitelist false — an uninvited agent can stake into the open deal
 *   2. enable-veto-right — DAC challengeability switched on after creation
 *   3. revoke-agent-tokens — burns unstaked agent tokens; a DealCell (controlled
 *      address) is refused with NotAllowed
 *   4. recover-treasury — holder re-syncs stray DACCell tokens into the treasury
 *   5. recover-profits — a non-funding token sitting on the Deal goes to its treasury
 */
export const dealGovernanceTogglesScenario: Scenario = {
  name: "deal-governance-toggles",
  description: "toggle-whitelist, enable-veto-right, revoke-agent-tokens (+controlled-address refusal), recover-treasury, recover-profits",
  tags: ["deal", "dac", "governance", "whitelist", "veto", "revoke", "recovery"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const agent2 = config.wallets.agent2;
    if (!agent2) throw new Error("agent2 wallet required");

    const founderMint = "100000000000000000000000"; // 100k
    const founderStake = "10000000000000000000000"; // 10k
    const agent2Mint = "20000000000000000000000";   // 20k
    const revokeAmount = "40000000000000000000000"; // 40k of the founder's 90k unstaked

    // Unapproved deal: whitelist toggles and direct stakes only apply before approval.
    const ctx = await setupNativeDacWithDeal(h, {
      dacName: "Toggles DAC",
      dealName: "Toggles Deal",
      agentMintAmount: founderMint,
      stakeAmount: founderStake,
      skipApproval: true,
    });

    await proposeVoteExecute(h, ctx.dacAddress, [
      "propose", "mint-agent-tokens", agent2Mint, agent2.address,
    ]);
    await h.syncIndexer();

    // ── 1. toggle-whitelist ────────────────────────────────────────

    await step(h, "stake-uninvited-rejected", async () => {
      const cli = await h.cliAs("agent2", [
        "deal", "stake", agent2Mint,
        "--deal-address", ctx.dealCell, "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(cli.exitCode, 0, "whitelist-only deal rejects an uninvited agent");
      assert.includes(String(cli.data.error ?? cli.stdout), "NotWhitelistedAgent", "reverts NotWhitelistedAgent");
      return {cli, command: ["deal", "stake", "(uninvited)"]};
    });

    await step(h, "toggle-whitelist-off", async () => {
      const {proposalId} = await dealProposeVoteExecuteQuorum(h, ctx.dealAddress, [
        "deal", "propose", "toggle-whitelist", "false",
      ]);
      await h.syncIndexer();
      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = dealCli.data.deal as Record<string, unknown>;
      assert.equal(deal.whitelistOnly, false, "deal no longer whitelist-only");

      const stakeCli = await h.cliAs("agent2", [
        "deal", "stake", agent2Mint,
        "--deal-address", ctx.dealCell, "--dac", ctx.dacAddress, "--auto-delegate",
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(stakeCli.data.txHash, "uninvited agent stakes into the open deal");
      return {
        cli: {data: {proposalId, stakeTx: stakeCli.data.txHash}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "toggle-whitelist"],
        indexerSnapshot: deal,
      };
    });

    // enable-veto-right (like voting-config / early-returns changes) is only
    // accepted on an approved deal; approve it through DAC governance now.
    await h.advanceTime(10);
    await h.cli([
      "vote", "proposal", ctx.dealProposalId, "true", "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", ctx.dealProposalId, "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);

    // ── 2. enable-veto-right ───────────────────────────────────────

    await step(h, "enable-veto-right", async () => {
      await h.syncIndexer();
      const before = (await h.dealView("deal", ["--deal-address", ctx.dealAddress])).data.deal as Record<string, unknown>;
      assert.equal(before.dealChallengeEnabled, false, "deal created without DAC challenge right");

      // agent2 now holds two thirds of the stake: both vote.
      const {proposalId} = await dealProposeVoteExecuteQuorum(h, ctx.dealAddress, [
        "deal", "propose", "enable-veto-right",
      ], ["agent2"]);
      await h.syncIndexer();
      const after = (await h.dealView("deal", ["--deal-address", ctx.dealAddress])).data.deal as Record<string, unknown>;
      assert.equal(after.dealChallengeEnabled, true, "DAC challenge right enabled by deal governance");
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["deal", "propose", "enable-veto-right"],
        indexerSnapshot: after,
      };
    });

    // ── 3. revoke-agent-tokens ─────────────────────────────────────

    await step(h, "revoke-agent-tokens", async () => {
      const before = await readErc20Balance(h, ctx.agentTokenAddress, ctx.founderAddress);
      const proposalId = await proposeVoteExecute(h, ctx.dacAddress, [
        "propose", "revoke-agent-tokens", revokeAmount, ctx.founderAddress,
      ]);
      const after = await readErc20Balance(h, ctx.agentTokenAddress, ctx.founderAddress);
      assert.equal((before - after).toString(), revokeAmount, "unstaked agent tokens burned by the revoke amount");

      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "revoke-agent-tokens"],
      };
    });

    await step(h, "revoke-from-deal-cell-rejected", async () => {
      // A DealCell is a controlled address: its stake cannot be revoked from the DAC side.
      const propose = await h.cli([
        "propose", "revoke-agent-tokens", "1", ctx.dealCell, "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      if (propose.exitCode !== 0) {
        assert.includes(String(propose.data.error ?? propose.stdout), "NotAllowed", "rejected at proposal creation with NotAllowed");
        return {cli: propose, command: ["dac", "propose", "revoke-agent-tokens", "(deal cell)"]};
      }
      const proposalId = String(propose.data.proposalId ?? "");
      await h.syncIndexer();
      await h.advanceTime(10);
      await h.cli([
        "vote", "proposal", proposalId, "true", "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      await h.advanceTime(3700);
      const execute = await h.cli([
        "execute", proposalId, "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(execute.exitCode, 0, "revoking from a controlled address is refused at execution");
      assert.includes(String(execute.data.error ?? execute.stdout), "NotAllowed", "reverts NotAllowed");
      return {cli: execute, command: ["dac", "execute", "(revoke from deal cell)"]};
    });

    // ── 4. recover-treasury ────────────────────────────────────────

    await step(h, "recover-treasury", async () => {
      const stray = "90000000000000000000"; // 90
      await mintMockToken(h, {token: ctx.treasuryToken, to: ctx.founderAddress, amount: stray});
      await transferErc20(h, {token: ctx.treasuryToken, from: ctx.founderAddress, to: ctx.dacAddress, amount: stray});

      const holdingsBefore = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
      const before = ((holdingsBefore.data.holdings as Array<Record<string, unknown>> | undefined) ?? [])
        .find((entry) => sameAddress(entry.tokenAddress, ctx.treasuryToken));
      const balanceBefore = BigInt(String(before?.balance ?? "0"));

      const cli = await h.cli([
        "recover-treasury", "--token", ctx.treasuryToken, "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "recover-treasury tx");

      await h.syncIndexer();
      const holdingsAfter = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
      const after = ((holdingsAfter.data.holdings as Array<Record<string, unknown>> | undefined) ?? [])
        .find((entry) => sameAddress(entry.tokenAddress, ctx.treasuryToken));
      assert.equal((BigInt(String(after?.balance ?? "0")) - balanceBefore).toString(), stray, "treasury holding credited by recover-treasury");
      return {cli, command: ["dac", "recover-treasury"], indexerSnapshot: after};
    });

    // ── 5. recover-profits ─────────────────────────────────────────

    const secondary = config.tokens.secondary;
    if (!secondary) {
      h.log("DAC_SECONDARY_TOKEN not set — skipping recover-profits (needs a non-funding token)");
      return;
    }

    await step(h, "recover-profits", async () => {
      const profit = "300000000000000000000"; // 300
      await mintMockToken(h, {token: secondary, to: ctx.dealAddress, amount: profit});

      const dealCli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const treasury = (dealCli.data.deal as Record<string, unknown>).managedTreasuryAddress as string;
      const before = await readErc20Balance(h, secondary, treasury);

      const cli = await h.cli([
        "deal", "recover-profits", secondary, "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "recover-profits tx");
      const after = await readErc20Balance(h, secondary, treasury);
      assert.equal((after - before).toString(), profit, "non-funding token swept into the deal treasury");
      assert.equal((await readErc20Balance(h, secondary, ctx.dealAddress)).toString(), "0", "nothing left on the Deal contract");

      return {cli, command: ["deal", "recover-profits"]};
    });
  },
};
