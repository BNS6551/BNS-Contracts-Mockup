# BNS-Contracts-Mockup
The BNS-Contracts-Mockup repository contains the contracts for simulating the Binance Name Service (BNS) system, which provides human-readable names for blockchain addresses. This mockup allows users to test and interact with the BNS system in a simulated environment.

## ERC6551 Token Bound Account System
This repository contains the implementation of the ERC6551 Token Bound Account System, a novel system for ERC-721 tokens that allows each ERC-721 token to own assets and interact with applications, without requiring changes to existing ERC-721 smart contracts or infrastructure.

For more information about ERC6551, please refer to the official Ethereum Improvement Proposals (EIPs) site: [EIP-6551](https://eips.ethereum.org/EIPS/eip-6551)

### Introduction
ERC-721 tokens, also known as Non-Fungible Tokens (NFTs), are unique tokens that represent ownership of a specific item or asset on the blockchain. However, these tokens typically lack the ability to interact with other smart contracts or own assets. The ERC6551 system addresses this by binding a unique smart contract account to each ERC-721 token, enabling the token to interact with other contracts, hold assets, and more.

## BNBRegistrarController Contract
The BNBRegistrarController contract facilitates the registration and management of domain names. It allows users to register new names, place bids for a domain, transfer the ownership of a domain, and update the resolver associated with a domain.

Methods:
- `register(string memory name, address owner, address resolver, address addr)`: Allows users to register a new domain name.
- `bid(uint256 tokenId)`: Allows users to place a bid for a domain name.
- `endAuction(uint256 tokenId)`: Ends the auction for a domain name and transfers the NFT to the highest bidder.
- `withdraw()`: Allows the owner to withdraw the balance from the contract.
setEndOfYear(uint256 timestamp): Allows the owner to set the endOfYear timestamp.

## BaseRegistrarImplementation Contract
The `BaseRegistrarImplementation` contract is an ERC721 token that represents ownership of a domain. It allows the management of subdomains and the associated resolvers.

Methods:
- `setController(address _controller)`: Allows the owner to set the controller address.
- `setResolver(address resolver)`: Allows the owner to set the resolver address.
- `register(uint256 id, address owner)`: Registers a new subdomain.
- `reclaim(uint256 id, address owner)`: Reclaims the ownership of a subdomain.

## BNSRegistry Contract
The `BNSRegistry` contract is a key component of the Binance Name Service (BNS) system, which manages the ownership and resolution of domain names. The contract includes functions for setting the owner, resolver, and subnode owner of a domain name.

- `setRecord(bytes32 node, address _owner, address _resolver)`: Allows users to set the owner and resolver of a domain name.
setOwner(bytes32 node, address _owner): Allows users to set the owner of a domain name.
- `setSubnodeOwner(bytes32 node, bytes32 label, address _owner)`: Allows users to set the owner of a subdomain.
setResolver(bytes32 node, address _resolver): Allows users to set the resolver of a domain name.
- `setApprovalForAll(address operator, bool approved)`: Allows users to set the approval status of an operator.

## BNS6551Factory Contract
The `BNS6551Factory` contract is responsible for creating new BNS6551Account instances. It is a part of the BNS6551 Registry and extends its functionality to facilitate the creation of BNS6551 accounts.

Methods:
- `createBNS6551(address tokenContract, uint256 tokenId)`: Allows users to create a new BNS6551 account by providing the token contract address and token ID. It returns the address of the created account.

## BNS6551Account Contract
The BNS6551Account contract represents a single account in the BNS6551 system. Each account is associated with a specific ERC-721 token and is able to interact with other smart contracts and hold assets.
Methods:
- `executeCall(address to, uint256 value, bytes calldata data)`: Allows the token owner to execute a call to another contract.
- `token()`: Returns the chain ID, token contract address, and token ID associated with this account.
- `owner()`: Returns the address of the current owner of the associated token.
_ `supportsInterface(bytes4 interfaceId)`: Returns true if the contract implements interfaceId.
_ `isValidSignature(bytes32 hash, bytes memory signature)`: Validates a signature.

## BNS6551Registry Contract
The `BNS6551Registry` contract manages the creation of new BNS6551Account instances.

Methods:
- `createAccount(address implementation, uint256 chainId, address tokenContract, uint256 tokenId, uint256 salt, bytes calldata initData)`: Creates a new BNS6551Account instance.
- `account(address implementation, uint256 chainId, address tokenContract, uint256 tokenId, uint256 salt)`: Computes the address of the BNS6551Account instance associated with the provided parameters.

##  Dependencies
Please note that this repository does not have external dependencies. However, ensure that the Ethereum environment you're deploying to is compatible with the pragma solidity ^0.8.9 version.

## Setup and Usage
### 1. Installation:
Run npm install to install the necessary dependencies.
Clone the repository to your local system.
```
npm install
```
### 2. Deployment:
Run npx hardhat run scripts/deploy.js to compile the contracts using the Solidity compiler and deploy the BNBRegistrarController and BaseRegistrarImplementation contracts to your desired Ethereum network.
```
npx hardhat run scripts/bnb/1deploy.js
npx hardhat run scripts/opbnb/1deploy.js
```
## Conclusion
If you'd like to contribute to the project, please fork the repository, make your changes, and submit a pull request. We appreciate all contributions and feedback!