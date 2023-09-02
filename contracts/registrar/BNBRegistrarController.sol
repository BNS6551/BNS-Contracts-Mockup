// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {BaseRegistrarImplementation as BaseRegistrar} from "./BaseRegistrarImplementation.sol";
import {PublicResolver as Resolver} from "../resolver/PublicResolver.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract BNBRegistrarController is Ownable {
    BaseRegistrar base;

    uint256 public registrationFee;

    constructor(BaseRegistrar _base, uint256 _registrationFee) {
        base = _base;
        registrationFee = _registrationFee;
    }

    function register(
        string memory name,
        address owner,
        address resolver,
        address addr
    ) public payable {
        require(registrationFee == msg.value, "11");

        bytes32 label = keccak256(bytes(name));
        uint256 tokenId = uint256(label);

        base.register(tokenId, address(this));

        bytes32 nodehash = keccak256(abi.encodePacked(base.baseNode(), label));

        base.bns().setResolver(nodehash, resolver);

        Resolver(resolver).setAddress(nodehash, addr);

        base.reclaim(tokenId, owner);
        base.transferFrom(address(this), owner, tokenId);
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    // uint256 public auctionEndBlock;

    // struct Bid {
    //     address bidder;
    //     uint256 amount;
    // }

    // function bid(bytes32 node) external payable {
    //     require(block.number < auctionEndBlock, "Auction has ended");
    //     bids[node].push(Bid({bidder: msg.sender, amount: msg.value}));
    // }

    // function endAuction(bytes32 node) external onlyOwner {
    //     require(block.number >= auctionEndBlock, "Auction has not ended yet");

    //     Bid[] memory nodeBids = bids[node];
    //     require(nodeBids.length > 0, "No bids for this name");

    //     // Find the highest bidder
    //     Bid memory highestBid = nodeBids[0];
    //     for (uint256 i = 1; i < nodeBids.length; i++) {
    //         if (nodeBids[i].amount > highestBid.amount) {
    //             highestBid = nodeBids[i];
    //         }
    //     }

    //     // Transfer the BNS(NFT) to the highest bidder
    //     transfer(node, highestBid.bidder);

    //     // Refund all other bidders
    //     for (uint256 i = 0; i < nodeBids.length; i++) {
    //         if (nodeBids[i].bidder != highestBid.bidder) {
    //             payable(nodeBids[i].bidder).transfer(nodeBids[i].amount);
    //         }
    //     }

    //     // Reset bids for this node
    //     delete bids[node];
    // }
}
