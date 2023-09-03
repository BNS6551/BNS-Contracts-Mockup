const { ethers } = require("hardhat");

async function deploy(BASE_NODE, GAS_INFO) {
  let deployer;
  [deployer] = await ethers.getSigners();
  // deployer = await ethers.getImpersonatedSigner("0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea");

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString() / 10 ** 18);

  // Deploy BNSRegistry
  const BNSRegistry = await ethers.getContractFactory("BNSRegistry", deployer);
  const bnsRegistry = await BNSRegistry.deploy(GAS_INFO);
  await bnsRegistry.deployed();
  console.log("BNSRegistry address:", bnsRegistry.address);

  // Deploy BNS6551Factory
  const BNS6551Factory = await ethers.getContractFactory("BNS6551Factory", deployer);
  const factory = await BNS6551Factory.deploy(GAS_INFO);
  await factory.deployed();
  console.log("BNS6551Factory address:", factory.address);

  // Deploy BaseRegistrarImplementation
  const BaseRegistrar = await ethers.getContractFactory("BaseRegistrarImplementation", deployer);
  const baseRegistrar = await BaseRegistrar.deploy(bnsRegistry.address, factory.address, BASE_NODE, GAS_INFO);
  await baseRegistrar.deployed();
  console.log("BaseRegistrarImplementation address:", baseRegistrar.address);

  tx = await bnsRegistry.connect(deployer).setSubnodeOwner(ethers.constants.HashZero, ethers.utils.keccak256(ethers.utils.toUtf8Bytes('bnb')), baseRegistrar.address, GAS_INFO);
  await tx.wait();
  console.log("- setSubnodeOwner hash:", tx.hash);

  // Deploy PublicResolver
  const PublicResolver = await ethers.getContractFactory("PublicResolver", deployer);
  const publicResolver = await PublicResolver.deploy(bnsRegistry.address, GAS_INFO);
  await publicResolver.deployed();
  console.log("PublicResolver address:", publicResolver.address);

  const registrationFee = ethers.utils.parseEther("0.0001");

  // Deploy BNBRegistrarController
  const BNBRegistrarController = await ethers.getContractFactory("BNBRegistrarController", deployer);
  const bnbRegistrarController = await BNBRegistrarController.deploy(baseRegistrar.address, BASE_NODE, registrationFee, GAS_INFO);
  await bnbRegistrarController.deployed();
  console.log("BNBRegistrarController address:", bnbRegistrarController.address);

  tx = await baseRegistrar.connect(deployer).setController(bnbRegistrarController.address, GAS_INFO);
  await tx.wait();
  console.log("- setController hash:", tx.hash);

  console.log("Deployment finished");
}

module.exports = { deploy };