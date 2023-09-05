const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const addrs = require("../constants/opbnb_addrs.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  const base = await ethers.getContractAt("BaseRegistrarImplementation", addrs.BaseRegistrarImplementation);

  // ABI encode the function call
  const data = base.interface.encodeFunctionData(
    "setController",
    [
      addrs.BNBRegistrarController
    ]
  );

  const nonce = await deployer.getTransactionCount();

  const rawTx = {
    nonce: nonce,
    to: addrs.BaseRegistrarImplementation, // The contract address you're calling
    gasLimit: 5000000,    // Adjust accordingly
    gasPrice: parseEther("0.00000002"),  // Adjust accordingly
    data: data
  };

  const receipt = await deployer.sendTransaction(rawTx);
  console.log("setController hash:", receipt.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// setController hash: 0x94afe526657585467291cba1c79056eed11b45eb0bf29401ec463fdf3747776e