import {writeFileSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  buildDividendMerkleTree,
  getChainTimestamp,
  mintMockToken,
  proposeVoteExecute,
  resolveUnderlyingToken,
  ZERO_ADDR,
} from "./fixtures/index.js";

/**
 * Scenario: Parent-Child DAC Investment with Dividends
 *
 * Flow:
 *   1. Founder A creates an existing-token DAC (investor) seeded with treasury
 *   2. Founder B creates a native DAC (investee) with dividends enabled, 0 commitment
 *   3. Investee DAC mints main tokens into its treasury (so capital calls can succeed)
 *   4. Investee creates capital call #1
 *   5. Investor creates a dac-deal targeting the investee, matching the capital call
 *   6. Investor stakes + approves the deal → first tranche fulfilled automatically
 *   7. Investee creates capital call #2; investor's agent requests tranche → second fulfillment
 *   8. Investee pays dividends via merkle tree (founderB + DACDeal as leaves)
 *   9. Both recipients claim their dividend share
 *  10. Evaluate + close the deal → investee main tokens return to investor treasury
 */
export const dacInvestmentScenario: Scenario = {
  name: "dac-investment",
  description: "Existing-token DAC invests in native DAC via dac-deal, two tranches, dividends, close",
  tags: ["dac-deal", "investment", "capital-call", "dividends", "multi-dac"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain for time manipulation. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founderA = config.wallets.founder;
    const founderB = config.wallets.agent1; // second wallet role
    if (!founderA) throw new Error("founder wallet required");
    if (!founderB) throw new Error("agent1 wallet required (used as founder B)");

    const underlyingToken = await resolveUnderlyingToken(h);

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: SETUP
    // ══════════════════════════════════════════════════════════════

    // ── Step 0: Top up founder underlying balance ──────────────────
    // The mock underlying token allows permissionless mint. We top up to ensure
    // the scenario works regardless of how much underlying was consumed by previous
    // QA runs (no chain reset between scenarios).
    h.log("Minting mock underlying tokens to founder A...");
    await mintMockToken(h, {token: underlyingToken, to: founderA.address, amount: "1000000000000000000000000"});

    // ── Step 1a: Deploy governance oracle for investor DAC ─────────
    let oracleAddress: string;
    await step(h, "deploy-governance-oracle", async () => {
      const cli = await h.cli([
        "oracle", "deploy", founderA.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      oracleAddress = cli.data.oracleAddress as string;
      assert.isAddress(oracleAddress, "oracle deployed");
      return {cli, command: ["dac", "oracle", "deploy"]};
    });

    // ── Step 1b: Create investor DAC (existing-token) ──────────────
    let investorDacAddress: string;
    let investorMainTokenAddress: string;
    await step(h, "create-investor-dac", async () => {
      const cli = await h.cli([
        "create-existing-token",
        "--name", "Investor DAC",
        "--description", "Existing-token DAC, invests via dac-deal",
        "--symbol", "INV",
        "--underlying-token", underlyingToken,
        "--treasury-seed-amount", "100000000000000000000000", // 100k tokens
        "--quorum-percent", "50",
        "--blocking-percent", "25",
        "--high-quorum-percent", "75",
        "--voting-duration", "7200",
        "--qualification", "0",
        "--execution-validity-duration", "86400",
        "--oracle-publish-deadline", "600",
        "--fallback-warmup-duration", "10",
        "--fallback-duration", "3600",
        "--governance-oracle", oracleAddress!,
        "--auto-delegate", "--auto-approve",
        "--config", config.configPath, "--pretty-print",
      ]);
      investorDacAddress = cli.data.dac as string;
      investorMainTokenAddress = (cli.data.wrappedMainToken ?? cli.data.mainToken) as string;
      assert.isAddress(investorDacAddress, "investor DAC deployed");
      return {cli, command: ["dac", "create-existing-token"]};
    });

    // Existing-token DACs don't allocate any tokens to the founder at creation.
    // Founder A must wrap underlying tokens to get voting power (delegation already
    // set to self via --auto-delegate at creation, so wrapping flows voting power).
    await h.syncIndexer();
    h.log("Wrapping underlying tokens for founder A voting power...");
    await h.cli([
      "wrap",
      "--amount", "50000000000000000000000",  // 50k wrapped tokens
      "--dac", investorDacAddress!,
      "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);

    // Investor needs agent tokens so founder A can stake on the dac-deal
    h.log("Minting agent tokens to founder A (investor)...");
    await proposeVoteExecute(h, investorDacAddress!, [
      "propose", "mint-agent-tokens", "100000000000000000000000", founderA.address,
    ]);

    // Deposit underlying tokens to investor's treasury so dac-deal funding can flow.
    // The treasury-seed-amount goes into wrapped main tokens, NOT directly into the
    // underlying treasury balance. For dac-deal `approveFunding` to succeed, the
    // asset controller must hold underlying tokens directly.
    h.log("Depositing underlying tokens into investor DAC treasury (transfer + recover)...");
    await h.cli([
      "deposit-treasury",
      "--token", underlyingToken,
      "--amount", "50000000000000000000000",  // 50k underlying for funding deals
      "--dac", investorDacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ── Step 1c: Create investee DAC (native, dividends enabled) ───
    let investeeDacAddress: string;
    let investeeMainTokenAddress: string;
    await step(h, "create-investee-dac", async () => {
      const cli = await h.cliAs("agent1", [
        "create",
        "--name", "Investee DAC",
        "--description", "Native DAC receiving investment",
        "--symbol", "IVE",
        "--max-supply", "10000000000000000000000000",  // 10M
        "--default-quorum", "50",
        "--allocation", "500000000000000000000000",    // 500k to founder B
        "--treasury-token", underlyingToken,
        "--commitment", "0",
        "--dividends-enabled",
        "--auto-delegate",
        "--config", config.configPath, "--pretty-print",
      ]);
      investeeDacAddress = cli.data.dac as string;
      investeeMainTokenAddress = cli.data.mainToken as string;
      assert.isAddress(investeeDacAddress, "investee DAC deployed");
      return {cli, command: ["dac", "create"]};
    });

    // Founder B must `join` to fulfill the root capital call and actually receive
    // their main tokens (commitment=0 means no payment, but the call still must be
    // fulfilled). Then delegate to self for voting power.
    await h.cliAs("agent1", [
      "join", "--dac", investeeDacAddress!, "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.cliAs("agent1", [
      "delegate", "--delegatee", founderB.address, "--dac", investeeDacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ── Step 1d: Increase investee voting duration ─────────────────
    // The child-vote-proposal on the investor's deal takes ~7310s to complete
    // (deal voting-duration=7200 + margin). The investee proposal must stay open
    // long enough for DACDeal to cast its vote. Set to 14400s (4 hours).
    h.log("Increasing investee voting duration to 14400s...");
    await proposeVoteExecuteAs(h, "agent1", investeeDacAddress!, [
      "propose", "update-voting-config", "50", "0", "50", "14400", "0", "14400",
    ]);
    await h.syncIndexer();

    // ── Step 1e: Investee mints main tokens into treasury ──────────
    // Needed so capital calls (which transfer main tokens FROM treasury to DACDeal) can succeed.
    const investeeTreasuryMainMintAmount = "2000000000000000000000000"; // 2M
    h.log(`Minting ${investeeTreasuryMainMintAmount} main tokens into investee treasury...`);
    await proposeVoteExecuteAs(h, "agent1", investeeDacAddress!, [
      "propose", "mint-main-tokens", investeeTreasuryMainMintAmount,
    ]);
    await h.syncIndexer();

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: FIRST TRANCHE (DAC DEAL + CAPITAL CALL #1)
    // ══════════════════════════════════════════════════════════════

    // We need the DACDeal contract address to set as the capital call recipient.
    // But the deal contract is deployed when the deal proposal is created.
    // So order: investor creates deal proposal → captures dealAddress → investee creates capital call with that recipient → investor approves deal.

    const chainTimestamp = await getChainTimestamp(h);
    const managedEquity1 = "500000000000000000000000";   // 500k investee main tokens (first tranche)
    const cashAmount1 = "10000000000000000000000";        // 10k investor USDC-like

    // Create the dac-deal JSON. capitalCallId is no longer in config — it's linked
    // separately via setRootCapitalCallID after both deal and capital call exist.
    const dealJson = {
      dealKind: "dac-deal",
      name: "Investment Deal",
      description: "Investor DAC invests in investee via DAC deal",
      linkHash: "seed://dac-investment",
      dealTarget: investeeDacAddress!,
      fundingToken: underlyingToken,
      fundingAmount: cashAmount1,
      rewardsLimit: "100000000000000000000000",
      dealRewardPoolPercent: "0",
      approveDeadline: String(chainTimestamp + 86400 * 7),
      evaluationDeadline: String(chainTimestamp + 86400 * 30),
      dealDeadline: String(chainTimestamp + 86400 * 60),
      dealConfig: {
        managedEquity: managedEquity1,
      },
      evaluatorSelector: "milestones-evaluator",
      evaluatorConfig: {
        rewardShare: "1000000000000000000",
        milestones: [{
          milestoneType: 0,
          token: underlyingToken,
          oracle: ZERO_ADDR,
          valuationMode: 0,
          fundingToken: ZERO_ADDR,
          expectedReturn: cashAmount1,
          timestamp: String(chainTimestamp + 86400 * 30),
          rewardPercentage: "1000000000000000000",
          rewardCurve: ["1000000000000000000"],
          penaltyCurve: ["0"],
          minPercentGrace: "0",
          extension: "0",
        }],
      },
      agentsLimit: "0",
      minimalStake: "0",
    };
    const dealJsonPath = join(tmpdir(), `dac-investment-deal-${Date.now()}.json`);
    writeFileSync(dealJsonPath, JSON.stringify(dealJson, null, 2));

    // ── Step 2a: Investor creates dac-deal proposal ────────────────
    let dealAddress: string;
    let dealCell: string;
    let dealNumericId: string;
    let dealDacProposalId: string;
    await step(h, "create-dac-deal", async () => {
      const cli = await h.cli([
        "deal", "create", dealJsonPath,
        "--dac", investorDacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      dealAddress = cli.data.dealAddress as string;
      dealCell = cli.data.dealCell as string;
      dealNumericId = String(cli.data.dealId ?? "");
      dealDacProposalId = String(cli.data.dacProposalId ?? "");
      assert.isAddress(dealAddress, "deal contract deployed");
      h.log(`DAC deal: address=${dealAddress}, cell=${dealCell}, numericId=${dealNumericId}, proposalId=${dealDacProposalId}`);
      return {cli, command: ["dac", "deal", "create"]};
    });
    await h.syncIndexer();

    // ── Step 2b: Investee creates capital call #1 ──────────────────
    // Recipient is the DACDeal contract address (the newly created deal)
    h.log("Investee creating capital call #1...");
    const capitalCall1ProposalId = await proposeVoteExecuteAs(h, "agent1", investeeDacAddress!, [
      "propose", "capital-call",
      dealAddress!,            // recipient = DACDeal contract
      underlyingToken,         // treasury token
      managedEquity1,          // tokenAmount (investee main tokens)
      cashAmount1,             // cashAmount (investor funding)
    ]);
    await h.syncIndexer();

    // Capital call nonce = the DAC proposal ID that created it (contract uses proposal ID as nonce).
    const capitalCall1Nonce = capitalCall1ProposalId;
    h.log(`Capital call #1 nonce = ${capitalCall1Nonce}`);

    // ── Step 2c: Investor founder A stakes on the deal ─────────────
    await step(h, "stake-on-dac-deal", async () => {
      const cli = await h.cli([
        "deal", "stake", "10000000000000000000000", // 10k agent tokens
        "--deal-address", dealCell!,
        "--dac", investorDacAddress!,
        "--auto-delegate",
        "--config", config.configPath, "--pretty-print",
      ]);
      return {cli, command: ["dac", "deal", "stake"]};
    });

    // ── Step 2c2: Link deal to capital call (must be staked agent, before approval) ──
    await step(h, "link-capital-call", async () => {
      const cli = await h.cli([
        "deal", "link-capital-call", capitalCall1Nonce,
        "--deal-address", dealAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "link-capital-call tx");
      h.log(`Linked deal to capital call nonce ${capitalCall1Nonce}`);
      return {cli, command: ["dac", "deal", "link-capital-call"]};
    });

    // ── Step 2d: Investor approves deal via vote/execute ────────────
    //           → triggers _afterApprove → fulfills capital call #1
    h.log("Approving deal (triggers first tranche fulfillment)...");
    await h.advanceTime(10);
    await h.cli([
      "vote", "proposal", dealDacProposalId!, "true",
      "--dac", investorDacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", dealDacProposalId!,
      "--dac", investorDacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ── Step 2e: Verify first tranche fulfilled ────────────────────
    await step(h, "verify-first-tranche", async () => {
      const balanceCli = await h.cli([
        "balance", investeeMainTokenAddress!, dealAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      const dealBalance = balanceCli.data.balance as string;
      h.log(`DACDeal balance of investee main token after tranche 1: ${dealBalance}`);
      assert.equal(dealBalance, managedEquity1, "DACDeal holds managedEquity of investee main tokens");
      return {cli: balanceCli, command: ["dac", "balance"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: SECOND TRANCHE
    // ══════════════════════════════════════════════════════════════

    const managedEquity2 = "300000000000000000000000";   // 300k investee main tokens
    const cashAmount2 = "6000000000000000000000";         // 6k investor USDC

    // ── Step 3a: Investee creates capital call #2 ──────────────────
    // After first tranche, DACDeal has voting power in investee DAC.
    // Both founder B and DACDeal (via child-vote-proposal) must vote.
    h.log("Investee creating capital call #2 (multi-voter governance)...");
    const capitalCall2ProposalId = await proposeVoteExecuteWithChildVote(h, {
      investeeRole: "agent1",
      investeeDacAddress: investeeDacAddress!,
      investorDacAddress: investorDacAddress!,
      dealAddress: dealAddress!,
      proposeArgs: [
        "propose", "capital-call",
        dealAddress!, underlyingToken, managedEquity2, cashAmount2,
      ],
    });
    await h.syncIndexer();

    // Capital call nonce = the DAC proposal ID (same pattern as #1)
    const capitalCall2Nonce = capitalCall2ProposalId;
    h.log(`Capital call #2 nonce = ${capitalCall2Nonce}`);

    // Settle chain state after child-vote flow before next deal proposal
    await h.mineBlock();

    // ── Step 3b: Investor's agent submits request-tranche deal proposal ──
    let trancheDealProposalId: string;
    await step(h, "request-tranche-proposal", async () => {
      const cli = await h.cli([
        "deal", "propose", "request-tranche",
        "--capital-call-nonce", capitalCall2Nonce,
        "--deal-address", dealAddress!,
        "--dac", investorDacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      trancheDealProposalId = String(cli.data.proposalId ?? "");
      assert.defined(trancheDealProposalId, "tranche deal proposal created");
      h.log(`Tranche deal proposal: ${trancheDealProposalId}`);
      return {cli, command: ["dac", "deal", "propose", "request-tranche"]};
    });

    // ── Step 3c: Vote + execute deal-side tranche proposal ─────────
    // This creates a DAC-level tranche proposal in the dealManager.
    // Deal voting duration = 7200s (inherited from investor DAC VotingConfig).
    h.log("Voting/executing deal-side tranche request...");
    await h.advanceTime(10);
    await h.cli([
      "deal", "vote", "proposal", trancheDealProposalId!, "true",
      "--deal-address", dealAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(7300);
    const trancheExecuteCli = await h.cli([
      "deal", "execute", trancheDealProposalId!,
      "--deal-address", dealAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    const dacTrancheProposalId = String(trancheExecuteCli.data.dacProposalId ?? "");
    assert.defined(dacTrancheProposalId, "DAC tranche proposal created");
    h.log(`DAC tranche proposal: ${dacTrancheProposalId}`);

    // ── Step 3d: Vote + execute DAC-level tranche proposal ─────────
    //           → approveFunding(trancheId=1) → _afterApprove(1) → fulfill
    h.log("Voting/executing DAC-level tranche approval...");
    await h.advanceTime(10);
    await h.cli([
      "vote", "proposal", dacTrancheProposalId, "true",
      "--dac", investorDacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.advanceTime(3700);
    await h.cli([
      "execute", dacTrancheProposalId,
      "--dac", investorDacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ── Step 3e: Verify second tranche fulfilled ───────────────────
    const totalManagedEquity = BigInt(managedEquity1) + BigInt(managedEquity2);
    await step(h, "verify-second-tranche", async () => {
      const balanceCli = await h.cli([
        "balance", investeeMainTokenAddress!, dealAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      const dealBalance = balanceCli.data.balance as string;
      h.log(`DACDeal balance after tranche 2: ${dealBalance}, expected ${totalManagedEquity}`);
      assert.equal(dealBalance, totalManagedEquity.toString(), "DACDeal holds both tranches' equity");
      return {cli: balanceCli, command: ["dac", "balance"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: DIVIDEND PAYOUT FROM INVESTEE
    // ══════════════════════════════════════════════════════════════

    // Split 1000 treasury tokens between founder B and DACDeal as dividends.
    // Proportional split based on main-token holdings would be ideal, but for the
    // scenario we just pick round numbers to verify the flow.
    const dividendFounderB = "400000000000000000000";  // 400 tokens to founderB
    const dividendDeal = "600000000000000000000";      // 600 tokens to DACDeal
    const totalPayout = (BigInt(dividendFounderB) + BigInt(dividendDeal)).toString();

    const merkle = buildDividendMerkleTree([
      {receiver: founderB.address as `0x${string}`, amount: BigInt(dividendFounderB)},
      {receiver: dealAddress! as `0x${string}`, amount: BigInt(dividendDeal)},
    ]);
    h.log(`Merkle root: ${merkle.root}`);

    // ── Step 4a: Investee proposes dividend-payout (multi-voter) ────
    let dividendProposalId: string;
    await step(h, "propose-dividend-payout", async () => {
      dividendProposalId = await proposeVoteExecuteWithChildVote(h, {
        investeeRole: "agent1",
        investeeDacAddress: investeeDacAddress!,
        investorDacAddress: investorDacAddress!,
        dealAddress: dealAddress!,
        proposeArgs: [
          "propose", "dividend-payout",
          underlyingToken, totalPayout, merkle.root,
        ],
      });
      assert.defined(dividendProposalId, "dividend proposal executed");
      h.log(`Dividend proposal ID: ${dividendProposalId}`);
      return {
        cli: {data: {proposalId: dividendProposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "dividend-payout"],
      };
    });
    await h.syncIndexer();

    // ── Step 4b: Founder B claims dividend ─────────────────────────
    const founderBProofFile = join(tmpdir(), `dividend-proof-founderB-${Date.now()}.json`);
    writeFileSync(founderBProofFile, JSON.stringify({
      proposalId: dividendProposalId!,
      index: "0",
      receiver: founderB.address,
      amount: dividendFounderB,
      proof: merkle.proofs[0],
    }, null, 2));

    await step(h, "claim-dividend-founder-b", async () => {
      const cli = await h.cliAs("agent1", [
        "claim-dividend", founderBProofFile,
        "--dac", investeeDacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "founder B dividend claim tx");
      return {cli, command: ["dac", "claim-dividend"]};
    });

    // ── Step 4c: Claim dividend on behalf of DACDeal ───────────────
    // claimDividend has no access control — anyone can call; tokens go to receiver
    const dealProofFile = join(tmpdir(), `dividend-proof-deal-${Date.now()}.json`);
    writeFileSync(dealProofFile, JSON.stringify({
      proposalId: dividendProposalId!,
      index: "1",
      receiver: dealAddress!,
      amount: dividendDeal,
      proof: merkle.proofs[1],
    }, null, 2));

    await step(h, "claim-dividend-deal", async () => {
      const cli = await h.cli([
        "claim-dividend", dealProofFile,
        "--dac", investeeDacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "DACDeal dividend claim tx");
      return {cli, command: ["dac", "claim-dividend"]};
    });

    // ── Step 4d: Verify dividend receipts ──────────────────────────
    await step(h, "verify-dividend-balances", async () => {
      const founderBBalanceCli = await h.cli([
        "balance", underlyingToken, founderB.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      const founderBBalance = founderBBalanceCli.data.balance as string;
      h.log(`founderB underlying balance: ${founderBBalance} (expected ≥ ${dividendFounderB})`);
      assert.equal(BigInt(founderBBalance) >= BigInt(dividendFounderB), true, "founderB received dividend");

      const dealBalanceCli = await h.cli([
        "balance", underlyingToken, dealAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      const dealUnderlyingBalance = dealBalanceCli.data.balance as string;
      h.log(`DACDeal underlying balance: ${dealUnderlyingBalance} (expected = ${dividendDeal})`);
      assert.equal(dealUnderlyingBalance, dividendDeal, "DACDeal received its dividend share");

      return {cli: dealBalanceCli, command: ["dac", "balance"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 5: CLOSE DEAL + RETURN MAIN TOKENS TO INVESTOR TREASURY
    // ══════════════════════════════════════════════════════════════

    // Advance past milestone timestamp, then evaluate
    const milestoneTs = chainTimestamp + 86400 * 30;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = milestoneTs - currentTs + 3600;
    h.log(`Advancing ${neededAdvance}s past milestone deadline...`);
    await h.advanceTime(Math.max(neededAdvance, 3600));

    await step(h, "evaluate-dac-deal", async () => {
      const cli = await h.cli([
        "deal", "evaluate",
        "--deal-id", dealNumericId!,
        "--dac", investorDacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(cli.data.txHash, "evaluate tx");
      return {cli, command: ["dac", "deal", "evaluate"]};
    });

    await h.syncIndexer();

    // ── Step 5a: Verify deal closed ────────────────────────────────
    await step(h, "verify-deal-closed", async () => {
      const cli = await h.dealView("deal", ["--deal-address", dealAddress!]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer");
      if (deal) {
        h.log(`Deal state: closed=${deal.closed}, active=${deal.active}`);
        assert.equal(deal.closed, true, "deal closed after evaluation");
      }
      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Step 5b: Verify investor treasury now holds investee main tokens ──
    await step(h, "verify-capital-returned", async () => {
      const cli = await h.view("treasury-holdings", ["--dac", investorDacAddress!]);
      const holdings = cli.data.holdings as Array<Record<string, unknown>> | undefined;
      assert.defined(holdings, "treasury holdings fetched");
      const investeeMainHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === investeeMainTokenAddress!.toLowerCase(),
      );
      assert.defined(investeeMainHolding, "investor treasury holds investee main tokens");
      if (investeeMainHolding) {
        h.log(`Investor treasury holds ${investeeMainHolding.balance} of investee main token (expected ≥ ${totalManagedEquity})`);
        assert.equal(
          BigInt(investeeMainHolding.balance as string) >= totalManagedEquity,
          true,
          "investor treasury balance ≥ total managed equity returned",
        );
      }
      return {cli, command: ["dac", "view", "treasury-holdings"], indexerSnapshot: {holdings} as Record<string, unknown>};
    });
  },
};

/**
 * proposeVoteExecute variant that uses a specific wallet role for all steps.
 * Used for the investee DAC where founder B (agent1 role) is the proposer/voter.
 */
async function proposeVoteExecuteAs(
  h: Harness,
  role: string,
  dacAddress: string,
  proposeArgs: string[],
): Promise<string> {
  const {config} = h;

  const proposeCli = await h.cliAs(role, [
    ...proposeArgs,
    "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);
  const proposalId = String(proposeCli.data.proposalId ?? proposeCli.data.id ?? "");

  await h.syncIndexer();
  await h.advanceTime(10);

  await h.cliAs(role, [
    "vote", "proposal", proposalId, "true",
    "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  await h.advanceTime(3700);

  await h.cliAs(role, [
    "execute", proposalId,
    "--dac", dacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  return proposalId;
}

/**
 * Propose + vote on the investee DAC when DACDeal also has voting power.
 *
 * Flow:
 *   1. Founder B proposes on investee DAC → gets proposalId
 *   2. Founder B votes yes
 *   3. Investor's staked agent creates `child-vote-proposal <proposalId> true` on the deal
 *   4. Investor's staked agents vote + execute the deal proposal → DACDeal votes yes in investee
 *   5. Execute the investee proposal
 *
 * This is the realistic multi-voter governance path for cross-DAC investment.
 */
async function proposeVoteExecuteWithChildVote(
  h: Harness,
  opts: {
    investeeRole: string;
    investeeDacAddress: string;
    investorDacAddress: string;
    dealAddress: string;
    proposeArgs: string[];
  },
): Promise<string> {
  const {config} = h;
  const {investeeRole, investeeDacAddress, investorDacAddress, dealAddress, proposeArgs} = opts;

  // 1. Founder B proposes
  const proposeCli = await h.cliAs(investeeRole, [
    ...proposeArgs,
    "--dac", investeeDacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);
  const proposalId = String(proposeCli.data.proposalId ?? proposeCli.data.id ?? "");

  await h.syncIndexer();
  await h.advanceTime(10);

  // 2. Founder B votes yes
  await h.cliAs(investeeRole, [
    "vote", "proposal", proposalId, "true",
    "--dac", investeeDacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  // 3. Investor's agent creates child-vote-proposal on the deal
  const childVoteCli = await h.cli([
    "deal", "propose", "child-vote-proposal", proposalId, "true",
    "--deal-address", dealAddress,
    "--config", config.configPath, "--pretty-print",
  ]);
  const childVoteProposalId = String(childVoteCli.data.proposalId ?? "");

  // 4. Vote + execute the deal-side child-vote proposal
  // Deal voting duration = 7200s (from investor DAC VotingConfig).
  // With 100% yes votes the quorum path resolves immediately, but we still
  // advance past endTime to be safe against edge cases.
  await h.syncIndexer();
  await h.advanceTime(10);
  const childVoteCli2 = await h.cli([
    "deal", "vote", "proposal", childVoteProposalId, "true",
    "--deal-address", dealAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  // Verify the vote tx actually succeeded on-chain (writeContract doesn't check receipts)
  const {verifyTxReceipt} = await import("./fixtures/index.js");
  const voteReceipt = await verifyTxReceipt(h, childVoteCli2.data.txHash as string);
  if (voteReceipt.status !== "0x1") {
    throw new Error(`child-vote vote tx REVERTED on-chain (status=${voteReceipt.status}, tx=${childVoteCli2.data.txHash}). The CLI returned success but the tx failed silently.`);
  }

  await h.advanceTime(7300);
  await h.cli([
    "deal", "execute", childVoteProposalId,
    "--deal-address", dealAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  // 5. Now both founder B and DACDeal voted — execute the investee proposal
  await h.cliAs(investeeRole, [
    "execute", proposalId,
    "--dac", investeeDacAddress,
    "--config", config.configPath, "--pretty-print",
  ]);

  return proposalId;
}
