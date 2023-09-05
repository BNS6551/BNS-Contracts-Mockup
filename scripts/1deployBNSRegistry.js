const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

async function main() {
  const [deployer] = await ethers.getSigners();

  const nonce = await deployer.getTransactionCount();

  const BNSRegistry = await ethers.getContractFactory("BNSRegistry");
  const bytecode = BNSRegistry.bytecode;

  const rawTx = {
    nonce: nonce,
    gasLimit: 3000000, // You might need to adjust this based on your contract's needs
    gasPrice: parseEther("0.000000002"), // 20 Gwei, adjust accordingly
    data: bytecode
  };

  const receipt = await deployer.sendTransaction(rawTx);
  console.log("BNSRegistry deployed to:", receipt.creates);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// BNSRegistry deployed to: 0xfAD9508A1158286f1EBE19b1D803c774A0Af20B4