import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  proposeVoteExecute,
  readErc20Balance,
  readVotes,
  sameAddress,
  setupNativeDacWithDeal,
  setupTbaFixture,
  transferNft,
} from "./fixtures/index.js";

/**
 * Scenario: NFT agent — an ERC-6551 token-bound account operates through the CLI
 *
 * The NFT owner (agent1) signs; the token-bound account is the protocol actor:
 * it receives agent tokens, stakes, delegates, proposes, votes and executes. Both
 * CLI modes are exercised — private-key mode (`--nft` + owner key) and dry-run
 * mode (`--dry-run --from <owner> --nft`, unsigned `execute(...)` txs broadcast by
 * the harness with the owner's key).
 *
 * Flow:
 *   1. Local ERC-6551 infra at canonical addresses, mock collection, token #370 → agent1
 *   2. `tba address` / `tba info` before deployment (ERC-6492-wrapped guest login)
 *   3. `tba create` (PK mode) + a second token via dry-run; signer validity per role
 *   4. DAC mints agent tokens to the account; `auth login --nft`: session wallet is the
 *      account, signer is the owner
 *   5. Invite; stake via --nft with auto-delegate
 *   6. Propose (dry-run) → vote (PK) → execute (dry-run) as the account
 *   7. Non-owner refused; NFT transfer moves control to the new owner; discover as the account
 */
