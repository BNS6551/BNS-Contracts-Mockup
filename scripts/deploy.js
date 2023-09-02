const { ethers } = require("hardhat");

async function deploy(baseNode) {
  let deployer;
  [deployer] = await ethers.getSigners();
  deployer = await ethers.getImpersonatedSigner("0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea");

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString() / 10 ** 18);

  // Deploy BNSRegistry
  const BNSRegistry = await ethers.getContractFactory("BNSRegistry");
  const bnsRegistry = await BNSRegistry.deploy();
  console.log("BNSRegistry address:", bnsRegistry.address);

  // Deploy BNS6551Factory
  const BNS6551Factory = await ethers.getContractFactory("BNS6551Factory");
  const factory = await BNS6551Factory.deploy();
  console.log("BNS6551Factory address:", factory.address);

  // Deploy BaseRegistrarImplementation
  const BaseRegistrar = await ethers.getContractFactory("BaseRegistrarImplementation");
  const baseRegistrar = await BaseRegistrar.deploy(bnsRegistry.address, factory.address, baseNode);
  console.log("BaseRegistrarImplementation address:", baseRegistrar.address);

  await bnsRegistry.setSubnodeOwner(ethers.constants.HashZero, ethers.utils.keccak256(ethers.utils.toUtf8Bytes('bnb')), baseRegistrar.address);

  // Deploy PublicResolver
  const PublicResolver = await ethers.getContractFactory("PublicResolver");
  const publicResolver = await PublicResolver.deploy(bnsRegistry.address);
  console.log("PublicResolver address:", publicResolver.address);

  const registrationFee = ethers.utils.parseEther("0.1");

  // Deploy BNBRegistrarController
  const BNBRegistrarController = await ethers.getContractFactory("BNBRegistrarController");
  const bnbRegistrarController = await BNBRegistrarController.deploy(baseRegistrar.address, baseNode, registrationFee);
  console.log("BNBRegistrarController address:", bnbRegistrarController.address);

  await baseRegistrar.setController(bnbRegistrarController.address);

  console.log("Deployment finished");
}

module.exports = { deploy };