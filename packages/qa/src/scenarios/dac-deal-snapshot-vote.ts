import {writeFileSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {coreModule, type SnapshotV1Payload} from "@dac-cloud/core";
import {createPublicClient, http, type Hex} from "viem";
import {step} from "../harness/index.js";
import type {Harness, Scenario} from "../harness/types.js";
import {
  dealProposeVoteExecute,
  getChainTimestamp,
  mintMockToken,
  proposeVoteExecute,
  resolveUnderlyingToken,
  ZERO_ADDR,
} from "./fixtures/common.js";

// Local: propose → vote → execute a DAC-level proposal as a non-default wallet
// role. Mirrors the private helper of the same name in dac-investment.ts; kept
// inline here to avoid widening the public fixtures surface.
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

const SNAPSHOT_VERSION = "0.1.4";
const ERC1271_MAGIC: Hex = "0x1626ba7e";
const ERC1271_INVALID: Hex = "0xffffffff";

const isValidSignatureAbi = [
  {
    type: "function",
    name: "isValidSignature",
    stateMutability: "view",
    inputs: [
      {name: "hash", type: "bytes32"},
      {name: "signature", type: "bytes"},
    ],
    outputs: [{type: "bytes4"}],
  },
] as const;

async function readIsValidSignature(
  rpcUrl: string,
  dealAddress: string,
  hash: Hex,
): Promise<Hex> {
  const client = createPublicClient({transport: http(rpcUrl)});
  const result = await client.readContract({
    address: dealAddress as `0x${string}`,
    abi: isValidSignatureAbi,
    functionName: "isValidSignature",
    args: [hash, "0x"],
  });
  return result as Hex;
}

/**
 * Scenario: DAC Deal as ERC-1271 Signer for Snapshot.org Off-Chain Voting
 *
 * Context:
 *   When a parent DAC invests into a child DAC via a DACDeal, the child's
 *   governance tokens land in the Deal escrow. If the child then runs voting
 *   through Snapshot.org (off-chain signaling), the parent's stake would be
 *   silently disenfranchised — Snapshot can only verify EOA signatures unless
 *   the holder is an ERC-1271 contract.
 *
 *   DACDeal now exposes isValidSignature(hash, sig). Two new deal governance
 *   proposals gate the surface:
 *     - APPROVE_VOTING_VENUE_VERSION — whitelist a (venueId, version) pair
 *     - EXTERNAL_VOTE_SIGN — pre-approve a specific Snapshot Vote payload
 *
 *   This scenario reproduces the realistic Snapshot pipeline end-to-end:
 *     1. Parent invests in child, first tranche fulfilled → Deal holds child main tokens
 *     2. Parent's Deal governance approves snapshot.js version 0.1.4
 *     3. Parent's Deal governance approves a SnapshotV1 Vote payload
 *     4. Emulate Snapshot's eth_call: isValidSignature(finalHash, "0x") → 0x1626ba7e
 *     5. Tamper test: flip choice → isValidSignature → 0xffffffff
 *     6. Expiry test: warp past expiry → isValidSignature → 0xffffffff
 *     7. Revoke version: subsequent vote-sign proposals revert
 *
 *   Snapshot's backend reconstructs the EIP-712 final hash from the structured
 *   Vote payload (domain = {name:"snapshot", version:<payload.version>}, no
 *   chainId, no verifyingContract) and calls isValidSignature on `from`. Our
 *   off-chain helper (computeSnapshotV1FinalHash) must produce the same hash
 *   the contract stores — if they ever drift, step 4 surfaces it loudly.
 */
export const dacDealSnapshotVoteScenario: Scenario = {
  name: "dac-deal-snapshot-vote",
  description: "DACDeal acts as ERC-1271 signer for Snapshot.org off-chain Vote payloads — version allow-list, vote approval, isValidSignature, tamper/expiry/revocation",
  tags: ["dac-deal", "erc1271", "snapshot", "child-dac", "investment"],

  async run(h: Harness) {
    if (!h.config.isLocalChain) {
      h.log("This scenario requires local chain for time manipulation. Skipping.");
      return;
    }

    const {assert, config} = h;
    const founderA = config.wallets.founder;
    const founderB = config.wallets.agent1;
    if (!founderA) throw new Error("founder wallet required");
    if (!founderB) throw new Error("agent1 wallet required");

    const underlyingToken = resolveUnderlyingToken(h);

    // ── Phase 1: bootstrap investor + investee + first tranche ─────
    // Lean version of dac-investment.ts: investor existing-token DAC, investee
    // native DAC, a single dac-deal funded by the first tranche.

    await mintMockToken(h, {token: underlyingToken, to: founderA.address, amount: "1000000000000000000000000"});

    let investorDacAddress: string;
    await step(h, "create-investor-dac", async () => {
      const cli = await h.cli([
        "create-existing-token",
        "--name", "Investor DAC", "--description", "ERC-1271 scenario investor", "--symbol", "INV",
        "--underlying-token", underlyingToken,
        "--treasury-seed-amount", "100000000000000000000000",
        "--quorum-percent", "50", "--blocking-percent", "25", "--high-quorum-percent", "75",
        "--voting-duration", "7200", "--qualification", "0", "--execution-validity-duration", "86400",
        "--oracle-publish-deadline", "600", "--fallback-warmup-duration", "10", "--fallback-duration", "3600",
        "--auto-delegate", "--auto-approve",
        "--config", config.configPath, "--pretty-print",
      ]);
      investorDacAddress = cli.data.dac as string;
      assert.isAddress(investorDacAddress, "investor DAC deployed");
      return {cli, command: ["dac", "create-existing-token"]};
    });

    await h.syncIndexer();
    await h.cli([
      "wrap", "--amount", "50000000000000000000000",
      "--dac", investorDacAddress!, "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);
    await proposeVoteExecute(h, investorDacAddress!, [
      "propose", "mint-agent-tokens", "100000000000000000000000", founderA.address,
    ]);
    await h.cli([
      "deposit-treasury", "--token", underlyingToken,
      "--amount", "50000000000000000000000",
      "--dac", investorDacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    let investeeDacAddress: string;
    let investeeMainTokenAddress: string;
    await step(h, "create-investee-dac", async () => {
      const cli = await h.cliAs("agent1", [
        "create",
        "--name", "Investee DAC", "--description", "ERC-1271 scenario investee", "--symbol", "IVE",
        "--max-supply", "10000000000000000000000000",
        "--default-quorum", "50",
        "--allocation", "500000000000000000000000",
        "--treasury-token", underlyingToken,
        "--commitment", "0", "--auto-delegate",
        "--config", config.configPath, "--pretty-print",
      ]);
      investeeDacAddress = cli.data.dac as string;
      investeeMainTokenAddress = cli.data.mainToken as string;
      assert.isAddress(investeeDacAddress, "investee DAC deployed");
      return {cli, command: ["dac", "create"]};
    });

    await h.cliAs("agent1", [
      "join", "--dac", investeeDacAddress!, "--auto-approve",
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.cliAs("agent1", [
      "delegate", "--delegatee", founderB.address, "--dac", investeeDacAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.syncIndexer();

    // Mint investee main tokens into investee treasury so capital calls succeed.
    await proposeVoteExecuteAs(h, "agent1", investeeDacAddress!, [
      "propose", "mint-main-tokens", "2000000000000000000000000",
    ]);
    await h.syncIndexer();

    // Build deal JSON
    const chainTs = await getChainTimestamp(h);
    const managedEquity = "500000000000000000000000";
    const cashAmount = "10000000000000000000000";
    const dealJson = {
      dealKind: "dac-deal",
      name: "ERC-1271 Snapshot Deal",
      description: "Deal that signs Snapshot votes for investee DAC governance",
      linkHash: "seed://dac-deal-snapshot-vote",
      dealTarget: investeeDacAddress!,
      fundingToken: underlyingToken,
      fundingAmount: cashAmount,
      rewardsLimit: "100000000000000000000000",
      dealRewardPoolPercent: "0",
      approveDeadline: String(chainTs + 86400 * 7),
      evaluationDeadline: String(chainTs + 86400 * 30),
      dealDeadline: String(chainTs + 86400 * 60),
      dealConfig: {managedEquity},
      evaluatorSelector: "milestones-evaluator",
      evaluatorConfig: {
        rewardShare: "1000000000000000000",
        milestones: [{
          milestoneType: 0,
          token: underlyingToken,
          oracle: ZERO_ADDR,
          valuationMode: 0,
          fundingToken: ZERO_ADDR,
          expectedReturn: cashAmount,
          timestamp: String(chainTs + 86400 * 30),
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
    const dealJsonPath = join(tmpdir(), `dac-deal-snapshot-vote-${Date.now()}.json`);
    writeFileSync(dealJsonPath, JSON.stringify(dealJson, null, 2));

    let dealAddress: string;
    let dealCell: string;
    let dealDacProposalId: string;
    await step(h, "create-dac-deal", async () => {
      const cli = await h.cli([
        "deal", "create", dealJsonPath,
        "--dac", investorDacAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      dealAddress = cli.data.dealAddress as string;
      dealCell = cli.data.dealCell as string;
      dealDacProposalId = String(cli.data.dacProposalId ?? "");
      assert.isAddress(dealAddress, "deal contract deployed");
      h.log(`Deal address=${dealAddress}`);
      return {cli, command: ["dac", "deal", "create"]};
    });
    await h.syncIndexer();

    // Capital call recipient = the new DACDeal contract.
    const capitalCallNonce = await proposeVoteExecuteAs(h, "agent1", investeeDacAddress!, [
      "propose", "capital-call", dealAddress!, underlyingToken, managedEquity, cashAmount,
    ]);
    await h.syncIndexer();

    // Stake + link + approve → first tranche fulfilled, Deal holds investee main tokens.
    await h.cli([
      "deal", "stake", "10000000000000000000000",
      "--deal-address", dealCell!, "--dac", investorDacAddress!,
      "--auto-delegate",
      "--config", config.configPath, "--pretty-print",
    ]);
    await h.cli([
      "deal", "link-capital-call", capitalCallNonce,
      "--deal-address", dealAddress!,
      "--config", config.configPath, "--pretty-print",
    ]);
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

    await step(h, "verify-deal-holds-child-tokens", async () => {
      const cli = await h.cli([
        "balance", investeeMainTokenAddress!, dealAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      assert.equal(cli.data.balance as string, managedEquity, "Deal escrow holds investee main tokens");
      return {cli, command: ["dac", "balance"]};
    });

    // ── Phase 2: approve snapshot-v1 + version "0.1.4" ─────────────
    // High quorum (>= 75%) is required; founderA has 100% of voting power on
    // the investor DAC so this passes.
    await step(h, "approve-snapshot-version", async () => {
      const proposalId = await dealProposeVoteExecute(h, dealAddress!, [
        "deal", "propose", "approve-venue-version", "snapshot-v1", SNAPSHOT_VERSION, "true",
      ]);
      h.log(`approve-venue-version deal proposal: ${proposalId}`);
      assert.defined(proposalId, "approve-venue-version proposal id");
      // Sanity: contract surface reflects the approval.
      await h.syncIndexer();
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "deal", "propose", "approve-venue-version"],
      };
    });

    // ── Phase 3: build + approve a SnapshotV1 vote payload ─────────
    const afterApprovalTs = await getChainTimestamp(h);
    const expiry = afterApprovalTs + 86400; // 1 day window
    const payload: SnapshotV1Payload = {
      version: SNAPSHOT_VERSION,
      from: dealAddress!.toLowerCase(),
      space: "investee-dac.eth",
      timestamp: BigInt(afterApprovalTs),
      proposal: "0x" + "f0".repeat(32),
      choice: 1,
      reason: "",
      app: "dac-cloud-qa",
      metadata: "",
      expiry: BigInt(expiry),
    };
    const expectedHash = coreModule.computeSnapshotV1FinalHash(payload);
    h.log(`Off-chain reconstructed Snapshot final hash: ${expectedHash}`);

    // CLI `--input` reads a file path; write the payload JSON to a temp file.
    function writePayloadFile(p: SnapshotV1Payload, label: string): string {
      const file = join(tmpdir(), `${label}-${Date.now()}.json`);
      writeFileSync(file, JSON.stringify({
        version: p.version,
        from: p.from,
        space: p.space,
        timestamp: p.timestamp.toString(),
        proposal: p.proposal,
        choice: p.choice,
        reason: p.reason,
        app: p.app,
        metadata: p.metadata,
        expiry: p.expiry.toString(),
      }, null, 2));
      return file;
    }

    await step(h, "approve-snapshot-vote", async () => {
      const inputFile = writePayloadFile(payload, "snapshot-vote-sign");
      const proposalId = await dealProposeVoteExecute(h, dealAddress!, [
        "deal", "propose", "snapshot-vote-sign",
        "--input", inputFile,
      ]);
      h.log(`snapshot-vote-sign deal proposal: ${proposalId}`);
      assert.defined(proposalId, "snapshot-vote-sign proposal id");
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "deal", "propose", "snapshot-vote-sign"],
      };
    });

    // ── Phase 4: emulated Snapshot eth_call ────────────────────────
    // This is what snapshot.org's sequencer does: reconstruct the EIP-712 final
    // hash from the Vote payload, then eth_call isValidSignature(hash, sig) on
    // the `from` contract. Our off-chain hash MUST equal the contract's stored
    // hash, else the contract returns ERC1271_INVALID.
    await step(h, "snapshot-eth-call-validates", async () => {
      const result = await readIsValidSignature(config.localRpcUrl, dealAddress!, expectedHash);
      assert.equal(result, ERC1271_MAGIC, "isValidSignature returns ERC-1271 magic value for approved vote");
      return {
        cli: {data: {finalHash: expectedHash, result}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["eth_call", "isValidSignature"],
      };
    });

    // ── Phase 5: tamper test ───────────────────────────────────────
    // A vote with a different choice has a different EIP-712 final hash; the
    // contract must reject any hash it didn't itself approve, even if the
    // payload differs by a single field.
    await step(h, "snapshot-tamper-rejected", async () => {
      const tampered: SnapshotV1Payload = {...payload, choice: 2};
      const tamperedHash = coreModule.computeSnapshotV1FinalHash(tampered);
      assert.notEqual(tamperedHash, expectedHash, "tampered hash differs from approved hash");
      const result = await readIsValidSignature(config.localRpcUrl, dealAddress!, tamperedHash);
      assert.equal(result, ERC1271_INVALID, "isValidSignature rejects tampered vote hash");
      return {
        cli: {data: {tamperedHash, result}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["eth_call", "isValidSignature", "tampered"],
      };
    });

    // ── Phase 6: expiry test ───────────────────────────────────────
    // Approval is bounded by `expiry`. After it lapses, isValidSignature
    // must return INVALID even for the originally-approved hash.
    await step(h, "snapshot-expired-rejected", async () => {
      const now = await getChainTimestamp(h);
      const advanceBy = expiry - now + 60;
      await h.advanceTime(advanceBy);
      const result = await readIsValidSignature(config.localRpcUrl, dealAddress!, expectedHash);
      assert.equal(result, ERC1271_INVALID, "isValidSignature rejects expired vote");
      return {
        cli: {data: {expectedHash, result, advancedBy: advanceBy}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["eth_call", "isValidSignature", "expired"],
      };
    });

    // ── Phase 7: revoke version, ensure subsequent approvals fail ──
    await step(h, "revoke-snapshot-version", async () => {
      const proposalId = await dealProposeVoteExecute(h, dealAddress!, [
        "deal", "propose", "approve-venue-version", "snapshot-v1", SNAPSHOT_VERSION, "false",
      ]);
      assert.defined(proposalId, "revoke proposal id");
      return {
        cli: {data: {proposalId}, stdout: "", stderr: "", exitCode: 0, durationMs: 0},
        command: ["dac", "deal", "propose", "approve-venue-version", "false"],
      };
    });

    // A fresh vote payload at the now-revoked version must fail to execute.
    // The deal proposal can be created, but `executeStakedAgentProposal`
    // reverts when the version is not in the allow-list. We allow CLI failure
    // and assert it surfaced.
    await step(h, "snapshot-vote-sign-rejected-after-revoke", async () => {
      const tsNow = await getChainTimestamp(h);
      const newPayload: SnapshotV1Payload = {
        ...payload,
        timestamp: BigInt(tsNow),
        expiry: BigInt(tsNow + 86400),
        proposal: "0x" + "ab".repeat(32),
      };
      const inputFile = writePayloadFile(newPayload, "snapshot-vote-sign-post-revoke");
      const proposeCli = await h.cli([
        "deal", "propose", "snapshot-vote-sign",
        "--input", inputFile,
        "--deal-address", dealAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      const newProposalId = String(proposeCli.data.proposalId ?? proposeCli.data.id ?? "");
      assert.defined(newProposalId, "post-revoke proposal can still be created");

      await h.advanceTime(10);
      await h.cli([
        "deal", "vote", "proposal", newProposalId, "true",
        "--deal-address", dealAddress!,
        "--config", config.configPath, "--pretty-print",
      ]);
      await h.advanceTime(7300);
      const execCli = await h.cli([
        "deal", "execute", newProposalId,
        "--deal-address", dealAddress!,
        "--config", config.configPath, "--pretty-print",
      ], {allowFailure: true});
      assert.notEqual(execCli.exitCode, 0, "execute reverts because version is revoked");
      return {
        cli: execCli,
        command: ["dac", "deal", "execute", "post-revoke"],
      };
    });

    h.log("dac-deal-snapshot-vote scenario completed.");
  },
};
