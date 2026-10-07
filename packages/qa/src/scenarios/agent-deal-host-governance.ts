import {CORE_DEAL_KIND, DEAL_PROPOSAL_TYPE} from "@dac-cloud/core";
import {encodeAbiParameters} from "viem";
import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  buildMilestoneDealJson,
  createApprovedAgentDeal,
  createNativeDacAs,
  dealProposeVoteExecuteAs,
  listAgentActionTypes,
  proposeVoteExecuteAs,
  readVotes,
  sameAddress,
  writeJsonFile,
  ZERO_ADDR,
} from "./fixtures/index.js";

/**
 * Scenario: AgentDeal — originate, staff and govern a host deal
 *
 * A home DAC acts as an agent inside a separate host DAC through an agent-deal.
 * Every host-side action is a home deal proposal; the host DAC's own governance
 * still has to approve whatever the agent-deal brings to it.
 *
 * Roles: founder = home DAC founder + home agent, agent1 = host DAC founder,
 *        agent2 = a native host agent.
 *
 * Flow:
 *   1. Home + host DACs; agent-deal creation guards (missing / self host target)
 *   2. Agent-deal created, staked, approved; indexer + on-chain terms verified
 *   3. Host DAC mints host agent tokens to the agent-deal
 *   4. HOST_CREATE_DEAL  — agent-deal originates a host deal (proposer = agent-deal)
 *   5. HOST_STAKE        — agent-deal stakes into it, stake is self-delegated
 *   6. HOST_INVITE       — whitelist-only host deal staffed through the agent-deal
 *   7. HOST_CREATE_PROPOSAL + HOST_VOTE — agent-deal governs the host deal
 *   8. Foreign deal cell rejected (InvalidDealAddress)
 */
