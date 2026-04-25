import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  mintMockToken,
  resolveUnderlyingToken,
  buildVotingPowerMerkleTree,
} from "./fixtures/index.js";

/**
 * Scenario: Oracle Governance — Primary Merkle Voting + Governance Config Proposals
 *
 * Tests the FULL oracle-primary voting path (the existing-token-dac scenario only tests fallback).
 *
 * Covers:
 *   Phase 1: Setup — deploy oracle, mint to 3 holders, create existing-token DAC
 *   Phase 2: Oracle Primary Voting — publish snapshot, 3 voters vote via merkle proofs
 *   Phase 3: Mixed Voting — merkle + wrapped voters on the same proposal
 *   Phase 4: Governance Config Proposals — update-voting-config, update-governance-strategy,
 *            update-deal-creation-config, update-legal-wrapper, approve-offchain-action
 *   Phase 5: Oracle Swap — deploy new oracle, update-governance-oracle proposal
 */
export const oracleGovernanceScenario: Scenario = {
  name: "oracle-governance",
  description: "Oracle primary merkle voting + governance configuration proposals (existing-token DAC)",
  tags: ["dac", "existing-token", "oracle", "merkle", "governance", "config"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain (time manipulation). Skipping.");
      return;
    }

    const {assert, config} = h;
    const founder = config.wallets.founder;
    const agent1 = config.wallets.agent1;
    const agent2 = config.wallets.agent2;
    if (!founder || !agent1 || !agent2) {
      throw new Error("founder, agent1, agent2 wallets required");
    }

    const underlyingToken = resolveUnderlyingToken(h);

    /**
     * Resolve primarySnapshotBlock for a proposal from the indexer's snapshotReference field.
     * This is the exact block the contract uses for voting power lookups.
     */
    async function getProposalSnapshotBlock(proposalId: string): Promise<string> {
      const viewCli = await h.view("proposals", ["--dac", dacAddress!]);
      const proposals = viewCli.data.proposals as Array<Record<string, unknown>>;
      const prop = proposals.find((p) =>
        String(p.proposalNumericId ?? p.proposalId) === proposalId,
      );
      if (!prop?.snapshotReference) {
        throw new Error(`Proposal #${proposalId}: snapshotReference not available in indexer`);
      }
      return String(prop.snapshotReference);
    }

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: SETUP
    // ══════════════════════════════════════════════════════════════

    // Mint underlying tokens to all participants
    await mintMockToken(h, {token: underlyingToken, to: founder.address, amount: "10000000000000000000000"});  // 10k
    await mintMockToken(h, {token: underlyingToken, to: agent1.address, amount: "3000000000000000000000"});   // 3k
    await mintMockToken(h, {token: underlyingToken, to: agent2.address, amount: "2000000000000000000000"});   // 2k

    // ── Deploy governance oracle ──
    let oracleAddress: string;

    await step(h, "deploy-oracle", async () => {
      const cli = await h.cli([
        "oracle", "deploy", founder.address, founder.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      oracleAddress = cli.data.oracleAddress as string;
      assert.isAddress(oracleAddress, "oracle deployed");
      h.log(`Oracle deployed: ${oracleAddress}`);
      return {cli, command: ["oracle", "deploy"]};
    });

    // ── Create existing-token DAC with oracle primary enabled ──
    let dacAddress: string;
    let wrappedMainTokenAddress: string;

    await step(h, "create-existing-token-dac", async () => {
      const cli = await h.cli([
        "create-existing-token",
        "--name", "Oracle Governance DAC",
        "--description", "QA test: oracle primary voting + governance config",
        "--symbol", "OGDAC",
        "--underlying-token", underlyingToken,
        "--treasury-seed-amount", "1000000000000000000000",  // 1k seed
        "--quorum-percent", "50",
        "--blocking-percent", "0",
        "--high-quorum-percent", "75",
        "--voting-duration", "3600",
        "--qualification", "0",
        "--execution-validity-duration", "86400",
        "--oracle-publish-deadline", "600",
        "--fallback-warmup-duration", "10",
        "--fallback-duration", "3600",
        "--oracle-primary-enabled",
        "--governance-oracle", oracleAddress!,
        "--auto-delegate",
        "--auto-approve",
        "--config", config.configPath,
        "--pretty-print",
      ]);
      dacAddress = cli.data.dac as string;
      wrappedMainTokenAddress = (cli.data.wrappedMainToken ?? cli.data.mainToken) as string;
      assert.isAddress(dacAddress, "DAC deployed");
      h.log(`DAC: ${dacAddress}, Wrapped: ${wrappedMainTokenAddress}`);
      return {cli, command: ["create-existing-token"]};
    });

    await h.syncIndexer();

    // ── Wrap tokens for founder (additional 500 beyond the 1k seed) ──
    // This gives founder wrapped voting power for the "mixed voting" phase.
    await step(h, "founder-wrap-tokens", async () => {
      const cli = await h.cli([
        "wrap", "--amount", "500000000000000000000",  // 500 tokens
        "--dac", dacAddress!, "--auto-approve",
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "wrap tx");
      h.log("Founder wrapped additional 500 tokens (total wrapped: 1500)");
      return {cli, command: ["wrap"]};
    });

    await h.syncIndexer();

    // At this point:
    // - founder: 8500 underlying (unwrapped), 1500 wrapped (delegated to self)
    // - agent1: 3000 underlying (unwrapped), 0 wrapped
    // - agent2: 2000 underlying (unwrapped), 0 wrapped
    // Total underlying for merkle: 8500 + 3000 + 2000 = 13500
    // wrappedVotable varies, totalVotingPower = 13500 + wrappedVotable
    // With 50% quorum and smallest-first vote order, all 3 get to vote before resolution

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: ORACLE PRIMARY VOTING (3 merkle voters)
    // ══════════════════════════════════════════════════════════════

    h.log("\n═══ PHASE 2: Oracle Primary Voting ═══");

    let proposalId: string;

    await step(h, "propose-mint-agent-tokens", async () => {
      const cli = await h.cli([
        "propose", "mint-agent-tokens",
        "100000000000000000000000",  // 100k agent tokens
        founder.address,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      proposalId = String(cli.data.proposalId ?? cli.data.id ?? "");
      assert.defined(cli.data.txHash, "propose tx");
      h.log(`Proposal #${proposalId} created (mint-agent-tokens)`);
      return {cli, command: ["propose", "mint-agent-tokens"]};
    });

    await h.syncIndexer();

    // Verify proposal is in AwaitingOracleSnapshot phase
    await step(h, "verify-awaiting-oracle", async () => {
      const cli = await h.cli([
        "proposal", "state", proposalId!,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      const phase = cli.data.currentPhase as string;
      h.log(`Proposal phase: ${phase}`);
      assert.truthy(
        String(phase).includes("AWAITING") || String(phase) === "0",
        "proposal in AwaitingOracleSnapshot phase",
      );
      return {cli, command: ["proposal", "state"]};
    });

    // Build voting power merkle tree
    const founderUnderlyingBalance = 8500000000000000000000n;  // 8500 tokens
    const agent1Balance = 3000000000000000000000n;             // 3000 tokens
    const agent2Balance = 2000000000000000000000n;             // 2000 tokens

    const merkleTree = buildVotingPowerMerkleTree([
      {voter: founder.address as `0x${string}`, amount: founderUnderlyingBalance},
      {voter: agent1.address as `0x${string}`, amount: agent1Balance},
      {voter: agent2.address as `0x${string}`, amount: agent2Balance},
    ]);

    h.log(`Merkle root: ${merkleTree.root}`);
    h.log(`Total underlying voting power: ${merkleTree.totalVotingPower}`);

    // primarySnapshotBlock = createdBlockNumber - 1 (from indexer)
    const snapshotBlock = await getProposalSnapshotBlock(proposalId!);
    h.log(`Snapshot block: ${snapshotBlock}`);

    // Publish oracle snapshot
    await step(h, "oracle-publish-snapshot", async () => {
      const cli = await h.cli([
        "oracle", "publish",
        proposalId!,
        snapshotBlock,
        merkleTree.root,
        String(merkleTree.totalVotingPower),
        "--governance-oracle", oracleAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "publish tx");
      h.log(`Oracle snapshot published for proposal #${proposalId}`);
      return {cli, command: ["oracle", "publish"]};
    });

    // Activate primary voting
    await step(h, "activate-primary-voting", async () => {
      const cli = await h.cli([
        "proposal", "activate-primary", proposalId!,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "activate-primary tx");
      h.log("Primary voting activated");
      return {cli, command: ["proposal", "activate-primary"]};
    });

    await h.syncIndexer();

    // Verify phase is now PrimaryVoting
    await step(h, "verify-primary-voting-phase", async () => {
      const cli = await h.cli([
        "proposal", "state", proposalId!,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      const phase = cli.data.currentPhase as string;
      assert.truthy(
        String(phase).includes("PRIMARY") || String(phase) === "1",
        "proposal in PrimaryVoting phase",
      );
      return {cli, command: ["proposal", "state"]};
    });

    // ── All 3 voters vote via merkle proofs ──
    // Vote from smallest to largest to ensure all votes land before quorum triggers resolution.
    // Resolution fires when cumulative yesVotes >= quorum, so the largest voter goes last.

    await step(h, "agent2-vote-merkle", async () => {
      const proof = merkleTree.proofs[2].join(",") || "0x";
      const cli = await h.cliAs("agent2", [
        "proposal", "vote-merkle",
        proposalId!,
        "true",
        "2",  // index
        String(agent2Balance),
        proof,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "agent2 vote-merkle tx");
      h.log("Agent2 voted via merkle (index=2, 2000 tokens)");
      return {cli, command: ["proposal", "vote-merkle"]};
    });

    await step(h, "agent1-vote-merkle", async () => {
      const proof = merkleTree.proofs[1].join(",") || "0x";
      const cli = await h.cliAs("agent1", [
        "proposal", "vote-merkle",
        proposalId!,
        "true",
        "1",  // index
        String(agent1Balance),
        proof,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "agent1 vote-merkle tx");
      h.log("Agent1 voted via merkle (index=1, 3000 tokens)");
      return {cli, command: ["proposal", "vote-merkle"]};
    });

    await step(h, "founder-vote-merkle", async () => {
      const proof = merkleTree.proofs[0].join(",") || "0x";
      const cli = await h.cli([
        "proposal", "vote-merkle",
        proposalId!,
        "true",
        "0",  // index
        String(founderUnderlyingBalance),
        proof,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "founder vote-merkle tx");
      h.log("Founder voted via merkle (index=0, 8500 tokens — triggers quorum)");
      return {cli, command: ["proposal", "vote-merkle"]};
    });

    // Advance past voting duration and execute
    await h.advanceTime(3700);

    await step(h, "execute-mint-agent-tokens", async () => {
      const cli = await h.cli([
        "execute", proposalId!,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "execute tx");
      h.log("mint-agent-tokens proposal executed via oracle primary voting");
      return {cli, command: ["execute"]};
    });

    await h.syncIndexer();

    // Verify proposal passed
    await step(h, "verify-proposal-executed", async () => {
      const cli = await h.view("proposals", ["--dac", dacAddress!]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>>;
      const prop = proposals.find((p) => String(p.proposalNumericId) === proposalId);
      assert.defined(prop, "proposal found in indexer");
      assert.equal(prop!.passed, true, "proposal passed");
      assert.equal(prop!.executed, true, "proposal executed");
      assert.gte(Number(prop!.merkleVoteCount ?? 0), 3, "3 merkle votes recorded");
      h.log(`Proposal #${proposalId}: passed=${prop!.passed}, executed=${prop!.executed}, merkleVotes=${prop!.merkleVoteCount}`);
      return {cli, command: ["view", "proposals"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: MIXED VOTING (merkle + wrapped on same proposal)
    // ══════════════════════════════════════════════════════════════

    h.log("\n═══ PHASE 3: Mixed Voting (merkle + wrapped) ═══");

    // Create update-voting-config proposal (will also test config change)
    let configProposalId: string;

    await step(h, "propose-update-voting-config", async () => {
      const cli = await h.cli([
        "propose", "update-voting-config",
        "30",     // quorumPercent → 30% (lower for Phase 4 single-voter shortcuts)
        "0",      // blockingPercent
        "75",     // highQuorumPercent
        "3600",   // duration (unchanged)
        "0",      // qualification
        "86400",  // executionValidityDuration
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      configProposalId = String(cli.data.proposalId ?? cli.data.id ?? "");
      assert.defined(cli.data.txHash, "propose tx");
      h.log(`Proposal #${configProposalId} created (update-voting-config)`);
      return {cli, command: ["propose", "update-voting-config"]};
    });

    await h.syncIndexer();

    const snapshotBlock2 = await getProposalSnapshotBlock(configProposalId!);

    // Build a fresh merkle tree (same balances, since no transfers happened)
    const merkleTree2 = buildVotingPowerMerkleTree([
      {voter: founder.address as `0x${string}`, amount: founderUnderlyingBalance},
      {voter: agent1.address as `0x${string}`, amount: agent1Balance},
      {voter: agent2.address as `0x${string}`, amount: agent2Balance},
    ]);

    // Publish oracle snapshot for this proposal
    await step(h, "oracle-publish-snapshot-2", async () => {
      const cli = await h.cli([
        "oracle", "publish",
        configProposalId!,
        snapshotBlock2,
        merkleTree2.root,
        String(merkleTree2.totalVotingPower),
        "--governance-oracle", oracleAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "publish tx");
      return {cli, command: ["oracle", "publish"]};
    });

    // Activate primary
    await step(h, "activate-primary-2", async () => {
      const cli = await h.cli([
        "proposal", "activate-primary", configProposalId!,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "activate-primary tx");
      return {cli, command: ["proposal", "activate-primary"]};
    });

    // Mixed voting: founder votes BOTH merkle + wrapped, agent1 votes merkle only.
    // This tests that a single voter can contribute from both underlying (merkle) and
    // wrapped (delegate) pools on the same proposal during PrimaryVoting.
    // Vote order: smallest first → largest last (to avoid early resolution).

    // agent1 votes via merkle first (3000 — won't trigger quorum alone)
    await step(h, "agent1-vote-merkle-mixed", async () => {
      const proof = merkleTree2.proofs[1].join(",") || "0x";
      const cli = await h.cliAs("agent1", [
        "proposal", "vote-merkle",
        configProposalId!,
        "true",
        "1",
        String(agent1Balance),
        proof,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "agent1 merkle vote tx");
      h.log("Agent1 voted via merkle (3000 tokens)");
      return {cli, command: ["proposal", "vote-merkle"]};
    });

    // founder votes via wrapped (adds ~1500 from wrapped pool)
    await step(h, "founder-vote-wrapped-mixed", async () => {
      const cli = await h.cli([
        "vote", "proposal", configProposalId!, "true",
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "founder wrapped vote tx");
      h.log("Founder voted via wrapped (wrapped pool, same proposal)");
      return {cli, command: ["vote", "proposal"]};
    });

    // founder ALSO votes via merkle (8500 — largest, triggers quorum)
    await step(h, "founder-vote-merkle-mixed", async () => {
      const proof = merkleTree2.proofs[0].join(",") || "0x";
      const cli = await h.cli([
        "proposal", "vote-merkle",
        configProposalId!,
        "true",
        "0",
        String(founderUnderlyingBalance),
        proof,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "founder merkle vote tx");
      h.log("Founder voted via merkle (8500 tokens — triggers quorum)");
      return {cli, command: ["proposal", "vote-merkle"]};
    });

    // Advance + execute
    await h.advanceTime(3700);

    await step(h, "execute-update-voting-config", async () => {
      const cli = await h.cli([
        "execute", configProposalId!,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "execute tx");
      h.log("update-voting-config executed (quorum now 30%)");
      return {cli, command: ["execute"]};
    });

    await h.syncIndexer();

    // Verify update-voting-config proposal in indexer after execution
    await step(h, "verify-update-voting-config-executed", async () => {
      const cli = await h.view("proposals", ["--dac", dacAddress!]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>>;
      const prop = proposals.find((p) => String(p.proposalNumericId) === configProposalId);
      assert.defined(prop, "update-voting-config proposal found in indexer");
      assert.equal(prop!.passed, true, "update-voting-config passed");
      assert.equal(prop!.executed, true, "update-voting-config executed");
      h.log(`Proposal #${configProposalId}: merkleVotes=${prop!.merkleVoteCount}, voteCount=${prop!.voteCount}, yesVotes=${prop!.yesVotes}`);
      return {cli, command: ["view", "proposals"], indexerSnapshot: {proposal: prop} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: GOVERNANCE CONFIG PROPOSALS
    // ══════════════════════════════════════════════════════════════

    h.log("\n═══ PHASE 4: Governance Config Proposals ═══");

    // Helper to propose → oracle publish → vote-merkle → execute
    async function oracleProposeVoteExecute(
      label: string,
      proposeArgs: string[],
    ): Promise<string> {
      const proposeCli = await h.cli([
        ...proposeArgs,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      const pId = String(proposeCli.data.proposalId ?? proposeCli.data.id ?? "");

      await h.syncIndexer();

      // primarySnapshotBlock = createdBlockNumber - 1 (from indexer)
      const pSnapshotBlock = await getProposalSnapshotBlock(pId);
      h.log(`${label}: proposal #${pId} created (snapshotBlock=${pSnapshotBlock})`);

      // Build merkle tree (same underlying balances)
      const tree = buildVotingPowerMerkleTree([
        {voter: founder.address as `0x${string}`, amount: founderUnderlyingBalance},
        {voter: agent1.address as `0x${string}`, amount: agent1Balance},
        {voter: agent2.address as `0x${string}`, amount: agent2Balance},
      ]);

      // Publish snapshot
      await h.cli([
        "oracle", "publish", pId, pSnapshotBlock, tree.root, String(tree.totalVotingPower),
        "--governance-oracle", oracleAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);

      // Activate primary
      await h.cli([
        "proposal", "activate-primary", pId,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);

      // All governance config proposals use highQuorum (75%). Need enough combined votes.
      // Vote order: smallest first to avoid early resolution.

      // agent1 votes via merkle (3000)
      const agent1Proof = tree.proofs[1].join(",") || "0x";
      await h.cliAs("agent1", [
        "proposal", "vote-merkle", pId, "true", "1", String(agent1Balance), agent1Proof,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);

      // Founder votes via wrapped
      await h.cli([
        "vote", "proposal", pId, "true",
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);

      // Founder votes via merkle (8500 — largest, triggers quorum)
      const proof = tree.proofs[0].join(",") || "0x";
      await h.cli([
        "proposal", "vote-merkle", pId, "true", "0", String(founderUnderlyingBalance), proof,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);

      // Advance + execute
      await h.advanceTime(3700);
      await h.cli([
        "execute", pId,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);

      await h.syncIndexer();
      h.log(`${label}: proposal #${pId} executed`);
      return pId;
    }

    // ── 4a: update-governance-strategy ──
    // Contract rule: if blockingPercent=0, then blockingOnAllProposals and blockingOnHighQuorum must be false
    await step(h, "update-governance-strategy", async () => {
      const pId = await oracleProposeVoteExecute("update-governance-strategy", [
        "propose", "update-governance-strategy",
        "30",     // quorumPercent
        "75",     // highQuorumPercent
        "10",     // blockingPercent (>0 to allow blockingOnHighQuorum)
        "3600",   // duration
        "0",      // qualification
        "86400",  // executionValidityDuration
        "600",    // oraclePublishDeadline
        "10",     // fallbackWarmupDuration
        "3600",   // fallbackDuration
        "false",  // blockingOnAllProposals
        "true",   // blockingOnHighQuorum
        "true",   // oraclePrimaryEnabled (keep enabled)
      ]);
      return {
        cli: {data: {proposalId: pId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["propose", "update-governance-strategy"],
      };
    });

    // ── 4b: update-deal-creation-config ──
    await step(h, "update-deal-creation-config", async () => {
      const pId = await oracleProposeVoteExecute("update-deal-creation-config", [
        "propose", "update-deal-creation-config",
        "1000000000000000000",   // minAgentBalance = 1 token
        "500000000000000000",    // minInitialAgentStake = 0.5 tokens
      ]);
      return {
        cli: {data: {proposalId: pId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["propose", "update-deal-creation-config"],
      };
    });

    // ── 4c: update-legal-wrapper ──
    await step(h, "update-legal-wrapper", async () => {
      const pId = await oracleProposeVoteExecute("update-legal-wrapper", [
        "propose", "update-legal-wrapper",
        founder.address,                          // wrapperAddr (any address)
        "QmQA_operating_agreement_ipfs_hash",     // operatingAgreementIPFS
        "QA Registered Agent LLC",                // registeredAgent
        "0x",                                     // data (empty)
      ]);
      return {
        cli: {data: {proposalId: pId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["propose", "update-legal-wrapper"],
      };
    });

    // ── 4d: approve-offchain-action ──
    await step(h, "approve-offchain-action", async () => {
      // Use an arbitrary bytes4 selector and data
      const pId = await oracleProposeVoteExecute("approve-offchain-action", [
        "propose", "approve-offchain-action",
        "0xdeadbeef",   // selector
        "0x1234",       // data
      ]);
      return {
        cli: {data: {proposalId: pId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["propose", "approve-offchain-action"],
      };
    });

    // ── Verify all Phase 4 proposals resolved & executed in indexer ──
    await step(h, "verify-phase4-proposals", async () => {
      const cli = await h.view("proposals", ["--dac", dacAddress!]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>>;
      assert.defined(proposals, "proposals list");

      // Check that proposals 3-6 (governance-strategy, deal-creation-config,
      // legal-wrapper, offchain-action) are all executed
      let executedCount = 0;
      for (const p of proposals) {
        if (p.executed === true) executedCount++;
        h.log(`  Proposal #${p.proposalNumericId}: kind=${p.kindName ?? p.kindSelector}, passed=${p.passed}, executed=${p.executed}, resolved=${p.resolved}`);
      }
      // At minimum, proposals 1 (mint-agent-tokens) + 2 (update-voting-config) + 4 Phase 4 proposals = 6 executed
      assert.gte(executedCount, 6, "at least 6 proposals executed (Phase 2 + 3 + Phase 4)");

      return {cli, command: ["view", "proposals"], indexerSnapshot: {proposals} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 5: ORACLE SWAP
    // ══════════════════════════════════════════════════════════════

    h.log("\n═══ PHASE 5: Oracle Swap ═══");

    // Deploy a new oracle
    let newOracleAddress: string;

    await step(h, "deploy-new-oracle", async () => {
      const cli = await h.cli([
        "oracle", "deploy", founder.address, founder.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      newOracleAddress = cli.data.oracleAddress as string;
      assert.isAddress(newOracleAddress, "new oracle deployed");
      h.log(`New oracle deployed: ${newOracleAddress}`);
      return {cli, command: ["oracle", "deploy"]};
    });

    // Propose update-governance-oracle to switch to new oracle
    await step(h, "update-governance-oracle", async () => {
      const pId = await oracleProposeVoteExecute("update-governance-oracle", [
        "propose", "update-governance-oracle",
        newOracleAddress!,
      ]);

      // Verify DAC now uses the new oracle
      const dacCli = await h.view("dac", ["--dac", dacAddress!]);
      const dacRecord = dacCli.data.dac as Record<string, unknown>;
      const currentOracle = (dacRecord.governanceOracleAddress as string)?.toLowerCase();
      assert.equal(currentOracle, newOracleAddress!.toLowerCase(), "DAC oracle updated to new address");
      h.log(`DAC oracle swapped from ${oracleAddress!.slice(0, 10)}... to ${newOracleAddress!.slice(0, 10)}...`);

      return {
        cli: {data: {proposalId: pId, newOracle: newOracleAddress}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["propose", "update-governance-oracle"],
      };
    });

    // Verify the new oracle works: create a proposal and use the new oracle
    await step(h, "verify-new-oracle-works", async () => {
      // Create a simple proposal
      const cli = await h.cli([
        "propose", "mint-agent-tokens",
        "50000000000000000000000",  // 50k tokens
        founder.address,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      const verifyProposalId = String(cli.data.proposalId ?? cli.data.id ?? "");

      await h.syncIndexer();

      const pSnapshotBlock = await getProposalSnapshotBlock(verifyProposalId);

      // Publish via NEW oracle
      const tree = buildVotingPowerMerkleTree([
        {voter: founder.address as `0x${string}`, amount: founderUnderlyingBalance},
        {voter: agent1.address as `0x${string}`, amount: agent1Balance},
        {voter: agent2.address as `0x${string}`, amount: agent2Balance},
      ]);

      await h.cli([
        "oracle", "publish", verifyProposalId, pSnapshotBlock, tree.root, String(tree.totalVotingPower),
        "--governance-oracle", newOracleAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);

      // Activate primary
      await h.cli([
        "proposal", "activate-primary", verifyProposalId,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);

      // Vote via merkle
      const proof = tree.proofs[0].join(",") || "0x";
      await h.cli([
        "proposal", "vote-merkle", verifyProposalId, "true", "0", String(founderUnderlyingBalance), proof,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);

      // Execute
      await h.advanceTime(3700);
      await h.cli([
        "execute", verifyProposalId,
        "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);

      h.log("New oracle verified: proposal created, snapshot published, voted, executed");
      return {cli, command: ["verify-new-oracle"]};
    });

    await h.syncIndexer();

    // Verify the oracle swap and final proposal in indexer
    await step(h, "verify-oracle-swap-indexed", async () => {
      // Confirm DAC's governanceOracle field is updated
      const dacCli = await h.view("dac", ["--dac", dacAddress!]);
      const dacRecord = dacCli.data.dac as Record<string, unknown>;
      const currentOracle = (dacRecord.governanceOracleAddress as string)?.toLowerCase();
      assert.equal(currentOracle, newOracleAddress!.toLowerCase(), "DAC oracle address updated in indexer");

      // Confirm all proposals are indexed (including the verification proposal via new oracle)
      const propCli = await h.view("proposals", ["--dac", dacAddress!]);
      const proposals = propCli.data.proposals as Array<Record<string, unknown>>;
      const executedCount = proposals.filter((p) => p.executed === true).length;
      h.log(`Final: ${proposals.length} proposals total, ${executedCount} executed, oracle=${currentOracle}`);
      // All 8 proposals should be executed (Phase 2: mint, Phase 3: voting-config, Phase 4: 4 config, Phase 5: oracle swap + verify mint)
      assert.gte(executedCount, 8, "all 8 proposals executed");

      return {
        cli: dacCli,
        command: ["view", "dac"],
        indexerSnapshot: {dac: dacRecord, proposalCount: proposals.length, executedCount} as Record<string, unknown>,
      };
    });

    h.log("\n✓ Oracle governance scenario completed: primary merkle voting + mixed voting + 5 config proposals + oracle swap");
  },
};
