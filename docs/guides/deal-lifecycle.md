# Guide: Deal Lifecycle

This guide covers the complete deal lifecycle — from creation through evaluation, claims, and recovery.

## Overview

```
Create  -->  Invite + Stake  -->  Approve  -->  Evaluate  -->  Claim / Unstake
                                                    |
                                              (if slashed)
                                                    v
                                                 Recover
```

## 1. Create a Deal

Prepare a deal configuration JSON file (see [Deal Commands > create](../cli/deal-commands.md#create-dealfile) for the schema).

```bash
dac deal create ./deal.json --dac 0x<dac> --config ./config.env --pretty-print
```

This creates a DAC governance proposal. The deal address and cell address are returned.

## 2. Invite Agents (Whitelist)

Deals are created with `whitelistOnly=true`. The deal proposer must invite agents before they can stake:

```bash
# Invite agent1
dac deal invite 0x<agent1> --deal 0x<deal>

# Invite agent2 with invite rights (can invite others)
dac deal invite 0x<agent2> --deal 0x<deal> --grant-invite-right
```

## 3. Stake

Agents stake AgentTokens into the deal. **Staking must happen before approval.**

```bash
# Founder stakes
dac deal stake 10000000000000000000000 \
  --deal 0x<deal> --dac 0x<dac> --auto-delegate

# Agent1 stakes (using their private key)
dac deal stake 5000000000000000000000 \
  --deal 0x<deal> --dac 0x<dac> --auto-delegate \
  --private-key 0x<agent1-key>
```

## 4. Approve the Deal

The deal was created as a DAC proposal. Vote and execute it:

```bash
dac vote proposal <proposalId> true --dac 0x<dac>
dac execute <proposalId> --dac 0x<dac>
```

After approval, the deal becomes `active=true`. No more staking is allowed.

## 5. Evaluate

After a milestone deadline passes (or if progress >= 100%), trigger evaluation:

```bash
dac deal evaluate --deal-id 1 --dac 0x<dac>
```

### Evaluation Outcomes

| Progress | Action | Result |
|----------|--------|--------|
| >= 100% (before deadline) | Reward | Reward unlocked immediately |
| < 100%, deadline passed, extension configured | Extend | Deadline extended, no penalty |
| < 100%, deadline passed, no extension | Penalty + Reward | Partial slash + partial reward |
| 0%, deadline passed | Full slash | All stake burned, deal auto-closes |

### Multi-Milestone Deals

Milestones are evaluated independently in a single call. If progress >= 100% for a milestone, it triggers regardless of its deadline. To test sequential evaluation, ensure each milestone has a different `expectedReturn` so deposits can't satisfy both at once.

## 6. Claim Rewards

After evaluation unlocks rewards, each agent claims their proportional share:

```bash
dac deal claim --deal 0x<deal>
```

Rewards are proportional to stake: an agent with 40% of total stake gets 40% of allocated rewards.

## 7. Unstake

After the deal closes, agents can unstake to recover their AgentTokens:

```bash
dac deal unstake --deal 0x<deal>
```

Note: After a full slash (100%), all StakedAgent tokens are **burned**. Unstake will revert with `NoStake()`. Use deal recovery instead.

## 8. Force Return Capital

If the deal deadline passes without full evaluation, anyone with MainToken can force-return remaining capital:

```bash
dac deal withdraw <dealNumericId> --dac 0x<dac>
```

This returns funds to the DAC treasury but does **not** close the deal.

## 9. Deal Recovery

When a deal is fully slashed and closed (`totalSupply=0`), the DAC can recover it by appointing liquidators:

```bash
# Appoint a liquidator via DAC governance
dac propose recover-deal <dealId> 0x<liquidator> 1000000000000000000000 --dac 0x<dac>
dac vote proposal <id> true --dac 0x<dac>
dac execute <id> --dac 0x<dac>
```

Key points:
- `liquidatorStake` must be > 0 (StakedAgent tokens are minted directly to the liquidator)
- The liquidator does NOT need AgentTokens — tokens are minted fresh
- Multiple liquidators can be appointed via separate `recover-deal` proposals
- Liquidators can use deal governance (propose, vote, execute) with their minted StakedAgent tokens
- After recovery, the deal is in liquidation mode — original agents cannot unstake

## Verifying Deal State

```bash
# Deal overview (active, closed, recovered, rewards, slashing)
dac deal view deal --deal 0x<deal>

# Agent positions (per-agent stake, slash, claim amounts)
dac deal view positions --deal 0x<deal>

# Deal governance proposals
dac deal view proposals --deal 0x<deal>
```

## Related

- [Deal Commands Reference](../cli/deal-commands.md)
- [Native DAC Guide](./native-dac.md)
- [Governance Guide](../cli/governance.md)
