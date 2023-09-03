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

// Deploying contracts with the account: 0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea
// Account balance: 0.155494495
// BNSRegistry address: 0xfe5Fe2110C9A903Ad898C8e13e1C0024Ee062aC6
// BNS6551Factory address: 0x52de59066cbc56eb7Ce1FE99208E910e54c8f823
// BaseRegistrarImplementation address: 0xCfC0306a3834857E764aFDa39bbeAF71952EfDfC
// - setSubnodeOwner hash: 0x7deae2c9bba7e3272f52271f51f2c1c2cbc35712c25af81c1543cda91d319bc8
// PublicResolver address: 0xD4492b91e042422dcd57D12150b2b87343915B90
// BNBRegistrarController address: 0x1B750FA3F897E09409af47d661493b8e61b5cB33
// - setController hash: 0xb33db434b18b36ebb4578ca4d1cdf765ffefe016476cce1d7eeecc33e77a78a6
// Deployment finished