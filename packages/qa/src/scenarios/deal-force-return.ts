import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {getChainTimestamp, mintMockToken, setupNativeDacWithDeal} from "./fixtures/index.js";

/**
 * Scenario: Deal Force Return Capital
 *
 * Creates a FUNDED deal (fundingAmount > 0, funding tokens deposited to DAC treasury),
 * advances past the deal deadline WITHOUT evaluating, then calls forceReturnCapital
 * to withdraw remaining funds back to the DAC treasury.
 *
 * Key protocol behavior: forceReturnCapital only moves FUNDING TOKENS out of the deal
 * cell back to the DAC cell. It does NOT close the deal, release stakes, or slash agents.
 * The deal remains active. Closing requires a separate evaluator action or full reward conversion.
 */
export const dealForceReturnScenario: Scenario = {
  name: "deal-force-return",
  description: "Funded deal past deadline → forceReturnCapital → verify capital returned to treasury",
  tags: ["deal", "force-return", "lifecycle"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    if (!founderWallet) throw new Error("founder wallet required");

    const fundingAmount = "5000000000000000000000"; // 5k funding tokens

    // Mint mock tokens to founder so they have enough for treasury deposit
    h.log("Minting mock tokens for deal funding...");
    await mintMockToken(h, {token: config.tokens.treasury, to: founderWallet.address, amount: "10000000000000000000000"});

    // Use shorter deadlines. skipApproval because we need to deposit treasury
    // tokens BEFORE approval (approval triggers approveFunding which transfers
    // from DAC treasury to deal cell — treasury must have tokens first).
    const ctx = await setupNativeDacWithDeal(h, {
      dealName: "Force Return Deal",
      fundingAmount,
      dealDeadlineDelta: 86400 * 10, // 10 days
      evaluationDeadlineDelta: 86400 * 8,
      skipApproval: true,
      milestones: [{
        expectedReturn: "1000000000000000000000",
        rewardCurve: ["0"],
        penaltyCurve: ["0"],
      }],
    });

    // Deposit funding tokens to DAC treasury BEFORE approval
    h.log("Depositing funding tokens to DAC treasury...");
    await h.cli([
      "deposit-treasury", "--token", ctx.treasuryToken,
      "--amount", fundingAmount,
      "--dac", ctx.dacAddress,
      "--config", config.configPath, "--pretty-print",
    ]);

    // Now approve the deal — this triggers approveFunding which moves tokens to deal cell
    h.log("Approving deal (triggers funding transfer to deal cell)...");
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
    await h.syncIndexer();

    // ── Verify deal cell received funding tokens ─────────────────

    await step(h, "verify-deal-funded", async () => {
      const balCli = await h.cli([
        "balance", ctx.treasuryToken, ctx.dealCell,
        "--config", config.configPath, "--pretty-print",
      ]);
      const cellBalance = BigInt(balCli.data.balance as string);
      h.log(`Deal cell funding balance: ${cellBalance}`);

      // Check treasury holdings via indexer too
      const thCli = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
      const holdings = thCli.data.holdings as Array<Record<string, unknown>> | undefined;
      const fundingHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === ctx.treasuryToken.toLowerCase(),
      );
      h.log(`Treasury funding-token holding: ${fundingHolding ? fundingHolding.balance : "not found"}`);

      return {
        cli: balCli,
        command: ["balance"],
        indexerSnapshot: {cellBalance: cellBalance.toString(), treasuryHoldings: holdings} as Record<string, unknown>,
      };
    });

    // ── Advance past deal deadline ───────────────────────────────

    h.log("Advancing past deal deadline...");
    const dealDeadlineTs = ctx.chainTimestamp + 86400 * 10;
    const currentTs = await getChainTimestamp(h);
    const neededAdvance = dealDeadlineTs - currentTs + 3600;
    await h.advanceTime(Math.max(neededAdvance, 3600));

    // ── Force return capital ─────────────────────────────────────

    await step(h, "force-return-capital", async () => {
      const args = [
        "deal", "withdraw", ctx.dealNumericId,
        "--dac", ctx.dacAddress,
        "--config", h.config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);
      assert.defined(cli.data.txHash, "withdraw tx hash present");
      return {cli, command: ["dac", ...args]};
    });

    await h.syncIndexer();

    // ── Verify deal state after force return ─────────────────────

    await step(h, "verify-deal-after-withdraw", async () => {
      const cli = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
      const deal = cli.data.deal as Record<string, unknown> | undefined;
      assert.defined(deal, "deal in indexer after force return");

      if (deal) {
        h.log(`Deal after withdraw: active=${deal.active}, closed=${deal.closed}, staked=${deal.currentStakedAmount}`);
        // Deal stays active — forceReturnCapital only moves funding tokens
        assert.equal(deal.active, true, "deal still active after force return");
        assert.equal(deal.closed, false, "deal not closed (withdraw only returns capital)");
        // Stakes are untouched by forceReturnCapital
        assert.equal(deal.currentStakedAmount, "10000000000000000000000", "stakes unchanged by force return");
        assert.equal(deal.totalSlashedStakeAmount, "0", "no slashing from force return");
        assert.equal(deal.totalReleasedStakeAmount, "0", "no stake release from force return");
      }

      return {cli, command: ["deal", "view", "deal"], indexerSnapshot: deal as Record<string, unknown>};
    });

    // ── Verify funding returned to treasury ──────────────────────

    await step(h, "verify-treasury-received-funds", async () => {
      const cli = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
      const holdings = cli.data.holdings as Array<Record<string, unknown>> | undefined;
      assert.defined(holdings, "treasury holdings after withdraw");

      const fundingHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === ctx.treasuryToken.toLowerCase(),
      );
      if (fundingHolding) {
        h.log(`Treasury funding-token balance after withdraw: ${fundingHolding.balance}`);
      }

      // Also check on-chain: deal cell should have 0 funding tokens now
      const cellBalCli = await h.cli([
        "balance", ctx.treasuryToken, ctx.dealCell,
        "--config", config.configPath, "--pretty-print",
      ]);
      const cellBalance = BigInt(cellBalCli.data.balance as string);
      h.log(`Deal cell funding balance after withdraw: ${cellBalance}`);
      assert.equal(cellBalance, 0n, "deal cell funding tokens returned to treasury");

      return {
        cli,
        command: ["dac", "view", "treasury-holdings"],
        indexerSnapshot: {holdings, cellBalance: cellBalance.toString()} as Record<string, unknown>,
      };
    });
  },
};
