const { ethers } = require("hardhat");
const { deploy } = require("../deploy");

const BASE_NODE = ethers.utils.namehash("bnb");
const GAS_INFO = {
  // maxPriorityFeePerGas: ethers.utils.parseUnits('5', 'gwei'),
  // maxFeePerGas: ethers.utils.parseUnits('5.000000009', 'gwei'),
  gasPrice: ethers.utils.parseUnits('5', 'gwei'),
  gasLimit: '3000000',
};

async function main() {
  await deploy(BASE_NODE, GAS_INFO);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
