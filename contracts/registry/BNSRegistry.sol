// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract BNSRegistry {
    struct Record {
        address owner;
        address resolver;
    }

    mapping(bytes32 => Record) records;
    mapping(address => mapping(address => bool)) operators;

    constructor() {
        records[0x0].owner = msg.sender;
    }

    function setRecord(
        bytes32 node,
        address _owner,
        address _resolver
    ) external virtual {
        setOwner(node, _owner);
        _setResolver(node, _resolver);
    }

    function setOwner(
        bytes32 node,
        address _owner
    ) public virtual authorised(node) {
        _setOwner(node, _owner);
    }

    function setSubnodeOwner(
        bytes32 node,
        bytes32 label,
        address _owner
    ) public virtual authorised(node) returns (bytes32) {
        bytes32 subnode = keccak256(abi.encodePacked(node, label));
        _setOwner(subnode, _owner);
        return subnode;
    }

    function setResolver(
        bytes32 node,
        address _resolver
    ) public virtual authorised(node) {
        records[node].resolver = _resolver;
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) external virtual {
        operators[msg.sender][operator] = approved;
    }

    function owner(bytes32 node) public view virtual returns (address) {
        address addr = records[node].owner;
        if (addr == address(this)) {
            return address(0x0);
        }

        return addr;
    }

    function resolver(bytes32 node) public view virtual returns (address) {
        return records[node].resolver;
    }

    function recordExists(bytes32 node) public view virtual returns (bool) {
        return records[node].owner != address(0x0);
    }

    function isApprovedForAll(
        address _owner,
        address operator
    ) external view virtual returns (bool) {
        return operators[_owner][operator];
    }

    function _setOwner(bytes32 node, address _owner) internal virtual {
        records[node].owner = _owner;
    }

    function _setResolver(bytes32 node, address _resolver) internal {
        if (_resolver != records[node].resolver) {
            records[node].resolver = _resolver;
        }
    }

    modifier authorised(bytes32 node) {
        address _owner = records[node].owner;
        require(_owner == msg.sender || operators[_owner][msg.sender]);
        _;
    }
}
