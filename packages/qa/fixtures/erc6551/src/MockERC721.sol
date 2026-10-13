// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// Stand-in for an agent-identity collection (e.g. Loopers on Base) on local
/// chains: anyone may mint any token id, so QA can give each role an NFT.
contract MockERC721 is ERC721 {
    constructor() ERC721("QA Loopers", "QLOOP") {}

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }
}
