import dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import '@nomicfoundation/hardhat-verify';
import 'solidity-coverage';
import 'hardhat-gas-reporter';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  gasReporter: {
    enabled: true,
  },
  networks: {
    hardhat: { 
      forking: {
        enabled:false,
        url: 'https://testnet.ten.xyz/v1/?token=af0bc4b4b078d6f99c1e043eda61ad0d2e5c08dd',
        accounts: [`0x${PRIVATE_KEY}`],
        chainId: 443,
      },
    },
    tentest: {
      chainId: 443,
      url: 'https://testnet.ten.xyz/v1/?token=af0bc4b4b078d6f99c1e043eda61ad0d2e5c08dd',
      accounts: [`0x${PRIVATE_KEY}`]
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;
