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

// setSubnodeOwner hash: 0x23c362acbde924677a51d0f7f5406e6c863048c21efdcd3e696da6b3ac1ae129