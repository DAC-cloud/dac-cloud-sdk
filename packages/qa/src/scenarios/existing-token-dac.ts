import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {FALLBACK_WARMUP_BLOCKS, mintMockToken, passFallbackWarmup, readErc20Balance, readVotes, sameAddress, transferErc20} from "./fixtures/index.js";

/**
 * Scenario: Existing-Token DAC Full Lifecycle
 *
 * Covers:
 * 1. Deploy governance oracle
 * 2. Create existing-token DAC (with treasury seed, auto-delegate)
 * 3. Verify DAC in indexer
 * 4. Wrap additional tokens
 * 5. Create mint-agent-tokens proposal
 * 6. Vote on proposal (hybrid fallback path since no oracle publisher set up)
 * 9. Unwrap: self-unwrap, unwrap to a third party, over-unwrap rejected, voting power follows
 * 10. Third-party wrapTo does not auto-delegate the recipient
 * 11. recover-erc20 (permissionless) credits stray DACCell tokens to the treasury
 * 7. Execute proposal
 * 8. Verify final state in indexer
 */
export const existingTokenDacScenario: Scenario = {
  name: "existing-token-dac-lifecycle",
  description: "Create existing-token DAC (fallback-only) → wrap → propose → vote → execute",
  tags: ["dac", "existing-token", "hybrid", "lifecycle"],

  async run(h: Harness) {
    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    if (!founderWallet) throw new Error("founder wallet required");

    // Track addresses across steps
    let dacAddress: string;
    let mainTokenAddress: string;
    let agentTokenAddress: string;
    let wrappedMainTokenAddress: string;

    // ── Step 1: Create existing-token DAC (fallback-only) ────────

    const underlyingToken = resolveUnderlyingToken(h);

    // Mint underlying tokens for the founder — required for treasury-seed-amount
    await mintMockToken(h, {token: underlyingToken, to: founderWallet.address, amount: "10000000000000000000000"}); // 10k

    await step(h, "create-existing-token-dac", async () => {
      const args = [
        "create-existing-token",
        "--name", "QA Existing Token DAC",
        "--description", "E2E QA test DAC for existing token mode",
        "--symbol", "QADAC",
        "--underlying-token", underlyingToken,
        "--treasury-seed-amount", "1000000000000000000000",  // 1000 tokens
        "--quorum-percent", "50",
        "--blocking-percent", "25",
        "--high-quorum-percent", "75",
        "--voting-duration", "3600",
        "--qualification", "0",
        "--execution-validity-duration", "86400",
        "--oracle-publish-deadline", "600",
        "--fallback-warmup-blocks", String(FALLBACK_WARMUP_BLOCKS),
        "--fallback-duration", "3600",
        "--auto-delegate",
        "--auto-approve",
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);

      dacAddress = cli.data.dac as string;
      mainTokenAddress = (cli.data.mainToken ?? cli.data.wrappedMainToken) as string;
      agentTokenAddress = cli.data.agentToken as string;
      wrappedMainTokenAddress = (cli.data.wrappedMainToken ?? cli.data.mainToken) as string;

      assert.equal(cli.data.action, "dac.create.existing-token", "correct action");
      assert.isAddress(dacAddress, "DAC address valid");
      assert.isAddress(agentTokenAddress, "agent token address valid");
      assert.defined(cli.data.txHash, "tx hash present");

      return {cli, command: ["dac", ...args]};
    });

    // ── Step 3: Verify DAC in indexer ─────────────────────────────

    await h.syncIndexer();

    await step(h, "verify-dac-in-indexer", async () => {
      const args = ["view", "dac", "--dac", dacAddress!, "--config", config.configPath, "--pretty-print"];
      const cli = await h.view("dac", ["--dac", dacAddress!]);

      const dac = cli.data.dac as Record<string, unknown> | undefined;
      assert.defined(dac, "DAC found in indexer");

      if (dac) {
        assert.equal(
          (dac.address as string)?.toLowerCase(),
          dacAddress!.toLowerCase(),
          "indexer DAC address matches",
        );
        assert.equal(dac.name, "QA Existing Token DAC", "indexer DAC name matches");
        assert.equal(dac.mode, "EXISTING_TOKEN", "indexer DAC mode is EXISTING_TOKEN");
        assert.defined(dac.agentTokenAddress, "agent token in indexer");
        assert.defined(dac.wrappedMainTokenAddress, "wrapped main token in indexer");
        assert.defined(dac.governanceSchemaAddress, "governance schema in indexer");
      }

      return {cli, command: ["dac", ...args], indexerSnapshot: dac as Record<string, unknown>};
    });

    // ── Step 4: Wrap additional tokens ────────────────────────────

    await step(h, "wrap-tokens", async () => {
      const args = [
        "wrap",
        "--amount", "500000000000000000000",  // 500 tokens
        "--dac", dacAddress!,
        "--auto-approve",
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);

      assert.defined(cli.data.txHash, "wrap tx hash present");

      return {cli, command: ["dac", ...args]};
    });

    // ── Step 5: Create mint-agent-tokens proposal ─────────────────

    await h.syncIndexer();

    let proposalId: string;

    await step(h, "propose-mint-agent-tokens", async () => {
      const mintAmount = "100000000000000000000000";  // 100000 tokens
      const args = [
        "propose", "mint-agent-tokens", mintAmount, founderWallet.address,
        "--dac", dacAddress!,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);

      proposalId = String(cli.data.proposalId ?? cli.data.id ?? "1");
      assert.defined(cli.data.txHash, "propose tx hash present");

      return {cli, command: ["dac", ...args]};
    });

    // ── Step 6: Advance time past fallback warmup + vote ──────────

    if (config.isLocalChain) {
      // On hybrid, we need fallback path if no oracle snapshot is published.
      // Warmup is FALLBACK_WARMUP_BLOCKS blocks, then fallback voting opens.

      // In the contracts level, the first vote will attempt phase transition to accept vote, we're testing here this path

      await h.syncIndexer();

      // Mine past the fallback warmup (a block count, not a duration)
      await h.advanceTime(15);
      await passFallbackWarmup(h);

      // Now vote via wrapped tokens (fallback path)
      await step(h, "vote-fallback-wrapped", async () => {
        const args = [
          "proposal", "vote-merkle", proposalId!, "true", "0", "0", "0x",
          "--dac", dacAddress!,
          "--config", config.configPath,
          "--pretty-print",
        ];
        // Actually for fallback wrapped voting we use voteWrapped, not voteMerkle
        // Let's use the regular vote command which should work for fallback
        const voteArgs = [
          "vote", "proposal", proposalId!, "true",
          "--dac", dacAddress!,
          "--config", config.configPath,
          "--pretty-print",
        ];
        const cli = await h.cli(voteArgs);
        assert.defined(cli.data.txHash, "vote tx hash present");
        return {cli, command: ["dac", ...voteArgs]};
      });

      // Advance past voting duration (3600s)
      await h.advanceTime(3700);
    } else {
      // On testnet, we need to wait real time or use a different approach
      h.log("Skipping time-dependent steps on testnet — vote manually or wait for deadlines");
    }

    // ── Step 7: Execute proposal ──────────────────────────────────

    if (config.isLocalChain) {
      await step(h, "execute-proposal", async () => {
        const args = [
          "execute", proposalId!,
          "--dac", dacAddress!,
          "--config", config.configPath,
          "--pretty-print",
        ];
        const cli = await h.cli(args);
        assert.defined(cli.data.txHash, "execute tx hash present");
        return {cli, command: ["dac", ...args]};
      });
    }

    // ── Step 8: Verify final state in indexer ─────────────────────

    await h.syncIndexer();

    await step(h, "verify-final-dac-state", async () => {
      const cli = await h.view("dac", ["--dac", dacAddress!]);
      const dac = cli.data.dac as Record<string, unknown> | undefined;
      assert.defined(dac, "DAC still in indexer");

      if (dac && config.isLocalChain) {
        // After executing mint-agent-tokens, proposal count should be >= 1
        const proposalCount = Number(dac.proposalCount ?? 0);
        assert.gte(proposalCount, 1, "at least 1 proposal in DAC");
      }

      return {cli, command: ["dac", "view", "dac"], indexerSnapshot: dac as Record<string, unknown>};
    });

    // ── Step 9: Unwrap ────────────────────────────────────────────
    // Founder holds 500 wrapped (self-delegated). Unwrap burns wrapped and pays
    // the underlying to the caller (or a recipient), and voting power follows.

    const thirdParty = config.wallets.agent3;
    if (config.isLocalChain && thirdParty) {
      const wrapped = wrappedMainTokenAddress!;
      const unwrapSelf = "200000000000000000000";   // 200
      const unwrapToOther = "100000000000000000000"; // 100

      await step(h, "unwrap-self", async () => {
        const wrappedBefore = await readErc20Balance(h, wrapped, founderWallet.address);
        const underlyingBefore = await readErc20Balance(h, underlyingToken, founderWallet.address);
        const votesBefore = await readVotes(h, wrapped, founderWallet.address);

        const cli = await h.cli([
          "unwrap", "--amount", unwrapSelf,
          "--dac", dacAddress!,
          "--config", config.configPath, "--pretty-print",
        ]);
        assert.defined(cli.data.txHash, "unwrap tx hash present");

        const wrappedAfter = await readErc20Balance(h, wrapped, founderWallet.address);
        const underlyingAfter = await readErc20Balance(h, underlyingToken, founderWallet.address);
        const votesAfter = await readVotes(h, wrapped, founderWallet.address);
        assert.equal((wrappedBefore - wrappedAfter).toString(), unwrapSelf, "wrapped balance burned by unwrap amount");
        assert.equal((underlyingAfter - underlyingBefore).toString(), unwrapSelf, "underlying returned 1:1 to the caller");
        assert.equal((votesBefore - votesAfter).toString(), unwrapSelf, "voting power drops with the unwrapped amount");
        return {cli, command: ["dac", "unwrap"]};
      });

      await step(h, "unwrap-to-third-party", async () => {
        const underlyingBefore = await readErc20Balance(h, underlyingToken, thirdParty.address);
        const cli = await h.cli([
          "unwrap", "--amount", unwrapToOther, "--recipient", thirdParty.address,
          "--dac", dacAddress!,
          "--config", config.configPath, "--pretty-print",
        ]);
        assert.defined(cli.data.txHash, "unwrapTo tx hash present");
        assert.truthy(sameAddress(cli.data.recipient, thirdParty.address), "CLI reports the recipient");
        const underlyingAfter = await readErc20Balance(h, underlyingToken, thirdParty.address);
        assert.equal((underlyingAfter - underlyingBefore).toString(), unwrapToOther, "recipient received the underlying");
        return {cli, command: ["dac", "unwrap", "--recipient"]};
      });

      await step(h, "unwrap-over-balance-rejected", async () => {
        const balance = await readErc20Balance(h, wrapped, founderWallet.address);
        const cli = await h.cli([
          "unwrap", "--amount", (balance + 1n).toString(),
          "--dac", dacAddress!,
          "--config", config.configPath, "--pretty-print",
        ], {allowFailure: true});
        assert.notEqual(cli.exitCode, 0, "unwrapping more than the wrapped balance is rejected");
        return {cli, command: ["dac", "unwrap", "(over balance)"]};
      });

      // ── Step 10: third-party wrapTo does not auto-delegate ─────────
      // Only self-wraps auto-delegate; a recipient must delegate on their own,
      // otherwise anyone could pre-set delegation on custody contracts.
      await step(h, "wrap-to-third-party-no-auto-delegate", async () => {
        const wrapTo = "50000000000000000000"; // 50
        const cli = await h.cli([
          "wrap", "--amount", wrapTo, "--recipient", thirdParty.address,
          "--dac", dacAddress!, "--auto-approve",
          "--config", config.configPath, "--pretty-print",
        ]);
        assert.defined(cli.data.txHash, "wrapTo tx hash present");
        assert.equal((await readErc20Balance(h, wrapped, thirdParty.address)).toString(), wrapTo, "recipient holds the wrapped tokens");
        assert.equal((await readVotes(h, wrapped, thirdParty.address)).toString(), "0", "third-party wrapTo leaves the recipient undelegated");

        await h.cliAs("agent3", [
          "delegate", "--delegatee", thirdParty.address, "--dac", dacAddress!,
          "--config", config.configPath, "--pretty-print",
        ]);
        assert.equal((await readVotes(h, wrapped, thirdParty.address)).toString(), wrapTo, "explicit delegation activates the voting power");
        return {cli, command: ["dac", "wrap", "--recipient"]};
      });

      await h.syncIndexer();

      await step(h, "verify-wrapper-actions-indexed", async () => {
        const cli = await h.view("wrapper-actions", ["--dac", dacAddress!, "--limit", "50"]);
        const actions = (cli.data.wrapperActions as Array<Record<string, unknown>> | undefined) ?? [];
        const unwraps = actions.filter((entry) => entry.actionType === "UNWRAPPED");
        assert.gte(unwraps.length, 2, "two UNWRAPPED actions indexed");
        assert.truthy(
          unwraps.some((entry) => sameAddress(entry.recipient, thirdParty.address) && String(entry.amount) === unwrapToOther),
          "unwrapTo recipient and amount indexed",
        );
        assert.truthy(
          actions.some((entry) => entry.actionType === "WRAPPED" && sameAddress(entry.recipient, thirdParty.address)),
          "third-party wrap indexed with its recipient",
        );
        return {cli, command: ["dac", "view", "wrapper-actions"], indexerSnapshot: {actions} as Record<string, unknown>};
      });

      // ── Step 11: recover-erc20 ─────────────────────────────────────
      // Tokens sent straight to the DACCell are credited to the treasury by anyone.
      await step(h, "recover-erc20", async () => {
        const stray = "70000000000000000000"; // 70 underlying
        await transferErc20(h, {token: underlyingToken, from: founderWallet.address, to: dacAddress!, amount: stray});

        const holdingsBefore = await h.view("treasury-holdings", ["--dac", dacAddress!]);
        const before = ((holdingsBefore.data.holdings as Array<Record<string, unknown>> | undefined) ?? [])
          .find((entry) => sameAddress(entry.tokenAddress, underlyingToken));
        const balanceBefore = BigInt(String(before?.balance ?? "0"));

        // agent3 holds no DAC token: recoverERC20 is permissionless.
        const cli = await h.cliAs("agent3", [
          "recover-erc20", "--token", underlyingToken, "--dac", dacAddress!,
          "--config", config.configPath, "--pretty-print",
        ]);
        assert.defined(cli.data.txHash, "recover-erc20 tx hash present");

        await h.syncIndexer();
        const holdingsAfter = await h.view("treasury-holdings", ["--dac", dacAddress!]);
        const after = ((holdingsAfter.data.holdings as Array<Record<string, unknown>> | undefined) ?? [])
          .find((entry) => sameAddress(entry.tokenAddress, underlyingToken));
        assert.equal((BigInt(String(after?.balance ?? "0")) - balanceBefore).toString(), stray, "treasury holding credited with the recovered amount");

        const again = await h.cliAs("agent3", [
          "recover-erc20", "--token", underlyingToken, "--dac", dacAddress!,
          "--config", config.configPath, "--pretty-print",
        ], {allowFailure: true});
        assert.notEqual(again.exitCode, 0, "nothing left to recover is rejected");
        assert.includes(String(again.data.error ?? again.stdout), "NotEnoughBalance", "reverts NotEnoughBalance");
        return {cli, command: ["dac", "recover-erc20"], indexerSnapshot: after};
      });
    }

    await step(h, "verify-proposals-in-indexer", async () => {
      const cli = await h.view("proposals", ["--dac", dacAddress!]);
      const proposals = cli.data.proposals as Array<Record<string, unknown>> | undefined;
      assert.defined(proposals, "proposals found in indexer");

      if (proposals && proposals.length > 0 && config.isLocalChain) {
        const lastProposal = proposals[proposals.length - 1];
        assert.equal(lastProposal.resolved, true, "proposal is resolved");
        assert.equal(lastProposal.passed, true, "proposal passed");
        assert.equal(lastProposal.executed, true, "proposal is executed");
      }

      return {
        cli,
        command: ["dac", "view", "proposals"],
        indexerSnapshot: {proposals} as Record<string, unknown>,
      };
    });
  },
};

/**
 * Find an underlying ERC20 token address for testing.
 * On testnet: use a known stablecoin (USDC, EURC).
 * On local chain: use the well-known mock token address.
 */
function resolveUnderlyingToken(h: Harness): string {
  if (h.config.chainId === 84532) {
    // Base Sepolia USDC
    return "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  }

  // Mock token of the local deployment (DAC_TREASURY_TOKEN in .env)
  return h.config.tokens.treasury;
}
