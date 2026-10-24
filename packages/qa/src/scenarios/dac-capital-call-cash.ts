import {createPublicClient, erc20Abi, http, type Address} from "viem";
import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {mintMockToken, proposeVoteExecute, resolveUnderlyingToken} from "./fixtures/index.js";

/**
 * Scenario: Capital Call with Cash (EOA recipient via `dac join`)
 *
 * Regression for the 0.2.0 `dac join --auto-approve` defect: the CLI approved the
 * DACCell as spender, but both asset controllers pull the cash leg with
 * `safeTransferFrom(recipient, controller, cash)`, so the allowance was never
 * consumed and any cash-bearing capital call reverted when fulfilled via the CLI.
 *
 * Every other scenario that runs `dac join` fulfils the founder's bootstrap call,
 * which carries zero cash, and the cash-bearing calls elsewhere target a DACDeal
 * contract that approves the controller from inside Solidity. This scenario is the
 * only coverage of the documented EOA path with a nonzero cash amount.
 *
 * Flow:
 *   1. Founder creates a native DAC and claims the bootstrap allocation
 *   2. Mint treasury token (sUSD) to agent1, who starts with no main tokens
 *   3. Governance issues a capital call to agent1: tokenAmount for cashAmount
 *   4. agent1 runs `dac join --auto-approve` with all fields auto-resolved
 *   5. Verify: approval targeted the AssetController (not the cell) and was consumed
 *      exactly, agent1 paid the cash and received the tokens, treasury credited,
 *      indexer marks the call fulfilled
 */
