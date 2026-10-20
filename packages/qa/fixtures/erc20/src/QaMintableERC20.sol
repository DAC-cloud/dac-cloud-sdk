// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// Mintable ERC-20 stand-ins for the local chain. Name, symbol and decimals are
/// compiled in (not constructor storage) so the runtime bytecode can be installed
/// with `anvil_setCode` at a fixed address without ever running a constructor —
/// the same trick as the ERC-6551 fixtures. Mirrors the contracts repo's
/// `ScriptMintableERC20`: `mint(address,uint256)` is permissionless.
abstract contract QaMintableERC20 is ERC20 {
    constructor() ERC20("", "") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/// Treasury / underlying token (USDC-like, 6 decimals) — `DAC_TREASURY_TOKEN` default.
contract QaTreasuryUSD is QaMintableERC20 {
    function name() public pure override returns (string memory) { return "QA Seed USD"; }
    function symbol() public pure override returns (string memory) { return "sUSD"; }
    function decimals() public pure override returns (uint8) { return 6; }
}

/// Secondary token (18 decimals) — `DAC_SECONDARY_TOKEN` default; used by the
/// multi-token / `recover-profits` steps.
contract QaSecondaryToken is QaMintableERC20 {
    function name() public pure override returns (string memory) { return "QA Wrapped DAC"; }
    function symbol() public pure override returns (string memory) { return "uWDAC"; }
    function decimals() public pure override returns (uint8) { return 18; }
}
