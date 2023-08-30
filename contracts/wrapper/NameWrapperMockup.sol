// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NameWrapperMockup is ERC721 {
    mapping(bytes32 => uint256) public tokenIds;
    mapping(uint256 => bytes32) public nodeNames;
    uint256 public nextTokenId;

    constructor() ERC721("BNS Name Wrapper", "BNW") {}

    function wrap(bytes32 node) external {
        require(tokenIds[node] == 0, "Already wrapped");

        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);

        tokenIds[node] = tokenId;
        nodeNames[tokenId] = node;
    }

    function unwrap(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");

        bytes32 node = nodeNames[tokenId];
        require(node != bytes32(0), "Token does not exist");

        _burn(tokenId);

        delete tokenIds[node];
        delete nodeNames[tokenId];
    }
}