export const dacCapitalCallCashScenario: Scenario = {
  name: "dac-capital-call-cash",
  description: "Capital call with nonzero cash to an EOA → `dac join --auto-approve` → verify controller allowance + balances",
  tags: ["dac", "capital-call", "join", "treasury", "regression"],

  async run(h: Harness) {
    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    const investorWallet = config.wallets.agent1;
    if (!founderWallet) throw new Error("founder wallet required");
    if (!investorWallet) throw new Error("agent1 wallet required (used as capital-call recipient)");
    if (!config.isLocalChain) {
      h.log("Skipping: requires local chain (mock token mint)");
      return;
    }

    const treasuryToken = resolveUnderlyingToken(h) as Address;
    const investor = investorWallet.address as Address;
    const publicClient = createPublicClient({transport: http(config.localRpcUrl)});

    const readAllowance = (owner: Address, spender: Address) =>
      publicClient.readContract({address: treasuryToken, abi: erc20Abi, functionName: "allowance", args: [owner, spender]});
    const readBalance = (token: Address, holder: Address) =>
      publicClient.readContract({address: token, abi: erc20Abi, functionName: "balanceOf", args: [holder]});

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: CREATE DAC + BOOTSTRAP JOIN (zero-cash path, already covered elsewhere)
    // ══════════════════════════════════════════════════════════════

    const founderAllocation = "1000000000000000000000000"; // 1M

    let dacAddress: string;
    let mainTokenAddress: Address;

    await step(h, "create-dac", async () => {
      const cli = await h.cli([
        "create",
        "--name", "Capital Call Cash QA DAC",
        "--description", "QA capital call with cash via dac join",
        "--symbol", "QCCC",
        "--max-supply", "10000000000000000000000000", // 10M
        "--default-quorum", "50",
        "--allocation", founderAllocation,
        "--treasury-token", treasuryToken,
        "--commitment", "0",
        "--auto-delegate",
        "--config", config.configPath, "--pretty-print",
      ]);
      dacAddress = cli.data.dac as string;
      mainTokenAddress = cli.data.mainToken as Address;
      assert.isAddress(dacAddress, "DAC deployed");
      assert.isAddress(mainTokenAddress, "main token deployed");
      return {cli, command: ["dac", "create"]};
    });

    await h.syncIndexer();

    await h.cli([
      "join", "--dac", dacAddress!, "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.cli([
      "delegate", "--delegatee", founderWallet.address, "--dac", dacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    let assetControllerAddress: Address;

    await step(h, "resolve-asset-controller", async () => {
      const cli = await h.view("dac", ["--dac", dacAddress!]);
      const dacRecord = cli.data.dac as Record<string, unknown>;
      assetControllerAddress = dacRecord.assetControllerAddress as Address;
      assert.isAddress(assetControllerAddress, "asset controller address from indexer");
      assert.equal(
        assetControllerAddress.toLowerCase() !== dacAddress!.toLowerCase(),
        true,
        "asset controller is a distinct contract from the DACCell",
      );
      return {cli, command: ["dac", "view", "dac"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: FUND THE INVESTOR WITH TREASURY TOKEN
    // ══════════════════════════════════════════════════════════════

    const tokenAmount = "250000000000000000000000"; // 250k main tokens
    const cashAmount = "2500000000"; // 2,500 sUSD (6 decimals)

    await step(h, "fund-investor", async () => {
      const txHash = await mintMockToken(h, {token: treasuryToken, to: investor, amount: cashAmount});
      const balance = await readBalance(treasuryToken, investor);
      assert.gte(balance, BigInt(cashAmount), "investor holds enough treasury token to cover the cash leg");
      return {
        cli: {data: {action: "mint-mock-token", txHash, balance: balance.toString()}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["mintMockToken"],
      };
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: GOVERNANCE ISSUES THE CAPITAL CALL TO THE INVESTOR EOA
    // ══════════════════════════════════════════════════════════════

    let proposalId: string;

    await step(h, "propose-capital-call", async () => {
      proposalId = await proposeVoteExecute(h, dacAddress!, [
        "propose", "capital-call", investor, treasuryToken, tokenAmount, cashAmount,
      ]);
      assert.defined(proposalId, "capital-call proposal id");
      h.log(`Capital call proposal ${proposalId} executed (nonce == proposal id)`);
      return {
        cli: {data: {action: "capital-call", proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "propose", "capital-call"],
      };
    });

    await h.syncIndexer();

    await step(h, "verify-capital-call-pending", async () => {
      const cli = await h.view("capital-calls", ["--dac", dacAddress!]);
      const calls = cli.data.capitalCalls as Array<Record<string, unknown>> | undefined;
      assert.defined(calls, "capital calls in indexer");
      const pending = calls?.find(
        (c) => (c.recipient as string)?.toLowerCase() === investor.toLowerCase() && String(c.nonce) === proposalId!,
      );
      assert.defined(pending, "capital call for investor indexed");
      if (pending) {
        assert.equal(BigInt(pending.cashAmount as string), BigInt(cashAmount), "indexed cashAmount matches");
        assert.equal(BigInt(pending.tokenAmount as string), BigInt(tokenAmount), "indexed tokenAmount matches");
        assert.equal(BigInt(pending.totalFulfilledCashAmount as string), 0n, "nothing fulfilled yet");
      }
      return {cli, command: ["dac", "view", "capital-calls"], indexerSnapshot: {capitalCalls: calls} as Record<string, unknown>};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: INVESTOR FULFILS VIA `dac join --auto-approve`
    // ══════════════════════════════════════════════════════════════

    let investorCashBefore: bigint;
    let investorMainBefore: bigint;
    let treasuryCashBefore: bigint;

    await step(h, "snapshot-before-join", async () => {
      investorCashBefore = await readBalance(treasuryToken, investor);
      investorMainBefore = await readBalance(mainTokenAddress!, investor);
      treasuryCashBefore = await readBalance(treasuryToken, assetControllerAddress!);
      const cellAllowance = await readAllowance(investor, dacAddress! as Address);
      const controllerAllowance = await readAllowance(investor, assetControllerAddress!);
      assert.equal(cellAllowance, 0n, "no pre-existing allowance to the DACCell");
      assert.equal(controllerAllowance, 0n, "no pre-existing allowance to the AssetController");
      assert.equal(investorMainBefore, 0n, "investor holds no main tokens before fulfilment");
      return {
        cli: {
          data: {
            investorCashBefore: investorCashBefore.toString(),
            treasuryCashBefore: treasuryCashBefore.toString(),
          },
          stdout: "", stderr: "", exitCode: 0, durationMs: 0,
        },
        command: ["balanceOf/allowance"],
      };
    });

    await step(h, "investor-join-with-cash", async () => {
      // Fields are auto-resolved from the indexer, exactly as documented.
      const cli = await h.cliAs("agent1", ["join", "--dac", dacAddress!, "--auto-approve"]);
      assert.equal(cli.exitCode, 0, "dac join succeeded");
      assert.defined(cli.data.txHash, "fulfillCapitalCall tx hash");
      assert.defined(cli.data.approveTx, "auto-approve issued an approval (cash > 0, no prior allowance)");
      const reportedController = cli.data.assetController as string | undefined;
      assert.defined(reportedController, "join reports the spender it approved");
      assert.equal(
        reportedController?.toLowerCase(),
        assetControllerAddress!.toLowerCase(),
        "CLI approved the AssetController, not the DACCell",
      );
      const call = cli.data.call as Record<string, unknown>;
      assert.equal(BigInt(call.cashAmount as string), BigInt(cashAmount), "auto-resolved cashAmount");
      assert.equal(String(call.nonce), proposalId!, "auto-resolved nonce == proposal id");
      return {cli, command: ["dac", "join", "--auto-approve"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 5: VERIFY ON-CHAIN + INDEXER STATE
    // ══════════════════════════════════════════════════════════════

    await step(h, "verify-allowances-consumed", async () => {
      const cellAllowance = await readAllowance(investor, dacAddress! as Address);
      const controllerAllowance = await readAllowance(investor, assetControllerAddress!);
      // The cell must never have been approved; the controller approval was for
      // exactly cashAmount and is fully consumed by safeTransferFrom.
      assert.equal(cellAllowance, 0n, "DACCell allowance still zero (never approved)");
      assert.equal(controllerAllowance, 0n, "AssetController allowance consumed exactly");
      return {
        cli: {data: {cellAllowance: "0", controllerAllowance: "0"}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["allowance"],
      };
    });

    await step(h, "verify-balances", async () => {
      const investorCashAfter = await readBalance(treasuryToken, investor);
      const investorMainAfter = await readBalance(mainTokenAddress!, investor);
      const treasuryCashAfter = await readBalance(treasuryToken, assetControllerAddress!);

      assert.equal(investorCashBefore! - investorCashAfter, BigInt(cashAmount), "investor paid exactly cashAmount");
      assert.equal(investorMainAfter - investorMainBefore!, BigInt(tokenAmount), "investor received exactly tokenAmount");
      assert.equal(treasuryCashAfter - treasuryCashBefore!, BigInt(cashAmount), "AssetController received the cash");

      return {
        cli: {
          data: {
            investorCashAfter: investorCashAfter.toString(),
            investorMainAfter: investorMainAfter.toString(),
            treasuryCashAfter: treasuryCashAfter.toString(),
          },
          stdout: "", stderr: "", exitCode: 0, durationMs: 0,
        },
        command: ["balanceOf"],
      };
    });

    await h.syncIndexer();

    await step(h, "verify-indexer-fulfilled", async () => {
      const cli = await h.view("capital-calls", ["--dac", dacAddress!]);
      const calls = cli.data.capitalCalls as Array<Record<string, unknown>> | undefined;
      const entry = calls?.find(
        (c) => (c.recipient as string)?.toLowerCase() === investor.toLowerCase() && String(c.nonce) === proposalId!,
      );
      assert.defined(entry, "capital call still indexed");
      if (entry) {
        assert.equal(BigInt(entry.totalFulfilledCashAmount as string), BigInt(cashAmount), "indexer: cash fulfilled");
        assert.equal(BigInt(entry.totalFulfilledTokenAmount as string), BigInt(tokenAmount), "indexer: tokens fulfilled");
      }
      return {cli, command: ["dac", "view", "capital-calls"], indexerSnapshot: {capitalCalls: calls} as Record<string, unknown>};
    });

    await step(h, "verify-treasury-holdings", async () => {
      const cli = await h.view("treasury-holdings", ["--dac", dacAddress!]);
      const holdings = cli.data.holdings as Array<Record<string, unknown>> | undefined;
      assert.defined(holdings, "treasury holdings fetched");
      const cashHolding = holdings?.find(
        (ent) => (ent.tokenAddress as string)?.toLowerCase() === treasuryToken.toLowerCase(),
      );
      assert.defined(cashHolding, "treasury token present in holdings");
      if (cashHolding) {
        assert.gte(BigInt(cashHolding.balance as string), BigInt(cashAmount), "treasury holdings credited with the cash leg");
      }
      return {cli, command: ["dac", "view", "treasury-holdings"], indexerSnapshot: {holdings} as Record<string, unknown>};
    });
  },
};
