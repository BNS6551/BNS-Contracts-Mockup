const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const addrs = require("../constants/opbnb_addrs.json");

// '0x6cfd528620a63815271d7110a4ac341944e8ff22425e8371e92c7f8e197c807d',
// '0x8f8ef5ed9fc410976318047ac04f0a4411c8e73f24e8cdfe742bf983149ae3ba',
// '0x9f6500417865be7a0a15ca86bdf2682e9b0d3f28407b31cd349fd0408262a899',

async function getTokenIdFromNodeHash(nodehash) {
  const resolver = await ethers.getContractAt("PublicResolver", addrs.PublicResolver);
  
  const { name } = await resolver.getBNSInfo(nodehash);
  const newName = name.replace(".opbnb", "");

  const label = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(newName));
  const tokenId = ethers.BigNumber.from(label);
  
  return tokenId;
}

async function main() {
  const [deployer] = await ethers.getSigners();

  const controller = await ethers.getContractAt("BNBRegistrarController", addrs.BNBRegistrarController);

  const tokenId = await getTokenIdFromNodeHash("0x8f8ef5ed9fc410976318047ac04f0a4411c8e73f24e8cdfe742bf983149ae3ba");

  // ABI encode the function call
  const data = controller.interface.encodeFunctionData(
    "bid",
    [
      tokenId,
    ]
  );

  const nonce = await deployer.getTransactionCount();

  const rawTx = {
    nonce: nonce,
    to: addrs.BNBRegistrarController, // The contract address you're calling
    value: "9800000000000000",
    gasLimit: 5000000,    // Adjust accordingly
    gasPrice: parseEther("0.000000002"),  // Adjust accordingly
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