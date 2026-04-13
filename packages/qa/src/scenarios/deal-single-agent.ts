import {writeFileSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";

/**
 * Scenario: Single-Agent Deal Lifecycle
 *
 * Prerequisites: an existing DAC with agent tokens minted for the founder.
 * This scenario creates a new DAC first, then runs the full deal lifecycle.
 *
 * Flow:
 * 1. Create native DAC
 * 2. Mint agent tokens to founder
 * 3. Vote + execute mint proposal
 * 4. Create deal proposal (permit2-treasury, milestones-evaluator)
 * 5. Vote + execute deal approval
 * 6. Stake agent tokens to deal
 * 7. Evaluate deal
 * 8. Claim rewards
 * 9. Verify indexer state throughout
 */
export const dealSingleAgentScenario: Scenario = {
  name: "deal-single-agent-lifecycle",
  description: "Create DAC → mint agent tokens → create deal → stake → evaluate → claim",
  tags: ["deal", "single-agent", "lifecycle", "native-dac"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain for time manipulation. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    if (!founderWallet) throw new Error("founder wallet required");

    let dacAddress: string;
    let agentTokenAddress: string;
    let mainTokenAddress: string;
    let dealManagerAddress: string;

    // ── Step 1: Create native DAC ─────────────────────────────────

    await step(h, "create-native-dac", async () => {
      const args = [
        "create",
        "--name", "QA Deal Test DAC",
        "--description", "DAC for deal lifecycle testing",
        "--symbol", "QDEAL",
        "--max-supply", "10000000000000000000000000",
        "--default-quorum", "50",
        "--allocation", "1000000000000000000000000",
        "--treasury-token", await resolveUnderlyingToken(h),
        "--commitment", "0",
        "--auto-delegate",
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);

      dacAddress = cli.data.dac as string;
      agentTokenAddress = cli.data.agentToken as string;
      mainTokenAddress = cli.data.mainToken as string;

      assert.isAddress(dacAddress, "DAC address valid");
      assert.isAddress(agentTokenAddress, "agent token address valid");
      assert.equal(cli.data.action, "dac.create", "correct action");

      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Step 1b: Fulfill root capital call (founder gets main tokens) ─

    await step(h, "join-dac-founder", async () => {
      const args = [
        "join",
        "--dac", dacAddress!,
        "--auto-approve",
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "join tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    // Delegate after receiving main tokens
    await step(h, "delegate-votes", async () => {
      const args = [
        "delegate",
        "--delegatee", founderWallet.address,
        "--dac", dacAddress!,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "delegate tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // Get deal manager from indexer
    await step(h, "get-dac-info", async () => {
      const cli = await h.view("dac", ["--dac", dacAddress!]);
      const dac = cli.data.dac as Record<string, unknown>;
      dealManagerAddress = dac.dealManagerAddress as string;
      assert.isAddress(dealManagerAddress, "deal manager address present");

      return {cli, command: ["dac", "view", "dac"], indexerSnapshot: dac};
    });

    // ── Step 2: Mint agent tokens ─────────────────────────────────

    let mintProposalId: string;

    await step(h, "propose-mint-agent-tokens", async () => {
      const mintAmount = "100000000000000000000000"; // 100k
      const args = [
        "propose", "mint-agent-tokens", mintAmount, founderWallet.address,
        "--dac", dacAddress!,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      mintProposalId = String(cli.data.proposalId ?? cli.data.id ?? "1");
      assert.defined(cli.data.txHash, "propose tx hash present");

      return {cli, command: ["dac", ...args]};
    });

    // Vote and execute
    await h.advanceTime(10); // past qualification

    await step(h, "vote-mint-agent-tokens", async () => {
      const args = [
        "vote", "proposal", mintProposalId!, "true",
        "--dac", dacAddress!,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "vote tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await h.advanceTime(3700); // past voting duration

    await step(h, "execute-mint-agent-tokens", async () => {
      const args = [
        "execute", mintProposalId!,
        "--dac", dacAddress!,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "execute tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Step 3: Create deal ───────────────────────────────────────

    // Get chain timestamp (EVM time may differ from wall clock after advanceTime)
    const chainTimestamp = await getChainTimestamp(h);

    // Use the treasury token (same ERC20 used for the DAC) as deal funding token
    const treasuryToken = await resolveUnderlyingToken(h);

    // Write deal config JSON to temp file
    const ZERO_ADDR = "0x0000000000000000000000000000000000000000";
    const dealConfig = {
      dealKind: "permit2-treasury",
      name: "QA Test Deal",
      description: "E2E test deal for single agent lifecycle",
      linkHash: "seed://qa-deal-test",
      fundingToken: treasuryToken,
      fundingAmount: "0",
      rewardsLimit: "500000000",
      dealRewardPoolPercent: "0",
      approveDeadline: String(chainTimestamp + 86400 * 7),
      evaluationDeadline: String(chainTimestamp + 86400 * 15),
      dealDeadline: String(chainTimestamp + 86400 * 30),
      dealConfig: {},
      evaluatorSelector: "milestones-evaluator",
      evaluatorConfig: {
        rewardShare: "1000000000000000000",  // 100% (1e18 = MANTISSA)
        milestones: [
          {
            milestoneType: 0,
            token: treasuryToken,
            oracle: ZERO_ADDR,
            valuationMode: 0,
            fundingToken: ZERO_ADDR,
            expectedReturn: "1000000000000000000000",  // 1000 tokens
            timestamp: String(chainTimestamp + 86400 * 7),
            rewardPercentage: "1000000000000000000",  // 100%
            rewardCurve: ["0"],
            penaltyCurve: ["1000000000000000000"],
            minPercentGrace: "0",
            extension: "0",
          },
        ],
      },
      vetoEnabled: false,
      agentsLimit: "0",
      minimalStake: "0",
    };

    const dealConfigPath = join(tmpdir(), `qa-deal-config-${Date.now()}.json`);
    writeFileSync(dealConfigPath, JSON.stringify(dealConfig, null, 2));

    let dealProposalId: string;
    let dealCell: string;
    let dealAddress: string;
    let dealNumericId: string;

    await step(h, "create-deal-proposal", async () => {
      const args = [
        "deal", "create", dealConfigPath,
        "--dac", dacAddress!,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);

      dealProposalId = String(cli.data.dacProposalId ?? cli.data.proposalId ?? "");
      dealCell = cli.data.dealCell as string;
      dealAddress = cli.data.dealAddress as string;
      dealNumericId = String(cli.data.dealId ?? "");

      assert.defined(cli.data.txHash, "deal create tx hash present");
      assert.isAddress(dealCell, "deal cell address valid");
      assert.isAddress(dealAddress, "deal address valid");

      return {cli, command: ["dac", ...args]};
    });

    // ── Step 3b: Stake agent tokens BEFORE approval ────────────────
    // The deal approval execution checks that stakeToken.totalSupply() > 0,
    // so at least one agent must stake before the proposal can be executed.
    // stakeAgentToDeal takes the dealCell address (not the deal governance address).

    await h.syncIndexer();

    // Debug: log both addresses to help diagnose InvalidDealAddress
    h.log(`dealAddress=${dealAddress!}, dealCell=${dealCell!}`);

    await step(h, "stake-agent-tokens", async () => {
      const stakeAmount = "10000000000000000000000"; // 10k
      // Note: AgentToken.stakeToDeal does internal _transfer, no ERC20 approve needed.
      // AgentToken.approve() is only for the stake-request flow (post-approval).
      const args = [
        "deal", "stake", stakeAmount,
        "--deal-address", dealCell!,
        "--dac", dacAddress!,
        "--auto-delegate",
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "stake tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    // ── Step 4: Vote + execute deal approval ──────────────────────

    await h.advanceTime(10);

    await step(h, "vote-approve-deal", async () => {
      const args = [
        "vote", "proposal", dealProposalId!, "true",
        "--dac", dacAddress!,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "vote tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await h.advanceTime(3700);

    await step(h, "execute-approve-deal", async () => {
      const args = [
        "execute", dealProposalId!,
        "--dac", dacAddress!,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "execute tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Step 5: Verify deal in indexer ────────────────────────────

    await step(h, "verify-deal-in-indexer", async () => {
      const cli = await h.dealView("deal", [
        "--deal-address", dealAddress!,
      ]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal found in indexer");

      if (deal) {
        assert.equal(deal.name, "QA Test Deal", "deal name matches");
        assert.equal(deal.active, true, "deal is active");
        assert.equal(deal.closed, false, "deal is not closed");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Step 6: Verify stake in indexer ─────────────────────────────

    await step(h, "verify-stake-in-indexer", async () => {
      const cli = await h.dealView("deal", [
        "--deal-address", dealAddress!,
      ]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;

      if (deal) {
        const stakerCount = Number(deal.stakerCount ?? 0);
        assert.gte(stakerCount, 1, "at least 1 staker");
        assert.truthy(deal.currentStakedAmount, "staked amount is nonzero");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Step 7: Evaluate deal ─────────────────────────────────────

    // Advance past milestone timestamp (7 days) but stay under deal deadline (30 days)
    await h.advanceTime(86400 * 8);

    await step(h, "evaluate-deal", async () => {
      // Use --deal-id with the on-chain numeric ID + --dac context (tests the new resolution)
      const args = [
        "deal", "evaluate",
        "--deal-id", dealNumericId!,
        "--dac", dacAddress!,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "evaluate tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Step 8: Verify deal closed after evaluation ───────────────
    // With rewardCurve=[0] and penaltyCurve=[1e18], the evaluator returns a 100% slash
    // at progress=0. The slash burns all staked tokens → totalSupply=0 → auto-close.

    await step(h, "verify-deal-closed", async () => {
      const cli = await h.dealView("deal", [
        "--deal-address", dealAddress!,
      ]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal still in indexer after evaluation");

      if (deal) {
        assert.equal(deal.closed, true, "deal is closed after full slash");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // Verify deal proposals
    await step(h, "verify-deal-proposals", async () => {
      const cli = await h.view("deals", ["--dac", dacAddress!]);
      const deals = cli.data.deals as Array<Record<string, unknown>> | undefined;
      assert.defined(deals, "deals found in indexer");
      assert.gte(deals?.length ?? 0, 1, "at least 1 deal");

      return {cli, command: ["dac", "view", "deals"], indexerSnapshot: {deals} as Record<string, unknown>};
    });
  },
};

/**
 * Resolve an ERC20 token address to use as treasury token.
 * On local Hardhat: use the known mock token from seed scripts.
 * On testnet: use a known stablecoin.
 */
async function getChainTimestamp(h: Harness): Promise<number> {
  const res = await fetch(h.config.rpcUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({jsonrpc: "2.0", id: 1, method: "eth_getBlockByNumber", params: ["latest", false]}),
  });
  const json = (await res.json()) as {result?: {timestamp: string}};
  return Number(BigInt(json.result?.timestamp ?? "0"));
}

async function resolveUnderlyingToken(h: Harness): Promise<string> {
  if (h.config.chainId === 84532) {
    return "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia USDC
  }
  // Local chain: use the mock token from user's config
  return "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB";
}
