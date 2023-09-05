const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const addrs = require("../constants/opbnb_addrs.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  const nonce = await deployer.getTransactionCount();

  const PublicResolver = await ethers.getContractFactory("PublicResolver");
  const bytecode = PublicResolver.bytecode;

  // Encode the constructor argumentsF
  const constructorArgs = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [addrs.BNSRegistry]
  );

  const rawTx = {
    nonce: nonce,
    gasLimit: 3000000, // You might need to adjust this based on your contract's needs
    gasPrice: parseEther("0.000000002"), // 20 Gwei, adjust accordingly
    data: bytecode + constructorArgs.slice(2)
  };

  const receipt = await deployer.sendTransaction(rawTx);
  console.log("PublicResolver deployed to:", receipt.creates);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// PublicResolver deployed to: 0xc522Ba77ca9f35f2b75B9d1aA383E5BF12069982