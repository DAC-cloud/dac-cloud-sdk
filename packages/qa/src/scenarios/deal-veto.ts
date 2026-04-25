import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {setupNativeDacWithDeal, proposeVoteExecute} from "./fixtures/index.js";

/**
 * Scenario: Deal Veto (Challenge)
 *
 * Creates a deal with vetoEnabled=true and two agents (founder + agent1).
 * Agent proposes a deal governance action (toggle-early-returns).
 * DAC governance challenges the deal proposal, blocking execution.
 *
 * Tests:
 * - Deal proposal creation by a staked agent
 * - DAC-level challenge-deal proposal
 * - Blocked execution of a challenged deal proposal
 * - Indexer tracking of deal proposals and DAC challenge proposals
 */
export const dealVetoScenario: Scenario = {
  name: "deal-veto",
  description: "Deal proposal → DAC challenge → execution blocked",
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
        h.log(`Deal: vetoEnabled=${deal.vetoEnabled}, challengeEnabled=${deal.dealChallengeEnabled}`);
        assert.equal(deal.vetoEnabled, true, "veto enabled on deal");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Agent1 proposes toggle-early-returns on the deal ────────

    await step(h, "agent-proposes-deal-action", async () => {
      const args = [
        "deal", "propose", "toggle-early-returns", "true",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cliAs("agent1", args);
      assert.defined(cli.data.proposalId, "deal proposal id");
      h.log(`Deal proposal created: id=${cli.data.proposalId}`);
      return {cli, command: ["dac [as agent1]", ...args]};
    });

    await h.syncIndexer();

    // ── Verify deal proposal in indexer + deal proposalCount ─────

    let dealProposalId: string;

    await step(h, "verify-deal-proposal", async () => {
      const cli = await h.dealView("proposals", ["--deal-address", ctx.dealAddress]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      assert.defined(proposals, "deal proposals list");
      assert.gte(proposals?.length ?? 0, 1, "at least 1 deal proposal");

      if (proposals && proposals.length > 0) {
        const latest = proposals[0];
        dealProposalId = String(latest.proposalNumericId ?? latest.id ?? "1");
        h.log(`Deal proposal in indexer: id=${dealProposalId}`);
      }

      return {cli, command: ["deal", "view", "proposals"], indexerSnapshot: {proposals} as Record<string, unknown>};
    });

    // Verify deal aggregate shows proposalCount incremented
    await step(h, "verify-deal-after-proposal", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal exists after proposal creation");
      if (deal) {
        h.log(`Deal after proposal: proposalCount=${deal.proposalCount}, active=${deal.active}`);
      }
      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── DAC challenges the deal proposal ─────────────────────────

    h.log("DAC founder challenges the deal proposal...");

    let challengeProposalId: string;

    await step(h, "dac-challenge-deal-proposal", async () => {
      // challenge-deal requires: <dealNumericId> <dealProposalId>
      const cli = await h.cli([
        "propose", "challenge-deal", ctx.dealNumericId, dealProposalId!,
        "--dac", ctx.dacAddress,
        "--config", config.configPath,
        "--pretty-print",
      ]);
      challengeProposalId = String(cli.data.proposalId ?? cli.data.id ?? "");
      assert.defined(cli.data.proposalId, "DAC challenge proposal id");
      h.log(`DAC challenge proposal: id=${challengeProposalId}`);
      return {cli, command: ["dac", "propose", "challenge-deal"]};
    });

    // Vote + execute the DAC challenge proposal
    await h.syncIndexer();

    // ── Verify challenge proposal was indexed ─────────────────────

    await step(h, "verify-challenge-proposal-indexed", async () => {
      const cli = await h.view("proposals", ["--dac", ctx.dacAddress]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      assert.defined(proposals, "DAC proposals list");

      const challengeProp = proposals?.find((p) =>
        String(p.proposalNumericId ?? p.proposalId) === challengeProposalId,
      );
      assert.defined(challengeProp, "challenge proposal found in indexer");

      if (challengeProp) {
        h.log(`Challenge proposal: id=${challengeProposalId}, kindName=${challengeProp.kindName}, scope=${challengeProp.scope}, resolved=${challengeProp.resolved}`);
      }

      return {cli, command: ["view", "proposals"], indexerSnapshot: {challengeProposal: challengeProp} as Record<string, unknown>};
    });

    h.log(`Voting + executing DAC challenge proposal ${challengeProposalId!}...`);

    await h.advanceTime(10);
    await h.cli([
      "vote", "proposal", challengeProposalId!, "true", "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", challengeProposalId!, "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);

    await h.syncIndexer();

    // ── Verify deal proposal is blocked/vetoed in indexer ────────

    await step(h, "verify-deal-proposal-blocked", async () => {
      const cli = await h.dealView("proposals", ["--deal-address", ctx.dealAddress]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      assert.defined(proposals, "deal proposals after challenge");

      if (proposals && proposals.length > 0) {
        const challenged = proposals.find((p) =>
          String(p.proposalNumericId ?? p.id) === dealProposalId,
        ) ?? proposals[0];
        h.log(`Deal proposal after challenge: executed=${challenged.executed}, challenged=${challenged.challenged}, vetoed=${challenged.vetoed}, voteCount=${challenged.voteCount}, yesVotes=${challenged.yesVotes}`);
        // The challenge should block/veto the deal proposal
        assert.equal(challenged.executed, false, "deal proposal not yet executed");
      }

      return {cli, command: ["deal", "view", "proposals"], indexerSnapshot: {proposals} as Record<string, unknown>};
    });

    // ── Try to execute the deal proposal — should fail ───────────

    await step(h, "attempt-blocked-execution", async () => {
      // Vote for it in deal governance first
      await h.advanceTime(10);
      await h.cliAs("agent1", [
        "deal", "vote", "proposal", dealProposalId!, "true",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath,
        "--pretty-print",
      ]);
      await h.advanceTime(3700);

      // Attempt execute — should revert because challenge blocks it
      const args = [
        "deal", "execute", dealProposalId!,
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cliAs("agent1", args, {allowFailure: true});

      h.log(`Execute attempt: exitCode=${cli.exitCode}, stderr=${cli.stderr?.slice(0, 200)}`);
      assert.equal(cli.exitCode !== 0, true, "execution should fail (challenged)");

      return {cli, command: ["dac [as agent1]", ...args]};
    });

    // ── Verify deal proposal still not executed after blocked attempt ──

    await h.syncIndexer();

    await step(h, "verify-deal-proposal-still-blocked", async () => {
      const cli = await h.dealView("proposals", ["--deal-address", ctx.dealAddress]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      assert.defined(proposals, "deal proposals after blocked execution attempt");

      if (proposals && proposals.length > 0) {
        const targetProp = proposals.find((p) =>
          String(p.proposalNumericId ?? p.id) === dealProposalId,
        ) ?? proposals[0];
        h.log(`Deal proposal final state: executed=${targetProp.executed}, challenged=${targetProp.challenged ?? targetProp.vetoed}`);
        assert.equal(targetProp.executed, false, "deal proposal not executed (challenge blocked it)");
      }

      return {cli, command: ["deal", "view", "proposals"], indexerSnapshot: {proposals} as Record<string, unknown>};
    });

    // ── Verify challenge DAC proposal was executed ──────────────────

    await step(h, "verify-challenge-executed", async () => {
      const cli = await h.view("proposals", ["--dac", ctx.dacAddress]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      const challengeProp = proposals?.find((p) =>
        String(p.proposalNumericId ?? p.proposalId) === challengeProposalId,
      );
      assert.defined(challengeProp, "challenge proposal in indexer");
      if (challengeProp) {
        assert.equal(challengeProp.executed, true, "challenge proposal was executed");
        assert.equal(challengeProp.passed, true, "challenge proposal passed");
        h.log(`Challenge proposal final: executed=${challengeProp.executed}, passed=${challengeProp.passed}`);
      }
      return {cli, command: ["view", "proposals"], indexerSnapshot: {challengeProposal: challengeProp} as Record<string, unknown>};
    });
  },
};
