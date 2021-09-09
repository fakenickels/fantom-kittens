require('dotenv').config({path: "./.env.local"})
require("@nomiclabs/hardhat-ethers");

if(process.env.CHAIN_SCAN_TOKEN) {
  require("@nomiclabs/hardhat-etherscan");
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './artifacts',
  },

  networks: {
    hardhat: {
      chainId: 1337
    },
    mainnet: {
      url: process.env.NETWORK_RPC,
      accounts: [`0x${process.env.WALLET_PK}`]
    },
    testnet: {
      url: `https://rpc.testnet.fantom.network/`,
      accounts: [`0x${process.env.WALLET_PK}`]
    },
  },
  
  etherscan: {
    apiKey: process.env.CHAIN_SCAN_TOKEN
  }
};