require('dotenv').config();
require('@nomiclabs/hardhat-waffle');
require('@nomicfoundation/hardhat-verify');
require('solidity-coverage');
require('hardhat-gas-reporter');
const PRIVATE_KEY = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  gasReporter: {
    enabled: true,
  },
  networks: {
    // hardhat: {
    //   forking: {
    //     url: 'https://polygon-rpc.com',
    //     accounts: [`0x${PRIVATE_KEY}`],
    //   },
    // },
    localhost: {
      url: 'http://localhost:8545', // uses account 0 of the hardhat node to deploy
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 30000000000, //30 gwei
    },
    polygon: {
      url: 'https://polygon-rpc.com',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 170000000000, // 170 gwei
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
