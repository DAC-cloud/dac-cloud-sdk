import type {Harness, Scenario} from "../harness/types.js";
import {mintMockToken, resolveUnderlyingToken} from "./fixtures/common.js";
import {setupNativeDacWithDeal} from "./fixtures/setup-native-dac-deal.js";

/**
 * Exercises every dry-run command whose output is a multi-tx `transactions: [...]`
 * array. These are the CLI paths most likely to silently mis-wire because the
 * caller must broadcast all txs in order:
 *
 *   - dac.deposit-treasury (transfer + recoverTreasury)
 *   - dac.create.existing-token --auto-approve (approve + deployExistingTokenDac)
 *   - deal.stake --auto-delegate (stake + delegateVotes)
 */
export const dryRunMultiTxScenario: Scenario = {
  name: "dry-run-multi-tx",
  description:
    "Multi-tx --dry-run outputs (deposit-treasury, create-existing-token --auto-approve, deal.stake --auto-delegate) "
    + "broadcast end-to-end and verified against indexer state",
  tags: ["dry-run", "multi-tx"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain (mintable mock token + EVM time). Skipping.");
      return;
    }

    const {assert, config} = h;
    const founder = config.wallets.founder;
    if (!founder) throw new Error("founder wallet required");
    const underlying = resolveUnderlyingToken(h);

    // ╔══════════════════════════════════════════════════════════════╗
    // ║ Part A: dac.create.existing-token --auto-approve (2 txs)     ║
    // ╚══════════════════════════════════════════════════════════════╝

    h.log("Part A: existing-token DAC create with --auto-approve");

    const seedAmount = "1000000000000000000000"; // 1k underlying
    await mintMockToken(h, {token: underlying, to: founder.address, amount: seedAmount});

    const dacsBeforeA = await h.view("dacs", []);
    const beforeAddrsA = new Set(
      ((dacsBeforeA.data.dacs as Array<Record<string, unknown>> | undefined) ?? [])
        .map((d) => String(d.address).toLowerCase()),
    );

    const createResult = await h.submitDryRun("founder", [
      "create-existing-token",
      "--name", "Dry-Run Existing-Token DAC",
      "--description", "QA dry-run for multi-tx existing-token create",
      "--symbol", "DRYX",
      "--underlying-token", underlying,
      "--treasury-seed-amount", seedAmount,
      "--auto-approve",
    ]);

    const createTxs = createResult.cliData.transactions as Array<Record<string, unknown>> | undefined;
    assert.defined(createTxs, "transactions array in dry-run output");
    assert.equal(createTxs?.length, 2, "create-existing-token --auto-approve emits 2 txs");
    assert.equal(createResult.receipts.length, 2, "both txs broadcast successfully");

    await h.syncIndexer();

    const dacsAfterA = await h.view("dacs", []);
    const dacsListA = (dacsAfterA.data.dacs as Array<Record<string, unknown>>) ?? [];
    const newExistingDac = dacsListA.find((d) => !beforeAddrsA.has(String(d.address).toLowerCase()));
    assert.defined(newExistingDac, "new existing-token DAC indexed");
    if (newExistingDac) {
      assert.equal(newExistingDac.mode, "EXISTING_TOKEN", "DAC mode is EXISTING_TOKEN");
      assert.equal(
        String(newExistingDac.underlyingTokenAddress).toLowerCase(),
        underlying.toLowerCase(),
        "underlying token matches",
      );
      h.log(`Existing-token DAC: ${newExistingDac.address}`);
    }

    // ╔══════════════════════════════════════════════════════════════╗
    // ║ Part B + C setup: native DAC with a pending deal             ║
    // ╚══════════════════════════════════════════════════════════════╝
    // We use the existing fixture (direct-CLI path) to bootstrap a DAC with a
    // deal in *pending* (skipApproval=true) state. After this, the founder
    // still holds (mintAmount - stakeAmount) agent tokens, which we then stake
    // again via dry-run with --auto-delegate to exercise the 2-tx output.

    h.log("Bootstrapping native DAC + pending deal (direct-CLI fixture)…");
    const ctx = await setupNativeDacWithDeal(h, {
      dacName: "Dry-Run Multi-Tx Host DAC",
      dealName: "Dry-Run Multi-Tx Deal",
      skipApproval: true,
      agentMintAmount: "100000000000000000000000", // 100k
      stakeAmount: "10000000000000000000000",       // 10k staked → 90k left
    });

    // ╔══════════════════════════════════════════════════════════════╗
    // ║ Part B: dac.deposit-treasury (2 txs)                          ║
    // ╚══════════════════════════════════════════════════════════════╝

    h.log("Part B: deposit-treasury (transfer + recoverTreasury)");

    const depositAmount = "500000000000000000000"; // 500 of underlying
    await mintMockToken(h, {token: ctx.treasuryToken, to: founder.address, amount: depositAmount});

    const holdingsBefore = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
    const holdingRowsBefore = (holdingsBefore.data.holdings as Array<Record<string, unknown>>) ?? [];
    const beforeRow = holdingRowsBefore.find(
      (r) => String(r.tokenAddress).toLowerCase() === ctx.treasuryToken.toLowerCase(),
    );
    const beforeAmount = BigInt(String(beforeRow?.balance ?? "0"));

    const depositResult = await h.submitDryRun("founder", [
      "deposit-treasury",
      "--amount", depositAmount,
      "--token", ctx.treasuryToken,
      "--dac", ctx.dacAddress,
    ]);

    const depositTxs = depositResult.cliData.transactions as Array<Record<string, unknown>> | undefined;
    assert.defined(depositTxs, "deposit-treasury dry-run outputs transactions array");
    assert.equal(depositTxs?.length, 2, "deposit-treasury emits 2 txs");
    assert.equal(depositResult.receipts.length, 2, "both deposit txs succeeded");

    await h.syncIndexer();

    const holdingsAfter = await h.view("treasury-holdings", ["--dac", ctx.dacAddress]);
    const holdingRowsAfter = (holdingsAfter.data.holdings as Array<Record<string, unknown>>) ?? [];
    const afterRow = holdingRowsAfter.find(
      (r) => String(r.tokenAddress).toLowerCase() === ctx.treasuryToken.toLowerCase(),
    );
    const afterAmount = BigInt(String(afterRow?.balance ?? "0"));
    assert.equal(
      (afterAmount - beforeAmount).toString(),
      depositAmount,
      "treasury holdings grew by exactly the deposit amount",
    );

    // ╔══════════════════════════════════════════════════════════════╗
    // ║ Part C: deal.stake --auto-delegate (2 txs)                    ║
    // ╚══════════════════════════════════════════════════════════════╝

    h.log("Part C: deal.stake --auto-delegate");

    const dealBefore = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
    const stakedBefore = BigInt(String((dealBefore.data.deal as Record<string, unknown>).currentStakedAmount));

    const additionalStake = "5000000000000000000000"; // 5k more
    const stakeResult = await h.submitDryRun("founder", [
      "deal", "stake", additionalStake,
      "--deal-address", ctx.dealCell,
      "--dac", ctx.dacAddress,
      "--auto-delegate",
    ]);

    const stakeTxs = stakeResult.cliData.transactions as Array<Record<string, unknown>> | undefined;
    assert.defined(stakeTxs, "deal.stake dry-run outputs transactions array");
    assert.equal(stakeTxs?.length, 2, "deal.stake --auto-delegate emits 2 txs");
    assert.equal(stakeResult.receipts.length, 2, "both stake txs succeeded");

    await h.syncIndexer();

    const dealAfter = await h.dealView("deal", ["--deal-address", ctx.dealAddress]);
    const stakedAfter = BigInt(String((dealAfter.data.deal as Record<string, unknown>).currentStakedAmount));
    assert.equal(
      (stakedAfter - stakedBefore).toString(),
      additionalStake,
      "deal staked amount grew by exactly the additional stake",
    );

    h.log("All multi-tx dry-run paths verified.");
  },
};
