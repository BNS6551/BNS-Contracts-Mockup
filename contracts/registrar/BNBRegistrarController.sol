// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {BaseRegistrarImplementation as BaseRegistrar} from "./BaseRegistrarImplementation.sol";
import {PublicResolver as Resolver} from "../resolver/PublicResolver.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BNBRegistrarController is Ownable {
    using Strings for *;

    BaseRegistrar base;
    string public baseName;

    uint256 public registrationFee;

    mapping(uint256 => uint256) public highestBid;
    mapping(uint256 => address) public highestBidder;

    uint256 public endOfYear;

    constructor(
        BaseRegistrar _base,
        string memory _baseName,
        uint256 _registrationFee
    ) {
        base = _base;
        baseName = _baseName;
        registrationFee = _registrationFee;
    }

    function register(
        string memory name,
        address owner,
        address resolver,
        address addr
    ) public payable {
        require(
            registrationFee == msg.value,
            "Controller::register: Incorrect registration fee"
        );

        bytes32 label = keccak256(bytes(name));
        uint256 tokenId = uint256(label);

        base.register(tokenId, address(this));

        bytes32 nodehash = keccak256(abi.encodePacked(base.baseNode(), label));

        base.bns().setResolver(nodehash, resolver);

        Resolver(resolver).setAddress(nodehash, addr);

        string memory fullName = string(abi.encodePacked(name, ".", baseName));
        string memory caFullName = string(
            abi.encodePacked("ca.", name, ".", baseName)
        );
        Resolver(resolver).setName(nodehash, fullName);
        Resolver(resolver).setCaName(nodehash, caFullName);

        base.reclaim(tokenId, owner);
        base.transferFrom(address(this), owner, tokenId);
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function bid(uint256 tokenId) public payable {
        require(
            block.timestamp < endOfYear,
            "Controller::bid: Registration is closed for the year"
        );
        require(
            msg.value > highestBid[tokenId],
            "Controller::bid: Bid is lower than or equal to the current highest bid"
        );

        if (highestBid[tokenId] > 0) {
            payable(highestBidder[tokenId]).transfer(highestBid[tokenId]);
        }

        highestBid[tokenId] = msg.value;
        highestBidder[tokenId] = msg.sender;
    }

    function endAuction(uint256 tokenId) public {
        require(
            block.timestamp >= endOfYear,
            "Controller::endAuction: Registration is not yet open for the year"
        );

        base.transfer(tokenId, highestBidder[tokenId]);

        highestBid[tokenId] = 0;
        highestBidder[tokenId] = address(0);
    }

    function setEndOfYear(uint256 timestamp) external onlyOwner {
        endOfYear = timestamp;
    }
}
