// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../bns-6551/BNS6551Factory.sol";
import "../registry/BNSRegistry.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseRegistrarImplementation is ERC721, Ownable {
    BNSRegistry public bns;
    BNS6551Factory public factory;

    bytes32 public baseNode;

    address public controller;

    mapping(bytes32 => address) public bns6551s;

    bytes32[] private nodeHashes;

    constructor(
        BNSRegistry _bns,
        BNS6551Factory _factory,
        bytes32 _baseNode
    ) ERC721("Binance Name Service", "BNS") {
        bns = _bns;
        factory = BNS6551Factory(_factory);
        baseNode = _baseNode;
    }

    modifier live() {
        require(
            bns.owner(baseNode) == address(this),
            "Base::live:Caller is not the owner of the baseNode"
        );
        _;
    }

    modifier onlyController() {
        require(
            controller == msg.sender,
            "Base::onlyController:Caller is not the controller"
        );
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
        bytes32 nodehash = _getNodeHashFromTokenId(id);
        nodeHashes.push(nodehash);

        bns6551s[nodehash] = factory.createBNS6551(address(this), id);

        bns.setSubnodeOwner(baseNode, bytes32(id), owner);
    }

    function reclaim(uint256 id, address owner) external live {
        require(
            _isApprovedOrOwner(msg.sender, id),
            "Base::reclaim:Caller is not approved or not the owner of the token"
        );
        bns.setSubnodeOwner(baseNode, bytes32(id), owner);
    }

    function transfer(
        uint256 tokenId,
        address newOwner
    ) external live onlyController {
        require(_exists(tokenId), "Base::transfer: Token does not exist");
        _burn(tokenId);
        _mint(newOwner, tokenId);
        bns.setSubnodeOwner(baseNode, bytes32(tokenId), newOwner);
    }

    function getNodeHashes() external view returns (bytes32[] memory) {
        return nodeHashes;
    }

    function _getNodeHashFromTokenId(
        uint256 tokenId
    ) internal view returns (bytes32 nodehash) {
        bytes32 label = bytes32(tokenId);
        nodehash = keccak256(abi.encodePacked(baseNode, label));
    }
}
