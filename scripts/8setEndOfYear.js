const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const addrs = require("../constants/opbnb_addrs.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  const controller = await ethers.getContractAt("BNBRegistrarController", addrs.BNBRegistrarController);

  // ABI encode the function call
  const data = controller.interface.encodeFunctionData(
    "setEndOfYear",
    [
      1704034799
    ]
  );

  const nonce = await deployer.getTransactionCount();

  const rawTx = {
    nonce: nonce,
    to: addrs.BNBRegistrarController, // The contract address you're calling
    gasLimit: 5000000,    // Adjust accordingly
    gasPrice: parseEther("0.00000002"),  // Adjust accordingly
    data: data
  };

  const receipt = await deployer.sendTransaction(rawTx);
  console.log("setEndOfYear hash:", receipt.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// setEndOfYear hash: 0xc0bdf96d582a02e66399488659c3a7a69a86400d5f3959cd1bec68a590d64b4e