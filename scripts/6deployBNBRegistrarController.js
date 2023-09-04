const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const addrs = require("../constants/opbnb_addrs.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  const nonce = await deployer.getTransactionCount();

  const BNBRegistrarController = await ethers.getContractFactory("BNBRegistrarController");
  const bytecode = BNBRegistrarController.bytecode;

  const registrationFee = ethers.utils.parseEther("0.0001");

  // Encode the constructor argumentsF
  const constructorArgs = ethers.utils.defaultAbiCoder.encode(
    ["address", "string", "uint256"],
    [addrs.BaseRegistrarImplementation, "opbnb", registrationFee]
  );

  const rawTx = {
    nonce: nonce,
    gasLimit: 3000000, // You might need to adjust this based on your contract's needs
    gasPrice: parseEther("0.000000002"), // 20 Gwei, adjust accordingly
    data: bytecode + constructorArgs.slice(2)
  };

  const receipt = await deployer.sendTransaction(rawTx);
  console.log("BNBRegistrarController deployed to:", receipt.creates);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// BNBRegistrarController deployed to: 0xF55e7fcA5fdBcf0030e6D1760761ae791b22E0Bf