import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  FALLBACK_WARMUP_BLOCKS,
  mintMockToken,
  passFallbackWarmup,
  resolveUnderlyingToken,
  sameAddress,
} from "./fixtures/index.js";

/**
 * Scenario: Hybrid governance — fallback paths when the oracle does not deliver
 *
 * `oracle-governance` covers the happy path (snapshot published, primary voting).
 * This one covers what operators do when the publisher misses or the oracle is
 * gone, and the explicit phase-transition commands that drive it:
 *
 *   1. Oracle-primary DAC created with an oracle; `oracle set-publisher` + `oracle status`
 *   2. Publisher misses the deadline → `proposal begin-warmup` (rejected before the
 *      deadline), FallbackWarmup ends at a block (phaseEndTime 0, phaseEndBlock set),
 *      `proposal activate-fallback` (rejected before the snapshot block), vote, execute
 *   3. `oracle deactivate` (irreversible) → `proposal trigger-fallback` on a pending
 *      proposal, lazy transition on the first vote, execute
 *   4. With the oracle inactive, `begin-warmup` is allowed right away on new proposals
 */
export const hybridFallbackPathsScenario: Scenario = {
  name: "hybrid-fallback-paths",
  description: "Oracle outage handling: begin-warmup, activate-fallback, oracle deactivate + trigger-fallback, phase state",
  tags: ["dac", "existing-token", "hybrid", "oracle", "fallback"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founder = config.wallets.founder;
    const spare = config.wallets.agent4;
    if (!founder || !spare) throw new Error("founder + agent4 wallets required");

    const underlyingToken = resolveUnderlyingToken(h);
    const oraclePublishDeadline = 60;

    await mintMockToken(h, {token: underlyingToken, to: founder.address, amount: "10000000000000000000000"});

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: oracle + oracle-primary DAC
    // ══════════════════════════════════════════════════════════════

    let oracleAddress: string;
    await step(h, "deploy-oracle", async () => {
      const cli = await h.cli([
        "oracle", "deploy", founder.address, founder.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      oracleAddress = cli.data.oracleAddress as string;
      assert.isAddress(oracleAddress, "oracle deployed");
      return {cli, command: ["oracle", "deploy"]};
    });

    let dacAddress: string;
    await step(h, "create-oracle-primary-dac", async () => {
      const cli = await h.cli([
        "create-existing-token",
        "--name", "Fallback Paths DAC",
        "--description", "QA: hybrid fallback paths on oracle outage",
        "--symbol", "FBDAC",
        "--underlying-token", underlyingToken,
        "--treasury-seed-amount", "1000000000000000000000",
        "--governance-oracle", oracleAddress!,
        "--oracle-primary-enabled",
        "--quorum-percent", "50",
        "--blocking-percent", "0",
        "--high-quorum-percent", "75",
        "--voting-duration", "3600",
        "--qualification", "0",
        "--execution-validity-duration", "86400",
        "--oracle-publish-deadline", String(oraclePublishDeadline),
        "--fallback-warmup-blocks", String(FALLBACK_WARMUP_BLOCKS),
        "--fallback-duration", "3600",
        "--auto-delegate", "--auto-approve",
        "--config", config.configPath, "--pretty-print",
      ]);
      dacAddress = cli.data.dac as string;
      assert.isAddress(dacAddress, "DAC deployed");
      assert.truthy(sameAddress(cli.data.governanceOracle, oracleAddress), "DAC bound to the oracle");
      return {cli, command: ["create-existing-token", "--oracle-primary-enabled"]};
    });

    await h.syncIndexer();

    // Wrapped voting power for the fallback phases.
    await h.cli([
      "wrap", "--amount", "500000000000000000000", "--dac", dacAddress!, "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);

    await step(h, "oracle-set-publisher", async () => {
      const cli = await h.cli([
        "oracle", "set-publisher", spare.address, "true",
        "--governance-oracle", oracleAddress!, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "set-publisher tx");

      await h.syncIndexer();
      const statusCli = await h.cli([
        "oracle", "status", "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      const oracle = statusCli.data.oracles as Record<string, unknown>;
      assert.equal(oracle.active, true, "oracle active for the DAC");
      const publishers = (oracle.publishers as Array<Record<string, unknown>>) ?? [];
      assert.truthy(publishers.some((p) => sameAddress(p.address, spare.address) && p.allowed === true), "new publisher indexed as allowed");
      return {cli, command: ["oracle", "set-publisher"], indexerSnapshot: oracle};
    });

    async function proposalState(proposalId: string): Promise<Record<string, unknown>> {
      await h.syncIndexer();
      const cli = await h.cli([
        "proposal", "state", proposalId, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      return cli.data;
    }

    async function propose(amount: string): Promise<string> {
      const cli = await h.cli([
        "propose", "mint-agent-tokens", amount, founder.address, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      return String(cli.data.proposalId ?? cli.data.id ?? "");
    }

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: publisher misses the deadline
    // ══════════════════════════════════════════════════════════════

    const missedId = await propose("1000000000000000000000");

    await step(h, "state-awaiting-oracle-snapshot", async () => {
      const state = await proposalState(missedId);
      assert.equal(state.currentPhase, "AWAITING_ORACLE_SNAPSHOT", "new proposal awaits the oracle snapshot");
      return {cli: {data: state, stdout: "", stderr: "", exitCode: 0, durationMs: 0}, command: ["proposal", "state"], indexerSnapshot: state};
    });

    await step(h, "begin-warmup-before-deadline-rejected", async () => {
      const cli = await h.cli([
        "proposal", "begin-warmup", missedId, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(cli.exitCode, 0, "warmup cannot start while the oracle may still publish");
      assert.includes(String(cli.data.error ?? cli.stdout), "NotAllowed", "reverts NotAllowed");
      return {cli, command: ["proposal", "begin-warmup", "(early)"]};
    });

    await h.advanceTime(oraclePublishDeadline + 10);

    await step(h, "begin-warmup", async () => {
      const cli = await h.cli([
        "proposal", "begin-warmup", missedId, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "begin-warmup tx");

      const state = await proposalState(missedId);
      assert.equal(state.currentPhase, "FALLBACK_WARMUP", "proposal in FallbackWarmup");
      assert.equal(String(state.phaseEndTime ?? "0"), "0", "warmup has no end time");
      assert.truthy(BigInt(String(state.phaseEndBlock ?? "0")) > 0n, "warmup ends at a block (phaseEndBlock)");
      assert.equal(String(state.snapshotBlock), String(state.phaseEndBlock), "fallback snapshot is the warmup's last block");
      return {cli, command: ["proposal", "begin-warmup"], indexerSnapshot: state};
    });

    await step(h, "activate-fallback-before-snapshot-rejected", async () => {
      const cli = await h.cli([
        "proposal", "activate-fallback", missedId, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(cli.exitCode, 0, "fallback voting cannot open before the snapshot block has passed");
      assert.includes(String(cli.data.error ?? cli.stdout), "NotAllowed", "reverts NotAllowed");
      return {cli, command: ["proposal", "activate-fallback", "(early)"]};
    });

    await passFallbackWarmup(h);

    await step(h, "activate-fallback", async () => {
      const cli = await h.cli([
        "proposal", "activate-fallback", missedId, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "activate-fallback tx");
      const state = await proposalState(missedId);
      assert.equal(state.currentPhase, "FALLBACK_VOTING", "proposal in FallbackVoting");
      assert.truthy(BigInt(String(state.totalVotingPower ?? "0")) > 0n, "wrapped electorate counted at the fallback snapshot");
      assert.truthy(BigInt(String(state.phaseEndTime ?? "0")) > 0n, "voting phase ends at a time");
      return {cli, command: ["proposal", "activate-fallback"], indexerSnapshot: state};
    });

    await step(h, "vote-execute-missed-oracle-proposal", async () => {
      await h.advanceTime(10);
      await h.cli([
        "vote", "proposal", missedId, "true", "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      await h.advanceTime(3700);
      const cli = await h.cli([
        "execute", missedId, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "execute tx");
      const state = await proposalState(missedId);
      assert.equal(state.currentPhase, "RESOLVED", "proposal resolved");
      assert.equal(state.executed, true, "proposal executed through the fallback path");
      assert.equal(state.resolvedWithoutElectorate, false, "resolved with a real electorate");
      return {cli, command: ["execute"], indexerSnapshot: state};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: oracle deactivated → emergency fallback
    // ══════════════════════════════════════════════════════════════

    const pendingId = await propose("500000000000000000000");

    await step(h, "trigger-fallback-while-oracle-active-rejected", async () => {
      const cli = await h.cli([
        "proposal", "trigger-fallback", pendingId, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(cli.exitCode, 0, "emergency fallback needs an inactive oracle");
      assert.includes(String(cli.data.error ?? cli.stdout), "NotAllowed", "reverts NotAllowed");
      return {cli, command: ["proposal", "trigger-fallback", "(oracle active)"]};
    });

    await step(h, "oracle-deactivate", async () => {
      // A publisher deactivates the oracle for this DAC; irreversible.
      const cli = await h.cli([
        "oracle", "deactivate", "--governance-oracle", oracleAddress!, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "deactivate tx");

      await h.syncIndexer();
      // The indexer models per-DAC deactivation by clearing the DAC's oracle link.
      // (GovernanceOracle.active is not flipped by GovernanceOracleDeactivated — known gap.)
      const dacCli = await h.view("dac", ["--dac", dacAddress!]);
      const dac = dacCli.data.dac as Record<string, unknown>;
      assert.falsy(dac.governanceOracleAddress, "DAC no longer linked to the deactivated oracle in the indexer");
      return {cli, command: ["oracle", "deactivate"], indexerSnapshot: dac};
    });

    await step(h, "trigger-fallback", async () => {
      const cli = await h.cli([
        "proposal", "trigger-fallback", pendingId, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "trigger-fallback tx");
      const state = await proposalState(pendingId);
      assert.equal(state.currentPhase, "FALLBACK_WARMUP", "emergency fallback moved the proposal into warmup");
      return {cli, command: ["proposal", "trigger-fallback"], indexerSnapshot: state};
    });

    await step(h, "lazy-transition-on-vote", async () => {
      // No explicit activate-fallback: the first vote past the snapshot block
      // performs the transition itself.
      await passFallbackWarmup(h);
      await h.advanceTime(10);
      const voteCli = await h.cli([
        "vote", "proposal", pendingId, "true", "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(voteCli.data.txHash, "vote tx");
      const state = await proposalState(pendingId);
      // The single wrapped holder carries the whole electorate, so the same vote
      // that opened FallbackVoting also resolved the proposal.
      assert.truthy(
        state.currentPhase === "FALLBACK_VOTING" || state.currentPhase === "RESOLVED",
        `vote lazily activated fallback voting (phase ${String(state.currentPhase)})`,
      );
      assert.truthy(BigInt(String(state.yesVotes ?? "0")) > 0n, "vote counted in the fallback phase");

      await h.advanceTime(3700);
      const cli = await h.cli([
        "execute", pendingId, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "execute tx");
      return {cli, command: ["vote + execute"], indexerSnapshot: state};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: new proposals after deactivation
    // ══════════════════════════════════════════════════════════════

    await step(h, "begin-warmup-immediately-when-oracle-inactive", async () => {
      const lateId = await propose("100000000000000000000");
      const cli = await h.cli([
        "proposal", "begin-warmup", lateId, "--dac", dacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "begin-warmup tx without waiting for the deadline");
      const state = await proposalState(lateId);
      assert.equal(state.currentPhase, "FALLBACK_WARMUP", "warmup started immediately");
      return {cli, command: ["proposal", "begin-warmup", "(oracle inactive)"], indexerSnapshot: state};
    });
  },
};
