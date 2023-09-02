const { ethers } = require("hardhat");
const { deploy } = require("../deploy");

const baseNode = ethers.utils.namehash("bnb");

async function main() {
  await deploy(baseNode);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
