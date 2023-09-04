const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

async function main() {
  const [deployer] = await ethers.getSigners();

  const nonce = await deployer.getTransactionCount();

  const BNS6551Factory = await ethers.getContractFactory("BNS6551Factory");
  const bytecode = BNS6551Factory.bytecode;

  const rawTx = {
    nonce: nonce,
    gasLimit: 3000000, // You might need to adjust this based on your contract's needs
    gasPrice: parseEther("0.000000002"), // 20 Gwei, adjust accordingly
    data: bytecode
  };

  const receipt = await deployer.sendTransaction(rawTx);
  console.log("BNS6551Factory deployed to:", receipt.creates);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// BNS6551Factory deployed to: 0xD693d08BE428127d2Ef6496c01cc606E44B28fe3