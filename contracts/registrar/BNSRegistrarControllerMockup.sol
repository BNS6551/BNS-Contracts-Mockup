// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../registry/BNSRegistryMockup.sol";
import "../wrapper/NameWrapperMockup.sol";


contract BNSRegistrarControllerMockup {
    BNSRegistryMockup public registry;
    NameWrapperMockup public nameWrapper;
    address public owner;
    uint256 public registrationFee;
    uint256 public auctionEndBlock;

    struct Bid {
        address bidder;
        uint256 amount;
    }

    mapping(bytes32 => Bid[]) public bids;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor(
        address _registry,
        address _nameWrapper,
        uint256 _registrationFee,
        uint256 _auctionEndBlock
    ) {
        registry = BNSRegistryMockup(_registry);
        nameWrapper = NameWrapperMockup(_nameWrapper);
        owner = msg.sender;
        registrationFee = _registrationFee;
        auctionEndBlock = _auctionEndBlock;
    }

    function register(
        bytes32 node,
        address _owner,
        address _resolver
    ) external payable onlyOwner {
        require(msg.value == registrationFee, "Incorrect registration fee");
        require(registry.owner(node) == address(0), "Name already registered");
        registry.setOwner(node, _owner);
        registry.setResolver(node, _resolver);
        nameWrapper.wrap(node);
    }

    function transfer(bytes32 node, address newOwner) public onlyOwner {
        require(registry.owner(node) != address(0), "Name not registered");
        uint256 tokenId = nameWrapper.tokenIds(node);
        require(tokenId != 0, "Name not wrapped");
        registry.setOwner(node, newOwner);
        nameWrapper.transferFrom(address(this), newOwner, tokenId);
    }

    function bid(bytes32 node) external payable {
        require(block.number < auctionEndBlock, "Auction has ended");
        bids[node].push(Bid({bidder: msg.sender, amount: msg.value}));
    }

    function endAuction(bytes32 node) external onlyOwner {
        require(block.number >= auctionEndBlock, "Auction has not ended yet");

        Bid[] memory nodeBids = bids[node];
        require(nodeBids.length > 0, "No bids for this name");

        // Find the highest bidder
        Bid memory highestBid = nodeBids[0];
        for (uint256 i = 1; i < nodeBids.length; i++) {
            if (nodeBids[i].amount > highestBid.amount) {
                highestBid = nodeBids[i];
            }
        }

        // Transfer the BNS(NFT) to the highest bidder
        transfer(node, highestBid.bidder);

        // Refund all other bidders
        for (uint256 i = 0; i < nodeBids.length; i++) {
            if (nodeBids[i].bidder != highestBid.bidder) {
                payable(nodeBids[i].bidder).transfer(nodeBids[i].amount);
            }
        }

        // Reset bids for this node
        delete bids[node];
    }
}
