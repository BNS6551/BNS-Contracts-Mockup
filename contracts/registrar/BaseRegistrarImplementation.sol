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
        address _controller,
        bytes32 _baseNode
    ) ERC721("Binance Name Service", "BNS") {
        bns = _bns;
        controller = _controller;
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

// bytes4 private constant INTERFACE_META_ID =
//     bytes4(keccak256("supportsInterface(bytes4)"));
// bytes4 private constant ERC721_ID =
//     bytes4(
//         keccak256("balanceOf(address)") ^
//             keccak256("ownerOf(uint256)") ^
//             keccak256("approve(address,uint256)") ^
//             keccak256("getApproved(uint256)") ^
//             keccak256("setApprovalForAll(address,bool)") ^
//             keccak256("isApprovedForAll(address,address)") ^
//             keccak256("transferFrom(address,address,uint256)") ^
//             keccak256("safeTransferFrom(address,address,uint256)") ^
//             keccak256("safeTransferFrom(address,address,uint256,bytes)")
//     );
// bytes4 private constant RECLAIM_ID =
//     bytes4(keccak256("reclaim(uint256,address)"));

// function supportsInterface(
//     bytes4 interfaceID
// ) external view returns (bool) {
//     return
//         interfaceID == INTERFACE_META_ID ||
//         interfaceID == ERC721_ID ||
//         interfaceID == RECLAIM_ID;
// }
