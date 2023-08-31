// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../registry/BNSRegistry.sol";

contract PublicResolver {
    BNSRegistry public bns;

    mapping(bytes32 => address) public addresses;
    mapping(bytes32 => string) public names;

    constructor(address bnsAddr) {
        bns = BNSRegistry(bnsAddr);
    }

    function setName(
        bytes32 node,
        string calldata _name
    ) external authorised(node) {
        names[node] = _name;
    }

    function setAddress(
        bytes32 node,
        address _address
    ) external authorised(node) {
        addresses[node] = _address;
    }

    function name(bytes32 node) external view returns (string memory) {
        return names[node];
    }

    function addr(bytes32 node) external view returns (address) {
        return addresses[node];
    }

    modifier authorised(bytes32 node) {
        require(
            bns.owner(node) == msg.sender ||
                bns.isApprovedForAll(bns.owner(node), msg.sender),
            "Not authorized"
        );
        _;
    }
}