export const agentDealHostGovernanceScenario: Scenario = {
  name: "agent-deal-host-governance",
  description: "AgentDeal originates a host deal, stakes, invites, proposes and votes inside the host DAC",
  tags: ["deal", "agent-deal", "cross-dac", "governance"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const hostAgent = config.wallets.agent2;
    if (!config.wallets.agent1 || !hostAgent) throw new Error("agent1 + agent2 wallets required");

    const hostAgentMint = "100000000000000000000000";   // 100k host agent tokens to the agent-deal
    const hostStake = "60000000000000000000000";        // 60k
    // 15k staked by the native host agent: the agent-deal keeps 80% of host stake, enough
    // to pass high-quorum (75%) host proposals such as toggle-early-returns on its own.
    const hostAgentStake = "15000000000000000000000";

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: DACs + agent-deal
    // ══════════════════════════════════════════════════════════════

    const home = await createNativeDacAs(h, "founder", {name: "Agent Home DAC", symbol: "AHOME"});
    const host = await createNativeDacAs(h, "agent1", {name: "Agent Host DAC", symbol: "AHOST"});

    await proposeVoteExecuteAs(h, "founder", home.dacAddress, [
      "propose", "mint-agent-tokens", "100000000000000000000000", home.founderAddress,
    ]);
    await h.syncIndexer();

    await step(h, "agent-deal-requires-host-target", async () => {
      const dealJson = await buildMilestoneDealJson(h, {dealKind: "agent-deal", name: "No Host"});
      const cli = await h.cli([
        "deal", "create", writeJsonFile(dealJson, "agent-deal-no-host"), "--dac", home.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(cli.exitCode, 0, "agent-deal without dealTarget is rejected");
      assert.includes(String(cli.data.error ?? cli.stdout), "dealTarget", "error names the missing host target");
      return {cli, command: ["deal", "create", "(no dealTarget)"]};
    });

    await step(h, "agent-deal-rejects-self-hosting", async () => {
      const dealJson = await buildMilestoneDealJson(h, {
        dealKind: "agent-deal", name: "Self Host", dealTarget: home.dacAddress,
      });
      const cli = await h.cli([
        "deal", "create", writeJsonFile(dealJson, "agent-deal-self-host"), "--dac", home.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(cli.exitCode, 0, "agent-deal targeting its own DAC is rejected");
      assert.includes(String(cli.data.error ?? cli.stdout), "different DAC", "error explains self-hosting");
      return {cli, command: ["deal", "create", "(self host)"]};
    });

    const agentDeal = await createApprovedAgentDeal(h, "founder", home, host.dacAddress);
    h.log(`Agent-deal ready: deal=${agentDeal.dealAddress}, cell=${agentDeal.dealCell}`);

    await step(h, "verify-agent-deal-indexed", async () => {
      const cli = await h.dealView("deal", ["--deal-address", agentDeal.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown>;
      assert.equal(deal.active, true, "agent-deal active after approval");
      assert.equal(String(deal.kindSelector).toLowerCase(), CORE_DEAL_KIND.AGENT_DEAL.toLowerCase(), "deal kind is AGENT_DEAL");
      assert.truthy(sameAddress(deal.hostDacAddress, host.dacAddress), "deal.hostDacAddress is the host DAC");
      assert.truthy(sameAddress(deal.hostAgentTokenAddress, host.agentTokenAddress), "deal.hostAgentTokenAddress");
      assert.truthy(sameAddress(deal.hostMainTokenAddress, host.mainTokenAddress), "deal.hostMainTokenAddress");

      const agentCli = await h.dealView("agent-deal", ["--deal-address", agentDeal.dealAddress]);
      const record = agentCli.data.agentDeal as Record<string, unknown>;
      assert.truthy(sameAddress(record.hostDacAddress, host.dacAddress), "AgentDeal.hostDacAddress");
      assert.equal(agentCli.data.count, 0, "no host positions before any host action");

      const relatedCli = await h.dealView("related-contracts", ["--deal-address", agentDeal.dealAddress]);
      const related = relatedCli.data.relatedContracts as Array<Record<string, unknown>>;
      const roles = related.map((entry) => String(entry.roleText));
      for (const role of ["HOST_DAC", "HOST_AGENT_TOKEN", "HOST_MAIN_TOKEN"]) {
        assert.truthy(roles.includes(role), `related contract role ${role} indexed`);
      }
      const hostDacRole = related.find((entry) => entry.roleText === "HOST_DAC");
      assert.equal(hostDacRole?.managed, true, "HOST_DAC is the managed entity");

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal};
    });

    await step(h, "verify-agent-deal-terms", async () => {
      const cli = await h.dealView("terms", ["--deal-address", agentDeal.dealAddress]);
      const initParams = cli.data.initParams as Record<string, unknown>;
      assert.truthy(sameAddress(initParams.dealTarget, host.dacAddress), "on-chain initParams.dealTarget is the host DAC");
      assert.equal(String(initParams.dealKind).toLowerCase(), CORE_DEAL_KIND.AGENT_DEAL.toLowerCase(), "initParams.dealKind");
      assert.equal(cli.data.governanceFactoryAccepted, true, "module accepts the deal governance factory");
      assert.equal((cli.data.dealTargetDac as Record<string, unknown>)?.canonical, true, "host DAC is canonical");
      const budget = cli.data.controlledAddressBudget as Record<string, unknown>;
      assert.equal(String(budget.max), "3", "controlled-address cap is 3");
      assert.equal((cli.data.warnings as unknown[]).length, 0, "no provenance warnings");
      return {cli, command: ["deal", "view", "terms"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: HOST_CREATE_DEAL + HOST_STAKE
    // ══════════════════════════════════════════════════════════════

    // The host DAC recognises the agent-deal as an agent.
    await proposeVoteExecuteAs(h, "agent1", host.dacAddress, [
      "propose", "mint-agent-tokens", hostAgentMint, agentDeal.dealAddress,
    ]);
    await h.syncIndexer();

    let hostDealCell: string;
    let hostDealAddress: string;

    await step(h, "host-create-deal", async () => {
      const hostDealJson = await buildMilestoneDealJson(h, {
        dealKind: "permit2-treasury",
        name: "Host Deal Originated By Agent-Deal",
      });
      const {execute} = await dealProposeVoteExecuteAs(h, "founder", agentDeal.dealAddress, [
        "deal", "propose", "host-create-deal", "--input", writeJsonFile(hostDealJson, "host-deal"),
      ]);
      hostDealCell = execute.data.hostDealCell as string;
      assert.isAddress(hostDealCell, "HostDealCreated.hostDealCell decoded from execute receipt");
      assert.defined(execute.data.hostDealId, "HostDealCreated.hostDealId decoded");

      await h.syncIndexer();
      const hostDealCli = await h.dealView("deal", ["--deal-address", hostDealCell]);
      const hostDeal = hostDealCli.data.deal as Record<string, unknown>;
      hostDealAddress = hostDeal.dealAddress as string;
      assert.truthy(sameAddress(hostDeal.proposer, agentDeal.dealAddress), "host deal proposer is the agent-deal");
      assert.truthy(String(hostDeal.dacId).toLowerCase().includes(host.dacAddress.toLowerCase()), "host deal lives in the host DAC");
      assert.equal(hostDeal.active, false, "host deal still needs host DAC approval");

      return {cli: execute, command: ["deal", "propose", "host-create-deal"], indexerSnapshot: hostDeal};
    });

    await step(h, "host-stake", async () => {
      const {execute} = await dealProposeVoteExecuteAs(h, "founder", agentDeal.dealAddress, [
        "deal", "propose", "host-stake", hostDealAddress!, hostStake,
      ]);
      await h.syncIndexer();

      const hostDealCli = await h.dealView("deal", ["--deal-address", hostDealCell!]);
      const hostDeal = hostDealCli.data.deal as Record<string, unknown>;
      assert.equal(String(hostDeal.currentStakedAmount), hostStake, "host deal holds the agent-deal's stake");

      // HOST_STAKE self-delegates the host StakedAgent so the position can vote.
      const votes = await readVotes(h, hostDeal.stakeTokenAddress as string, agentDeal.dealAddress);
      assert.equal(votes.toString(), hostStake, "agent-deal has host voting power");

      const agentCli = await h.dealView("agent-deal", ["--deal-address", agentDeal.dealAddress]);
      const positions = agentCli.data.hostPositions as Array<Record<string, unknown>>;
      const position = positions.find((entry) => sameAddress(entry.hostDealCellAddress, hostDealCell));
      assert.defined(position, "host position indexed");
      assert.equal(String(position?.stakedAmount), hostStake, "host position stakedAmount");
      assert.equal(position?.originatedByAgent, true, "host position originated by the agent-deal");

      return {cli: execute, command: ["deal", "propose", "host-stake"], indexerSnapshot: position};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: HOST_INVITE
    // ══════════════════════════════════════════════════════════════

    await proposeVoteExecuteAs(h, "agent1", host.dacAddress, [
      "propose", "mint-agent-tokens", hostAgentStake, hostAgent.address,
    ]);
    await h.syncIndexer();

    await step(h, "host-agent-cannot-stake-before-invite", async () => {
      const cli = await h.cliAs("agent2", [
        "deal", "stake", hostAgentStake,
        "--deal-address", hostDealCell!, "--dac", host.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(cli.exitCode, 0, "uninvited host agent cannot stake");
      assert.includes(String(cli.data.error ?? cli.stdout), "NotWhitelistedAgent", "reverts NotWhitelistedAgent");
      return {cli, command: ["deal", "stake", "(uninvited)"]};
    });

    await step(h, "host-invite", async () => {
      const {execute} = await dealProposeVoteExecuteAs(h, "founder", agentDeal.dealAddress, [
        "deal", "propose", "host-invite", hostDealCell!, hostAgent.address, "false",
      ]);

      const stakeCli = await h.cliAs("agent2", [
        "deal", "stake", hostAgentStake,
        "--deal-address", hostDealCell!, "--dac", host.dacAddress, "--auto-delegate",
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(stakeCli.data.txHash, "invited host agent stakes");

      return {cli: execute, command: ["deal", "propose", "host-invite"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: HOST_CREATE_PROPOSAL + HOST_VOTE
    // ══════════════════════════════════════════════════════════════

    let hostProposalId: string;

    await step(h, "host-create-proposal", async () => {
      const {execute} = await dealProposeVoteExecuteAs(h, "founder", agentDeal.dealAddress, [
        "deal", "propose", "host-create-proposal",
        hostDealCell!,
        DEAL_PROPOSAL_TYPE.TOGGLE_EARLY_RETURNS,
        ZERO_ADDR,
        "0",
        encodeAbiParameters([{type: "bool"}], [true]),
      ]);
      hostProposalId = String(execute.data.hostProposalId ?? "");
      assert.truthy(hostProposalId.length > 0, "HostProposalCreated.hostProposalId decoded from execute receipt");
      return {cli: execute, command: ["deal", "propose", "host-create-proposal"]};
    });

    await step(h, "host-vote", async () => {
      const {execute} = await dealProposeVoteExecuteAs(h, "founder", agentDeal.dealAddress, [
        "deal", "propose", "host-vote", hostDealCell!, hostProposalId!, "true",
      ]);
      return {cli: execute, command: ["deal", "propose", "host-vote"]};
    });

    await step(h, "execute-host-proposal", async () => {
      // The agent-deal's 80% vote resolved the host proposal; anyone may execute it.
      await h.syncIndexer();
      await h.advanceTime(10);
      const cli = await h.cliAs("agent2", [
        "deal", "execute", hostProposalId!,
        "--deal-address", hostDealAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "host proposal executed");

      await h.syncIndexer();
      const hostDealCli = await h.dealView("deal", ["--deal-address", hostDealCell!]);
      const hostDeal = hostDealCli.data.deal as Record<string, unknown>;
      assert.equal(hostDeal.earlyReturnsEnabled, true, "host deal early returns toggled by the agent-deal's proposal");
      return {cli, command: ["deal", "execute", "(host proposal)"], indexerSnapshot: hostDeal};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 5: guards + indexer action log
    // ══════════════════════════════════════════════════════════════

    await step(h, "foreign-deal-cell-rejected", async () => {
      // The agent-deal's own (home) cell is not a deal of the bound host DAC.
      const cli = await h.cli([
        "deal", "propose", "host-stake", agentDeal.dealCell, "1",
        "--deal-address", agentDeal.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(cli.exitCode, 0, "host-stake into a non-host deal is rejected at proposal creation");
      assert.includes(String(cli.data.error ?? cli.stdout), "InvalidDealAddress", "reverts InvalidDealAddress");
      return {cli, command: ["deal", "propose", "host-stake", "(foreign cell)"]};
    });

    await step(h, "verify-agent-actions-indexed", async () => {
      await h.syncIndexer();
      const actionTypes = await listAgentActionTypes(h, agentDeal.dealAddress);
      for (const expected of ["HOST_DEAL_CREATED", "HOST_STAKED", "HOST_INVITED", "HOST_PROPOSAL_CREATED", "HOST_VOTE_CAST"]) {
        assert.truthy(actionTypes.includes(expected), `agent action ${expected} indexed`);
      }

      const cli = await h.dealView("agent-deal", ["--deal-address", agentDeal.dealAddress]);
      const positions = cli.data.hostPositions as Array<Record<string, unknown>>;
      const position = positions.find((entry) => sameAddress(entry.hostDealCellAddress, hostDealCell));
      assert.equal(String(position?.proposalsCreatedCount), "1", "host position proposalsCreatedCount");
      assert.equal(String(position?.votesCastCount), "1", "host position votesCastCount");
      assert.equal(String(position?.invitesSentCount), "1", "host position invitesSentCount");
      assert.equal(position?.unstaked, false, "host position still staked");

      return {cli, command: ["deal", "view", "agent-deal"], indexerSnapshot: position};
    });
  },
};
