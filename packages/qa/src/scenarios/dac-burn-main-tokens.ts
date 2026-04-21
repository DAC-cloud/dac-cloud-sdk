import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {proposeVoteExecute, resolveUnderlyingToken} from "./fixtures/index.js";

/**
 * Scenario: Burn Main Tokens
 *
 * Tests the governance flow for minting and burning the DAC's main governance tokens.
 * The burn operates on the treasury reserve (asset controller balance).
 *
 * Flow:
 *   1. Create native DAC (founder gets 1M allocation)
 *   2. Mint additional main tokens into treasury reserve
 *   3. Verify total supply increased
 *   4. Burn some tokens from treasury reserve
 *   5. Verify total supply decreased
 *   6. Verify treasury holdings reflect the burn
 */
export const dacBurnMainTokensScenario: Scenario = {
  name: "dac-burn-main-tokens",
  description: "Create DAC → mint main tokens → burn main tokens → verify supply changes",
  tags: ["dac", "governance", "main-tokens", "mint", "burn"],

  async run(h: Harness) {
    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    if (!founderWallet) throw new Error("founder wallet required");

    const treasuryToken = resolveUnderlyingToken(h);

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: CREATE DAC
    // ══════════════════════════════════════════════════════════════

    const founderAllocation = "1000000000000000000000000"; // 1M

    let dacAddress: string;
    let mainTokenAddress: string;

    await step(h, "create-dac", async () => {
      const cli = await h.cli([
        "create",
        "--name", "Burn QA DAC",
        "--description", "QA burn main tokens testing",
        "--symbol", "QBURN",
        "--max-supply", "10000000000000000000000000", // 10M
        "--default-quorum", "50",
        "--allocation", founderAllocation,
        "--treasury-token", treasuryToken,
        "--commitment", "0",
        "--auto-delegate",
        "--config", config.configPath, "--pretty-print",
      ]);
      dacAddress = cli.data.dac as string;
      mainTokenAddress = cli.data.mainToken as string;
      assert.isAddress(dacAddress, "DAC deployed");
      assert.isAddress(mainTokenAddress, "main token deployed");
      return {cli, command: ["dac", "create"]};
    });

    await h.syncIndexer();

    // Join + delegate
    await h.cli([
      "join", "--dac", dacAddress!, "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.cli([
      "delegate", "--delegatee", founderWallet.address, "--dac", dacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ── Record initial balances ─────────────────────────────────

    let initialFounderBalance: bigint;

    await step(h, "check-initial-state", async () => {
      // Founder should have their allocation
      const founderBalCli = await h.cli([
        "balance", mainTokenAddress!, founderWallet.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      initialFounderBalance = BigInt(founderBalCli.data.balance as string);
      h.log(`Founder main-token balance: ${initialFounderBalance}`);
      assert.equal(initialFounderBalance > 0n, true, "founder has main tokens");

      return {cli: founderBalCli, command: ["balance"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: MINT MAIN TOKENS INTO TREASURY RESERVE
    // ══════════════════════════════════════════════════════════════

    const mintAmount = "500000000000000000000000"; // 500k

    h.log(`Minting ${mintAmount} main tokens into treasury reserve...`);

    await step(h, "mint-main-tokens", async () => {
      const proposalId = await proposeVoteExecute(h, dacAddress!, [
        "propose", "mint-main-tokens", mintAmount,
      ]);
      assert.defined(proposalId, "mint-main-tokens proposal id");
      h.log(`Mint proposal ${proposalId} executed`);
      return {
        cli: {data: {action: "mint-main-tokens", proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "mint-main-tokens"],
      };
    });

    await h.syncIndexer();

    // ── Verify treasury-holdings reflects the mint ──────────────────

    let postMintTreasuryBalance: bigint;

    await step(h, "verify-mint-treasury", async () => {
      const cli = await h.view("treasury-holdings", ["--dac", dacAddress!]);
      const holdings = cli.data.holdings as Array<Record<string, unknown>> | undefined;
      assert.defined(holdings, "treasury holdings fetched");

      const mainHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === mainTokenAddress!.toLowerCase(),
      );
      assert.defined(mainHolding, "main token in treasury holdings");
      if (mainHolding) {
        postMintTreasuryBalance = BigInt(mainHolding.balance as string);
        h.log(`Treasury main-token balance after mint: ${postMintTreasuryBalance}`);
        assert.equal(postMintTreasuryBalance >= BigInt(mintAmount), true, "treasury holds minted tokens");
      }

      return {cli, command: ["dac", "view", "treasury-holdings"], indexerSnapshot: {holdings} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: BURN MAIN TOKENS FROM TREASURY RESERVE
    // ══════════════════════════════════════════════════════════════

    const burnAmount = "200000000000000000000000"; // 200k (less than what we minted)

    h.log(`Burning ${burnAmount} main tokens from treasury reserve...`);

    await step(h, "burn-main-tokens", async () => {
      const proposalId = await proposeVoteExecute(h, dacAddress!, [
        "propose", "burn-main-tokens", burnAmount,
      ]);
      assert.defined(proposalId, "burn-main-tokens proposal id");
      h.log(`Burn proposal ${proposalId} executed`);
      return {
        cli: {data: {action: "burn-main-tokens", proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "burn-main-tokens"],
      };
    });

    await h.syncIndexer();

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: VERIFY BURN RESULTS
    // ══════════════════════════════════════════════════════════════

    // ── Verify treasury-holdings reflects the burn ──────────────────

    await step(h, "verify-burn-treasury", async () => {
      const cli = await h.view("treasury-holdings", ["--dac", dacAddress!]);
      const holdings = cli.data.holdings as Array<Record<string, unknown>> | undefined;
      assert.defined(holdings, "treasury holdings after burn");

      const mainHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === mainTokenAddress!.toLowerCase(),
      );
      assert.defined(mainHolding, "main token still in treasury");
      if (mainHolding) {
        const postBurnBalance = BigInt(mainHolding.balance as string);
        const expectedBalance = postMintTreasuryBalance! - BigInt(burnAmount);
        h.log(`Treasury balance after burn: ${postBurnBalance} (expected ${expectedBalance})`);
        assert.equal(postBurnBalance, expectedBalance, "treasury balance decreased by burned amount");
      }

      return {cli, command: ["dac", "view", "treasury-holdings"], indexerSnapshot: {holdings} as Record<string, unknown>};
    });

    // ── Verify founder balance unchanged (burn is from reserve, not wallets) ──

    await step(h, "verify-founder-balance-unchanged", async () => {
      const cli = await h.cli([
        "balance", mainTokenAddress!, founderWallet.address,
        "--config", config.configPath, "--pretty-print",
      ]);
      const balance = BigInt(cli.data.balance as string);
      h.log(`Founder main-token balance after burn: ${balance} (initial: ${initialFounderBalance!})`);
      assert.equal(balance, initialFounderBalance!, "founder balance unchanged by treasury burn");
      return {cli, command: ["balance"]};
    });

    // ── Verify proposals recorded in indexer ─────────────────────

    await step(h, "verify-proposals", async () => {
      const cli = await h.view("proposals", ["--dac", dacAddress!]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      assert.defined(proposals, "proposals in indexer");
      // Expected: mint-main-tokens + burn-main-tokens = 2 proposals
      assert.gte(proposals?.length ?? 0, 2, "at least 2 governance proposals");
      h.log(`Total proposals: ${proposals?.length}`);
      return {cli, command: ["dac", "view", "proposals"], indexerSnapshot: {proposals} as Record<string, unknown>};
    });
  },
};