export const tbaAgentLifecycleScenario: Scenario = {
  name: "tba-agent-lifecycle",
  description: "ERC-6551 NFT agent: create account, login, stake/propose/vote/execute via --nft in PK and dry-run modes, ownership transfer",
  tags: ["tba", "erc6551", "nft", "deal", "auth", "dry-run"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain. Skipping.");
      return;
    }

    const {assert, config} = h;
    const owner = config.wallets.agent1;
    const stranger = config.wallets.agent2;
    if (!owner || !stranger) throw new Error("agent1 + agent2 wallets required");

    const agentMint = "20000000000000000000000";  // 20k agent tokens to the account
    const founderStake = "10000000000000000000000";

    // Founder's DAC with an unapproved, whitelist-only deal.
    const ctx = await setupNativeDacWithDeal(h, {
      dacName: "NFT Agent DAC",
      dealName: "Deal with an NFT agent",
      stakeAmount: founderStake,
      skipApproval: true,
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 1: collection, token, account derivation
    // ══════════════════════════════════════════════════════════════

    const tba = await setupTbaFixture(h, {ownerRole: "agent1", tokenId: 370n});
    const nftFlags = ["--nft", tba.nftRef];
    h.log(`Token-bound account for ${tba.nftRef}: ${tba.account}`);

    await step(h, "tba-address", async () => {
      const cli = await h.cli(["tba", "address", ...nftFlags, "--config", config.configPath, "--pretty-print"]);
      assert.truthy(sameAddress(cli.data.account, tba.account), "CLI derives the registry address off-chain");
      return {cli, command: ["tba", "address"]};
    });

    await step(h, "tba-info-before-create", async () => {
      const cli = await h.cliAs("agent1", ["tba", "info", ...nftFlags, "--config", config.configPath, "--pretty-print"]);
      assert.equal(cli.data.deployed, false, "account not deployed yet");
      return {cli, command: ["tba", "info"]};
    });

    // A member session for the account is only possible once it holds DAC tokens,
    // so "write before create" cannot even reach the undeployed-account check through
    // the backend proxy; the check is covered by unit-level guards in the CLI.

    // ══════════════════════════════════════════════════════════════
    // PHASE 2: create the account (PK mode and dry-run mode)
    // ══════════════════════════════════════════════════════════════

    await step(h, "tba-create", async () => {
      const cli = await h.cliAs("agent1", ["tba", "create", ...nftFlags, "--config", config.configPath, "--pretty-print"]);
      assert.truthy(sameAddress(cli.data.account, tba.account), "created account matches the derived address");
      assert.defined(cli.data.txHash, "createAccount tx");

      const info = await h.cliAs("agent1", ["tba", "info", ...nftFlags, "--config", config.configPath, "--pretty-print"]);
      assert.equal(info.data.deployed, true, "account deployed");
      assert.truthy(sameAddress(info.data.owner, owner.address), "account owner is the NFT owner");
      assert.equal(info.data.signerIsValid, true, "owner key is a valid signer");
      const token = info.data.token as Record<string, unknown>;
      assert.equal(String(token.tokenId), "370", "bound token id");
      return {cli, command: ["tba", "create"]};
    });

    await step(h, "tba-create-dry-run", async () => {
      // A second token for the same owner, created through the unsigned-tx path.
      const {mintNft} = await import("./fixtures/tba.js");
      await mintNft(h, {nft: tba.nft, to: owner.address as `0x${string}`, tokenId: 371n});
      // Dry-run carries no key: the owner logs in as the (counterfactual) account first.
      await h.cliAs("agent1", ["auth", "login", "--nft", `${tba.nft}:371`, "--config", config.configPath, "--pretty-print"]);
      const result = await h.submitDryRun("agent1", ["tba", "create", "--nft", `${tba.nft}:371`]);
      assert.equal(result.receipts.length, 1, "one createAccount tx broadcast");
      const info = await h.cliAs("agent1", ["tba", "info", "--nft", `${tba.nft}:371`, "--config", config.configPath, "--pretty-print"]);
      assert.equal(info.data.deployed, true, "dry-run created account deployed");
      return {cli: {data: result.cliData, stdout: "", stderr: "", exitCode: 0, durationMs: 0}, command: ["tba", "create", "--dry-run"]};
    });

    await step(h, "stranger-is-not-a-signer", async () => {
      const info = await h.cliAs("agent2", ["tba", "info", ...nftFlags, "--config", config.configPath, "--pretty-print"]);
      assert.equal(info.data.signerIsValid, false, "non-owner is not a valid signer");

      const cli = await h.cliAs("agent2", [
        "deal", "stake", "1", "--deal-address", ctx.dealCell, "--dac", ctx.dacAddress, ...nftFlags,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(cli.exitCode, 0, "non-owner cannot act through the account");
      // Rejected either at login (account's ERC-1271 refuses the signature) or by the
      // CLI's own control check when a cached session already exists.
      assert.match(String(cli.data.error ?? cli.stdout), /not the NFT owner|not a valid signer/, "clear signer error");
      return {cli: info, command: ["tba", "info", "(stranger)"]};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 4: the account becomes an agent and stakes
    // ══════════════════════════════════════════════════════════════

    await proposeVoteExecute(h, ctx.dacAddress, [
      "propose", "mint-agent-tokens", agentMint, tba.account,
    ]);
    await h.cli([
      "deal", "invite", tba.account, "--deal-address", ctx.dealCell,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // ══════════════════════════════════════════════════════════════
    // PHASE 3: auth as the account (member session needs the account to hold tokens)
    // ══════════════════════════════════════════════════════════════

    await step(h, "auth-login-as-tba", async () => {
      const cli = await h.cliAs("agent1", [
        "auth", "login", "--dac", ctx.dacAddress, ...nftFlags,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.equal(cli.data.ok, true, "login succeeded");
      assert.truthy(sameAddress(cli.data.wallet, tba.account), "session wallet is the token-bound account");
      assert.truthy(sameAddress(cli.data.signer, owner.address), "SIWE signed by the NFT owner");
      return {cli, command: ["auth", "login", "--nft"]};
    });

    let stakeToken: string;
    await step(h, "stake-as-tba", async () => {
      assert.equal((await readErc20Balance(h, ctx.agentTokenAddress, tba.account)).toString(), agentMint, "account holds the minted agent tokens");

      const cli = await h.cliAs("agent1", [
        "deal", "stake", agentMint,
        "--deal-address", ctx.dealCell, "--dac", ctx.dacAddress, "--auto-delegate", ...nftFlags,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.truthy(sameAddress(cli.data.staker, tba.account), "CLI reports the account as the staker");
      assert.defined(cli.data.delegateTx, "auto-delegate executed through the account");

      await h.syncIndexer();
      const posCli = await h.dealView("positions", ["--deal-address", ctx.dealAddress]);
      const positions = posCli.data.positions as Array<Record<string, unknown>>;
      const position = positions.find((entry) => String(entry.accountId).toLowerCase().includes(tba.account.toLowerCase()));
      assert.defined(position, "indexer position for the account");
      assert.equal(String(position?.currentStakedAmount), agentMint, "account stake indexed");

      const deal = (await h.dealView("deal", ["--deal-address", ctx.dealAddress])).data.deal as Record<string, unknown>;
      stakeToken = deal.stakeTokenAddress as string;
      assert.equal((await readVotes(h, stakeToken, tba.account)).toString(), agentMint, "account delegated its stake to itself");
      return {cli, command: ["deal", "stake", "--nft"], indexerSnapshot: position};
    });

    // Approve the deal (founder, DAC side).
    await h.advanceTime(10);
    await h.cli(["vote", "proposal", ctx.dealProposalId, "true", "--dac", ctx.dacAddress, "--config", config.configPath, "--pretty-print"]);
    await h.advanceTime(3700);
    await h.cli(["execute", ctx.dealProposalId, "--dac", ctx.dacAddress, "--config", config.configPath, "--pretty-print"]);
    await h.syncIndexer();

    // ══════════════════════════════════════════════════════════════
    // PHASE 5: deal governance as the account (dry-run + PK)
    // ══════════════════════════════════════════════════════════════

    let proposalId: string;
    await step(h, "propose-as-tba-dry-run", async () => {
      const result = await h.submitDryRun("agent1", [
        "deal", "propose", "toggle-early-returns", "true", "--deal-address", ctx.dealAddress, ...nftFlags,
      ]);
      const tx = (result.cliData.transaction as Record<string, unknown>);
      assert.truthy(sameAddress(tx.to, tba.account), "dry-run tx targets the account (execute wrapper)");
      assert.truthy(sameAddress(tx.from, owner.address), "dry-run tx is signed by the owner");
      assert.equal(result.receipts.length, 1, "wrapped proposal tx broadcast");

      await h.syncIndexer();
      const proposals = (await h.dealView("proposals", ["--deal-address", ctx.dealAddress])).data.proposals as Array<Record<string, unknown>>;
      const latest = proposals.reduce((a, b) => (BigInt(String(a.proposalNumericId)) > BigInt(String(b.proposalNumericId)) ? a : b));
      proposalId = String(latest.proposalNumericId);
      return {cli: {data: result.cliData, stdout: "", stderr: "", exitCode: 0, durationMs: 0}, command: ["deal", "propose", "--dry-run", "--nft"], indexerSnapshot: latest};
    });

    await step(h, "vote-and-execute-as-tba", async () => {
      await h.advanceTime(10);
      // toggle-early-returns is high quorum (75%); the account holds two thirds,
      // so the founder votes too.
      const vote = await h.cliAs("agent1", [
        "deal", "vote", "proposal", proposalId!, "true", "--deal-address", ctx.dealAddress, ...nftFlags,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(vote.data.txHash, "account vote submitted through execute");
      await h.cli([
        "deal", "vote", "proposal", proposalId!, "true", "--deal-address", ctx.dealAddress,
        "--config", config.configPath, "--pretty-print",
      ]);
      await h.advanceTime(60);

      const result = await h.submitDryRun("agent1", [
        "deal", "execute", proposalId!, "--deal-address", ctx.dealAddress, ...nftFlags,
      ]);
      assert.equal(result.receipts.length, 1, "execute tx broadcast through the account");

      await h.syncIndexer();
      const deal = (await h.dealView("deal", ["--deal-address", ctx.dealAddress])).data.deal as Record<string, unknown>;
      assert.equal(deal.earlyReturnsEnabled, true, "proposal executed by the account took effect");
      return {cli: vote, command: ["deal", "vote", "--nft"], indexerSnapshot: deal};
    });

    // ══════════════════════════════════════════════════════════════
    // PHASE 6: ownership transfer moves control
    // ══════════════════════════════════════════════════════════════

    await step(h, "nft-transfer-moves-control", async () => {
      await transferNft(h, {nft: tba.nft, fromRole: "agent1", to: stranger.address as `0x${string}`, tokenId: 370n});

      const oldOwner = await h.cliAs("agent1", [
        "deal", "delegate", "--delegatee", tba.account, "--deal-address", ctx.dealAddress, ...nftFlags,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(oldOwner.exitCode, 0, "previous owner can no longer act through the account");
      assert.match(String(oldOwner.data.error ?? oldOwner.stdout), /not the NFT owner|not a valid signer/, "clear signer error for the old owner");

      const newOwner = await h.cliAs("agent2", [
        "deal", "delegate", "--delegatee", stranger.address, "--deal-address", ctx.dealAddress, ...nftFlags,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.defined(newOwner.data.txHash, "new owner acts through the account");
      assert.equal((await readVotes(h, stakeToken!, stranger.address)).toString(), agentMint, "account's stake votes now delegated to the new owner");

      const discover = await h.cliAs("agent2", [
        "discover", "--chain-id", String(config.chainId), ...nftFlags,
        "--config", config.configPath, "--pretty-print",
      ]);
      // Discover works for the account session; the count is not asserted because the
      // backend caches a wallet's membership snapshot (4h) from its first login, which
      // for this account happened before it held any tokens.
      assert.equal(discover.data.action, "discover", "discover as the account session");
      h.log(`discover as TBA: totalDacs=${String(discover.data.totalDacs)}`);
      return {cli: newOwner, command: ["deal", "delegate", "--nft", "(new owner)"]};
    });
  },
};
