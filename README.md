# BNS-Contracts-Mockup
The BNS-Contracts-Mockup repository contains the contracts for simulating the Binance Name Service (BNS) system, which provides human-readable names for blockchain addresses. This mockup allows users to test and interact with the BNS system in a simulated environment.

## BNBRegistrarController Contract
The BNBRegistrarController contract facilitates the registration and management of domain names. It allows users to register new names, place bids for a domain, transfer the ownership of a domain, and update the resolver associated with a domain.

Methods:
- register(string memory name, address owner, address resolver, address addr): Allows users to register a new domain name.
- bid(uint256 tokenId): Allows users to place a bid for a domain name.
- endAuction(uint256 tokenId): Ends the auction for a domain name and transfers the NFT to the highest bidder.
- withdraw(): Allows the owner to withdraw the balance from the contract.
setEndOfYear(uint256 timestamp): Allows the owner to set the endOfYear timestamp.

## BaseRegistrarImplementation Contract
The BaseRegistrarImplementation contract is an ERC721 token that represents ownership of a domain. It allows the management of subdomains and the associated resolvers.

Methods:
- setController(address _controller): Allows the owner to set the controller address.
- setResolver(address resolver): Allows the owner to set the resolver address.
- register(uint256 id, address owner): Registers a new subdomain.
- reclaim(uint256 id, address owner): Reclaims the ownership of a subdomain.

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