require("dotenv").config({ path: "./.env.local" });
require("@nomiclabs/hardhat-ethers");

if (process.env.CHAIN_SCAN_TOKEN) {
  require("@nomiclabs/hardhat-etherscan");
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
if (process.env.CHAIN_SCAN_TOKEN) {
  module.exports = {
    solidity: "0.8.4",
    paths: {
      artifacts: "./artifacts",
    },

    networks: {
      hardhat: {
        chainId: 1337,
        forking: {
          url: "https://rpc.ftm.tools/",
          blockNumber: 24066833,
        },
      },
      mainnet: {
        url: process.env.NETWORK_RPC,
        accounts: [`0x${process.env.WALLET_PK}`],
      },
      testnet: {
        url: `https://rpc.testnet.fantom.network/`,
        accounts: [`0x${process.env.WALLET_PK}`],
      },
    },

    etherscan: {
      apiKey: process.env.CHAIN_SCAN_TOKEN,
    },
  };
} else {
  module.exports = {
    solidity: "0.8.4",
    paths: {
      artifacts: "./artifacts",
    },
  };
}
