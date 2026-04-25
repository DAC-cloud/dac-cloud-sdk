import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {mintMockToken} from "./fixtures/index.js";

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
 * 7. Execute proposal
 * 8. Verify final state in indexer
 */
export const existingTokenDacScenario: Scenario = {
  name: "existing-token-dac-lifecycle",
  description: "Deploy oracle → create existing-token DAC → wrap → propose → vote → execute",
  tags: ["dac", "existing-token", "hybrid", "lifecycle"],

  async run(h: Harness) {
    const {assert, config} = h;
    const founderWallet = config.wallets.founder;
    if (!founderWallet) throw new Error("founder wallet required");

    // Track addresses across steps
    let oracleAddress: string;
    let dacAddress: string;
    let mainTokenAddress: string;
    let agentTokenAddress: string;
    let wrappedMainTokenAddress: string;

    // ── Step 1: Deploy governance oracle ──────────────────────────

    await step(h, "deploy-governance-oracle", async () => {
      const args = [
        "oracle", "deploy", founderWallet.address,
        "--config", config.configPath,
        "--pretty-print",
      ];
      const cli = await h.cli(args);

      oracleAddress = cli.data.oracleAddress as string;
      assert.isAddress(oracleAddress, "oracle address is valid");
      assert.equal(cli.data.action, "dac.oracle.deploy", "correct action");

      return {cli, command: ["dac", ...args]};
    });

    // ── Step 2: Create existing-token DAC ─────────────────────────

    // We need a mock ERC20 on local chain. On Hardhat, the deploy scripts
    // should have deployed a test token. We'll look it up or skip if not available.
    // For now, use the underlying token from the contracts deploy manifest.
    const underlyingToken = await resolveUnderlyingToken(h);

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
        "--fallback-warmup-duration", "10",
        "--fallback-duration", "3600",
        "--governance-oracle", oracleAddress!,
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
      // Warmup: 10s, then activate fallback voting, then vote.

      // In the contracts level, the first vote will attempt phase transition to accept vote, we're testing here this path

      // Advance past fallback warmup duration (10s)
      await h.advanceTime(15);

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
 * On local chain: use the mock token from the contracts deploy.
 * On testnet: use a known stablecoin (USDC, EURC).
 */
async function resolveUnderlyingToken(h: Harness): Promise<string> {
  // Check if there's a known test token in the manifest/deploy output
  // For local Hardhat, the seed scripts deploy mock tokens.
  // We'll try to read from the contracts deploy artifacts.
  const contractsRoot = h.config.contractsRoot;
  if (contractsRoot) {
    try {
      const {readFileSync} = await import("node:fs");
      const broadcastDir = `${contractsRoot}/broadcast`;
      // Look for the mock token in the latest deploy
      const {readdirSync} = await import("node:fs");
      // Try common locations
      const mockTokenPaths = [
        `${contractsRoot}/deployments/localhost/MockERC20.json`,
        `${contractsRoot}/deployments/31337/MockERC20.json`,
      ];
      for (const p of mockTokenPaths) {
        try {
          const data = JSON.parse(readFileSync(p, "utf-8"));
          if (data.address) return data.address;
        } catch {
          // continue
        }
      }
    } catch {
      // Fall through
    }
  }

  // Fallback: well-known test tokens
  if (h.config.chainId === 84532) {
    // Base Sepolia USDC
    return "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  }

  // MockERC20
  return "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";
}
