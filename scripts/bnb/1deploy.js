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
  
// Account balance: 0.19961441
// BNSRegistry address: 0x073EfC27ad791F735ca1EdF1F9cfe647B8D99aBf
// BNS6551Factory address: 0x872ACf446AA9DaA665EE3fA8Be034B3014b5492E
// BaseRegistrarImplementation address: 0x2fc8406A40116900C14e08e38D135124B63066CC
// - setSubnodeOwner hash: 0x38bdd9f4f8fe3650b59d05721017aba9cae7342ce7a4b711712037e4a20ab2e2
// PublicResolver address: 0xf4ED43C7F4f6739C6cf07ba7A1e8fdfCcb2e6f46
// BNBRegistrarController address: 0x735807c06323725D8C2B2aF1b990294419a2E378
// - setController hash: 0x684f7c0b812746fcf2c8634f10f2c45aea1bf73b4a18f59a98ae23a4425847a4
// Deployment finished