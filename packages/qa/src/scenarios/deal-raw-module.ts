import {writeFileSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {toFunctionSelector, encodeAbiParameters} from "viem";
import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, proposeVoteExecute, setupNativeDacWithDeal} from "./fixtures/index.js";

// Raw bytes4 selectors — same as core module but hardcoded to test the raw path
const RAW_PERMIT2_TREASURY_SELECTOR = toFunctionSelector("createPermit2TreasuryDeal()");
const RAW_MILESTONES_EVALUATOR_SELECTOR = toFunctionSelector("createMilestoneEvaluator()");
const RAW_DIRECT_SPEND_SELECTOR = toFunctionSelector("directSpend()");

/**
 * Scenario: Raw Module — Deal Creation + Raw Proposals
 *
 * Verifies that 3rd party module support works end-to-end:
 * 1. Creates a deal using raw 0x selectors + pre-encoded hex configs + explicit factory addresses
 * 2. Submits a raw deal proposal using 0x bytes4 type + raw {target, i, data}
 * 3. Submits a raw DAC proposal using 0x bytes4 type
 * 4. Tests claim-reward-pool command
 */
export const dealRawModuleScenario: Scenario = {
  name: "deal-raw-module",
  description: "Raw 0x selectors for deal kind, evaluator, and proposals — 3rd party module path",
  tags: ["deal", "raw-module", "modularity", "3rd-party"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain for time manipulation. Skipping.");
      return;
    }

    const {assert, config} = h;

    // ── Step 1: Setup DAC + normal deal to extract factory addresses ──

    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Reference Deal",
      dealRewardPoolPercent: "100000000000000000", // 10% for reward pool testing
      milestones: [{
        expectedReturn: "1000000000000000000000",
        rewardCurve: ["1000000000000000000"],  // 100% reward at full progress
        penaltyCurve: ["0"],
      }],
    });

    // ── Step 2: Read factory addresses from first deal ──────────────

    let moduleFactoryAddress: string;
    let governanceFactoryAddress: string;

    await step(h, "read-factory-addresses", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown>;
      assert.defined(deal, "deal in indexer");
      moduleFactoryAddress = deal.moduleFactoryAddress as string;
      governanceFactoryAddress = deal.governanceFactoryAddress as string;
      assert.defined(moduleFactoryAddress, "moduleFactoryAddress present");
      assert.defined(governanceFactoryAddress, "governanceFactoryAddress present");
      h.log(`Factories: module=${moduleFactoryAddress}, governance=${governanceFactoryAddress}`);
      return {cli, command: ["deal", "view", "deal"]};
    });

    // ── Step 3: Create a second deal using RAW selectors ────────────

    const chainTimestamp = await getChainTimestamp(h);

    // Pre-encode deal config as raw hex (permit2-treasury expects ABI-encoded string)
    const rawDealConfig = encodeAbiParameters(
      [{name: "value", type: "string"}],
      ["raw-module-qa-test"],
    );

    // Pre-encode evaluator config as raw hex (milestones evaluator)
    const rawEvaluatorConfig = encodeAbiParameters(
      [{
        type: "tuple",
        components: [
          {name: "rewardShare", type: "uint256"},
          {
            name: "milestones",
            type: "tuple[]",
            components: [
              {name: "milestoneType", type: "uint8"},
              {name: "token", type: "address"},
              {name: "oracle", type: "address"},
              {name: "valuationMode", type: "uint8"},
              {name: "fundingToken", type: "address"},
              {name: "expectedReturn", type: "uint256"},
              {name: "timestamp", type: "uint256"},
              {name: "rewardPercentage", type: "uint256"},
              {name: "rewardCurve", type: "uint256[]"},
              {name: "penaltyCurve", type: "uint256[]"},
              {name: "minPercentGrace", type: "uint256"},
              {name: "extension", type: "uint256"},
            ],
          },
        ],
      }],
      [{
        rewardShare: BigInt("1000000000000000000"),
        milestones: [{
          milestoneType: 0,
          token: ctx.treasuryToken as `0x${string}`,
          oracle: "0x0000000000000000000000000000000000000000",
          valuationMode: 0,
          fundingToken: "0x0000000000000000000000000000000000000000",
          expectedReturn: BigInt("1000000000000000000000"),
          timestamp: BigInt(chainTimestamp + 86400 * 7),
          rewardPercentage: BigInt("1000000000000000000"),
          rewardCurve: [BigInt("1000000000000000000")],
          penaltyCurve: [0n],
          minPercentGrace: 0n,
          extension: 0n,
        }],
      }],
    );

    const rawDealJson = {
      dealKind: RAW_PERMIT2_TREASURY_SELECTOR,
      name: "Raw Module Deal",
      description: "Deal created with raw 0x selectors",
      linkHash: "seed://qa-raw-deal",
      moduleFactory: moduleFactoryAddress!,
      governanceFactory: governanceFactoryAddress!,
      fundingToken: ctx.treasuryToken,
      fundingAmount: "0",
      rewardsLimit: "100000000000000000000000",
      dealRewardPoolPercent: "0",
      approveDeadline: String(chainTimestamp + 86400 * 7),
      evaluationDeadline: String(chainTimestamp + 86400 * 15),
      dealDeadline: String(chainTimestamp + 86400 * 60),
      dealConfig: rawDealConfig,
      evaluatorSelector: RAW_MILESTONES_EVALUATOR_SELECTOR,
      evaluatorConfig: rawEvaluatorConfig,
      evaluatorModuleFactory: "0x0000000000000000000000000000000000000000",
      agentsLimit: "0",
      minimalStake: "0",
    };

    const rawDealConfigPath = join(tmpdir(), `qa-raw-deal-${Date.now()}.json`);
    writeFileSync(rawDealConfigPath, JSON.stringify(rawDealJson, null, 2));

    let rawDealAddress: string;
    let rawDealCell: string;
    let rawDealProposalId: string;

    await step(h, "create-raw-deal", async () => {
      const args = [
        "deal", "create", rawDealConfigPath, "--dac", ctx.dacAddress,
        "--config", config.configPath, "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.dealAddress, "raw deal address present");
      assert.defined(cli.data.dealCell, "raw deal cell present");
      rawDealAddress = cli.data.dealAddress as string;
      rawDealCell = cli.data.dealCell as string;
      rawDealProposalId = String(cli.data.dacProposalId ?? "");
      h.log(`Raw deal created: address=${rawDealAddress}, cell=${rawDealCell}, proposalId=${rawDealProposalId}`);
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Step 4: Stake into raw deal + approve via governance ────────

    h.log("Staking into raw deal...");
    await h.cli([
      "deal", "stake", "10000000000000000000000",
      "--deal-address", rawDealCell!, "--dac", ctx.dacAddress, "--auto-delegate",
      "--config", config.configPath, "--pretty-print",
    ]);

    h.log("Approving raw deal...");
    await h.advanceTime(10);
    await h.cli([
      "vote", "proposal", rawDealProposalId!, "true", "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", rawDealProposalId!, "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);

    await h.syncIndexer();

    // ── Step 5: Verify raw deal is active ───────────────────────────

    await step(h, "verify-raw-deal", async () => {
      const cli = await h.dealView("deal", ["--deal-address", rawDealAddress!]);
      const deal = cli.data.deal as Record<string, unknown>;
      assert.defined(deal, "raw deal in indexer");
      assert.equal(deal.name, "Raw Module Deal", "deal name matches");
      assert.equal(deal.moduleFactoryAddress, moduleFactoryAddress!, "module factory matches");
      assert.equal(deal.active, true, "raw deal active");
      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Step 6: Raw deal proposal ───────────────────────────────────
    // Submit a raw 0x bytes4 proposal — we use the direct-spend selector
    // with manually constructed {target, i, data}

    const rawProposalInput = {
      target: "0x0000000000000000000000000000000000000000",
      i: "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: "0x",
    };
    const rawProposalPath = join(tmpdir(), `qa-raw-proposal-${Date.now()}.json`);
    writeFileSync(rawProposalPath, JSON.stringify(rawProposalInput, null, 2));

    await step(h, "raw-deal-proposal", async () => {
      const args = [
        "deal", "propose", RAW_DIRECT_SPEND_SELECTOR,
        "--deal-address", rawDealAddress!,
        "--input", rawProposalPath,
        "--config", config.configPath, "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "raw deal proposal tx hash");
      assert.defined(cli.data.proposalId, "raw deal proposal id");
      h.log(`Raw deal proposal created: id=${cli.data.proposalId}`);
      return {cli, command: ["dac", ...args]};
    });

    // ── Step 6: Raw DAC proposal ────────────────────────────────────
    // Submit a raw 0x bytes4 DAC proposal — use the offchain action selector as example

    const rawDacProposalSelector = toFunctionSelector("approveOffchainAction()");
    const rawDacProposalData = encodeAbiParameters(
      [{name: "selector", type: "bytes4"}, {name: "data", type: "bytes"}],
      ["0xdeadbeef" as `0x${string}`, "0x" as `0x${string}`],
    );
    const rawDacProposalInput = {
      target: "0x0000000000000000000000000000000000000000",
      i: "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: rawDacProposalData,
    };
    const rawDacProposalPath = join(tmpdir(), `qa-raw-dac-proposal-${Date.now()}.json`);
    writeFileSync(rawDacProposalPath, JSON.stringify(rawDacProposalInput, null, 2));

    await step(h, "raw-dac-proposal", async () => {
      const args = [
        "propose", rawDacProposalSelector,
        "--dac", ctx.dacAddress,
        "--input", rawDacProposalPath,
        "--config", config.configPath, "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "raw DAC proposal tx hash");
      assert.defined(cli.data.proposalId, "raw DAC proposal id");
      h.log(`Raw DAC proposal created: id=${cli.data.proposalId}`);
      return {cli, command: ["dac", ...args]};
    });

    // ── Step 7: Test claim-reward-pool on the reference deal ────────
    // The reference deal has dealRewardPoolPercent > 0, but hasn't been evaluated yet.
    // We'll advance time, evaluate it, then test claim-reward-pool.

    const milestoneTs = ctx.chainTimestamp + 86400 * 7;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = milestoneTs - currentTs + 3600;
    await h.advanceTime(Math.max(neededAdvance, 3600));

    await step(h, "evaluate-reference-deal", async () => {
      const args = [
        "deal", "evaluate",
        "--deal-id", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "evaluate tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await step(h, "claim-reward-pool", async () => {
      const args = [
        "deal", "claim-reward-pool",
        "--deal-address", ctx.dealAddress,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "claim-reward-pool tx hash present");
      h.log(`claim-reward-pool tx: ${cli.data.txHash}`);
      return {cli, command: ["dac", ...args]};
    });
  },
};
