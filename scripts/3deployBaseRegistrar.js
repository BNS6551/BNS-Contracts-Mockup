const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const addrs = require("../constants/opbnb_addrs.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  const nonce = await deployer.getTransactionCount();

  const BaseRegistrar = await ethers.getContractFactory("BaseRegistrarImplementation");
  const bytecode = BaseRegistrar.bytecode;

  const BASE_NODE = ethers.utils.namehash("opbnb");

  // Encode the constructor argumentsF
  const constructorArgs = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "bytes32"],
    [addrs.BNSRegistry, addrs.BNS6551Factory, BASE_NODE]
  );

  const rawTx = {
    nonce: nonce,
    gasLimit: 3000000, // You might need to adjust this based on your contract's needs
    gasPrice: parseEther("0.000000002"), // 20 Gwei, adjust accordingly
    data: bytecode + constructorArgs.slice(2)
  };

  const receipt = await deployer.sendTransaction(rawTx);
  console.log("BaseRegistrar deployed to:", receipt.creates);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// BaseRegistrar deployed to: 0x13E3d53F499dd2d5200267699a437FC683dd8993