// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract BNSRegistryMockup {
    struct Record {
        address owner;
        address resolver;
        // TODO set ttl
        // uint64 ttl;
    }

    mapping(bytes32 => Record) public records;
    mapping(address => mapping(address => bool)) public operators;

    constructor() {
        records[bytes32(0)].owner = msg.sender;
    }

    function setOwner(bytes32 node, address _owner) external authorised(node) {
        records[node].owner = _owner;
    }

    function setResolver(bytes32 node, address _resolver) external authorised(node) {
        records[node].resolver = _resolver;
    }

    // function setTTL(bytes32 node, uint64 ttl_) external authorised(node) {
    //     records[node].ttl = ttl_;
    // }

    function owner(bytes32 node) external view returns (address) {
        return records[node].owner;
    }

    function resolver(bytes32 node) external view returns (address) {
        return records[node].resolver;
    }

    // function ttl(bytes32 node) external view returns (uint64) {
    //     return records[node].ttl;
    // }

    function setApprovalForAll(address operator, bool approved) external {
        operators[msg.sender][operator] = approved;
    }

    function isApprovedForAll(address _owner, address operator) external view returns (bool) {
        return operators[_owner][operator];
    }

    modifier authorised(bytes32 node) {
        address _owner = records[node].owner;
        require(_owner == msg.sender || operators[_owner][msg.sender], "Not authorized");
        _;
    }
}