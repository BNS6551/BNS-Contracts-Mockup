const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const addrs = require("../constants/opbnb_addrs.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  const controller = await ethers.getContractAt("BNBRegistrarController", addrs.BNBRegistrarController);

  // ABI encode the function call
  const data = controller.interface.encodeFunctionData(
    "register",
    [
      "elvkdlee",
      "0x9a80ba749a649b2604d796e01d8a64cc7b58ff71",
      addrs.PublicResolver,
    ]
  );

  const nonce = await deployer.getTransactionCount();

  const rawTx = {
    nonce: nonce,
    to: addrs.BNBRegistrarController, // The contract address you're calling
    value: "100000000000000",
    gasLimit: 5000000,    // Adjust accordingly
    gasPrice: parseEther("0.00000002"),  // Adjust accordingly
    data: data
  };

  const receipt = await deployer.sendTransaction(rawTx);
  console.log("register hash:", receipt.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// register hash: 0x2d5ca3bf85bec88b65636c909a2140a6bcfc1d833ed0d769f17eb3f3be57dee7