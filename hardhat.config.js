require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PK;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{
      version: "0.8.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      },
    }],
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://opbnb-testnet-rpc.bnbchain.org",
      }
    },
    opbnb: {
      url: "https://opbnb-testnet-rpc.bnbchain.org",
      accounts: [PRIVATE_KEY],
    },
  }
};