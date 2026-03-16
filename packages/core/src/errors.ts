import {BaseError, ContractFunctionRevertedError} from "viem";
import {toFunctionSelector} from "viem";

export const dacErrorSignatures = [
  "error NotAllowed()",
  "error NotAuthorized()",
  "error NotInitialized()",
  "error AlreadyInitialized()",
  "error NotFound()",
  "error InvalidVotingConfig()",
  "error NoVotingPower()",
  "error VoteNotPassed()",
  "error ProposalAlreadyExecuted()",
  "error MaxSupplyExceeded()",
  "error NotTransferable()",
  "error TransferFailed()",
  "error InsufficientBalance()",
  "error NotEnoughBalance()",
  "error InvalidCapitalCall()",
  "error AlreadyFulfilled()",
  "error LegalWrapperNotSet()",
  "error LegalWrapperExecutionExpected()",
  "error ModuleNotApproved()",
  "error ModuleDisabled()",
  "error InvalidDealAddress()",
  "error InvalidDeal(address deal)",
  "error InvalidDealId(uint256 deal)",
  "error InvalidDealState(address deal)",
  "error InvalidTranche()",
  "error InsufficientTreasury()",
  "error NoStake()",
  "error InsufficientRewards()",
  "error MintBlockedByEvaluator()",
  "error DividendsNotEnabled()",
  "error DividendAlreadyClaimed(uint256 id, address claimer)",
  "error InvalidMerkleProof()",
  "error DealNotRecoverable()",
  "error DeadlineNotPassed()",
  "error DealAlreadyApproved()",
  "error NotWhitelistedAgent()",
  "error NotWhitelistDeal()",
  "error DealIsNotApproved()",
  "error DealIsClosed()",
  "error DealIsNotClosed()",
  "error DealInLiquidation()",
  "error ProposalNotSupported()",
  "error InvalidProposal()",
  "error AlreadyExecuted()",
  "error MessageNotAccepted()",
  "error NotStakedAgent()",
  "error TrancheNotExists()",
  "error TrancheAlreadySettled()",
  "error NoClaimableRewards()",
  "error NotResolved()",
  "error VetoNotEnabled()",
  "error VotingEnded()",
  "error AlreadyVoted()",
  "error NoFunding()",
  "error ConfigMismatchParams()",
  "error UnsupportedProposal()",
  "error EarlyReturnsNotAllowed()",
  "error CapitalWithdrawNotSupported()",
  "error InvalidToken()",
] as const;

export const commonOZErrorSignatures = [
  "error ERC5805FutureLookup(uint256 timepoint, uint48 clock)",
  "error ERC5805FutureLookup(uint48 timepoint, uint48 clock)",
  "error ERC5805CheckpointUnorderedInsertion()",
  "error ERC6372InconsistentClock()",
] as const;

export const commonErrorSignatures = [...dacErrorSignatures, ...commonOZErrorSignatures] as const;

const selectorMap = new Map<string, string>();
for (const sig of commonErrorSignatures) {
  const normalized = sig.replace(/^error\s+/, "").replace(/\s+/g, " ").trim();
  const signature = normalized.replace(/^[A-Za-z0-9_]+\s+/, "").trim();
  const selector = toFunctionSelector(signature as `${string}(${string})`).toLowerCase();
  selectorMap.set(selector, signature);
}

function extractSelector(text: string): string | undefined {
  const match = text.match(/0x[0-9a-fA-F]{8}/);
  return match?.[0]?.toLowerCase();
}

export function formatViemError(error: unknown): string {
  if (error instanceof BaseError) {
    const revert = error.walk((e) => e instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      if (revert.data?.errorName) {
        const args = revert.data.args?.length ? `(${revert.data.args.map((arg) => String(arg)).join(", ")})` : "()";
        return `${revert.data.errorName}${args}`;
      }

      const selector = extractSelector(revert.shortMessage ?? "") ?? extractSelector(error.shortMessage ?? "");
      if (selector && selectorMap.has(selector)) {
        return `${selectorMap.get(selector)} [selector ${selector}]`;
      }
    }

    const selector = extractSelector(error.shortMessage ?? "");
    if (selector && selectorMap.has(selector)) {
      return `${selectorMap.get(selector)} [selector ${selector}]`;
    }

    return error.shortMessage || error.message;
  }

  if (error instanceof Error) {
    const selector = extractSelector(error.message);
    if (selector && selectorMap.has(selector)) {
      return `${selectorMap.get(selector)} [selector ${selector}]`;
    }
    return error.message;
  }

  return String(error);
}
