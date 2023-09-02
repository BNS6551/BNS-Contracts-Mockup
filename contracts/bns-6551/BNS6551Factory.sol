// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./BNS6551Account.sol";
import "./BNS6551Registry.sol";

contract BNS6551Factory is BNS6551Registry {
    event BNS6551AccountCreated(address indexed owner, address indexed account);

    function createBNS6551(
        address tokenContract,
        uint256 tokenId
    ) external returns (address) {
        address implementation = _createBNS6551Account(tokenContract, tokenId);
        bytes memory initData = "";

        return
            _createAccount(
                implementation,
                block.chainid,
                tokenContract,
                tokenId,
                0,
                initData
            );
    }

    function _createBNS6551Account(
        address tokenContract,
        uint256 tokenId
    ) internal returns (address) {
        uint256 chainId = block.chainid;

        // Encoding the constructor arguments
        bytes memory bytecode = abi.encodePacked(
            type(BNS6551Account).creationCode,
            abi.encode(chainId, tokenContract, tokenId)
        );

        address accountAddress;
        assembly {
            accountAddress := create(0, add(bytecode, 0x20), mload(bytecode))
        }

        require(
            accountAddress != address(0),
            "Failed to deploy BNS6551Account"
        );

        emit BNS6551AccountCreated(msg.sender, accountAddress);
        return accountAddress;
    }
}
