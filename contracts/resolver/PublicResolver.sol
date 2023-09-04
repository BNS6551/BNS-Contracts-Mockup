// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../registry/BNSRegistry.sol";

contract PublicResolver {
    BNSRegistry public bns;

    mapping(bytes32 => address) public addresses;
    mapping(bytes32 => string) public names;
    mapping(bytes32 => string) public caNames;
    mapping(bytes32 => string) public eoaNames;

    struct BNSInfo {
        address owner;
        string name;
        string caName;
        string eoaName;
    }

    constructor(address bnsAddr) {
        bns = BNSRegistry(bnsAddr);
    }

    function setAddress(
        bytes32 node,
        address _address
    ) external authorised(node) {
        addresses[node] = _address;
    }

    function setName(
        bytes32 node,
        string calldata _name
    ) external authorised(node) {
        names[node] = _name;
    }

    function setCaName(
        bytes32 node,
        string calldata _name
    ) external authorised(node) {
        caNames[node] = _name;
    }

    function setEoaName(
        bytes32 node,
        string calldata _name
    ) external authorised(node) {
        eoaNames[node] = _name;
    }

    function addr(bytes32 node) external view returns (address) {
        return addresses[node];
    }

    function name(bytes32 node) external view returns (string memory) {
        return names[node];
    }

    function caName(bytes32 node) external view returns (string memory) {
        return caNames[node];
    }

    function eoaName(bytes32 node) external view returns (string memory) {
        return eoaNames[node];
    }

    function getBNSInfo(
        bytes32 node
    ) external view returns (BNSInfo memory bnsInfo) {
        bnsInfo.owner = addresses[node];
        bnsInfo.name = names[node];
        bnsInfo.caName = caNames[node];
        bnsInfo.eoaName = eoaNames[node];
    }

    modifier authorised(bytes32 node) {
        require(
            bns.owner(node) == msg.sender ||
                bns.isApprovedForAll(bns.owner(node), msg.sender),
            "PublicResolver::authorised: Not authorized"
        );
        _;
    }
}
