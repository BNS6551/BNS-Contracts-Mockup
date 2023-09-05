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
      "MG12",
      deployer.address,
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

// register hash: 0x1b279baf863c97d39d2a217314e8d61403d5617297df8c5f3260247c654ed828