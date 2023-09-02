// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../registry/BNSRegistry.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseRegistrarImplementation is ERC721, Ownable {
    BNSRegistry public bns;

    bytes32 public baseNode;

    address public controller;

    // TODO expiries

    constructor(
        BNSRegistry _bns,
        bytes32 _baseNode
    ) ERC721("Binance Name Service", "BNS") {
        bns = _bns;
        baseNode = _baseNode;
    }

    modifier live() {
        require(bns.owner(baseNode) == address(this));
        _;
    }

    modifier onlyController() {
        require(controller == msg.sender, "");
        _;
    }

    function setController(address _controller) public onlyOwner {
        controller = _controller;
    }

    function ownerOf(uint256 tokenId) public view override returns (address) {
        return super.ownerOf(tokenId);
    }

    function setResolver(address resolver) external onlyOwner {
        bns.setResolver(baseNode, resolver);
    }

    function register(uint256 id, address owner) external live onlyController {
        if (_exists(id)) _burn(id);

        _mint(owner, id);

        bns.setSubnodeOwner(baseNode, bytes32(id), owner);
    }

    function reclaim(uint256 id, address owner) external live {
        require(_isApprovedOrOwner(msg.sender, id));
        bns.setSubnodeOwner(baseNode, bytes32(id), owner);
    }
}
