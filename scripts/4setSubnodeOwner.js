const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const addrs = require("../constants/opbnb_addrs.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  const bnsRegistry = await ethers.getContractAt("BNSRegistry", addrs.BNSRegistry);

  // ABI encode the function call
  const data = bnsRegistry.interface.encodeFunctionData(
    "setSubnodeOwner",
    [
      ethers.constants.HashZero,
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('opbnb')),
      addrs.BaseRegistrarImplementation
    ]
  );

  const nonce = await deployer.getTransactionCount();

  const rawTx = {
    nonce: nonce,
    to: addrs.BNSRegistry, // The contract address you're calling
    gasLimit: 5000000,    // Adjust accordingly
    gasPrice: parseEther("0.00000002"),  // Adjust accordingly
    data: data
  };

  const receipt = await deployer.sendTransaction(rawTx);
  console.log("BaseRegistrar hash:", receipt.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// setSubnodeOwner hash: 0x7579f4d9215626bc7957e1c26e76275edda75627af231f7499f3b8eefc09ea2e