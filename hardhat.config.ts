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
        url: 'https://endpoints.omniatech.io/v1/arbitrum/sepolia/public',
        accounts: [`0x${PRIVATE_KEY}`],
        chainId: 421614,
      },
    },
    arbtest: {
      chainId: 421614,
      url: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
      accounts: [`0x${PRIVATE_KEY}`]
    },
  },
  etherscan: {
    apiKey: process.env.apiKey,
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  }
};

export default config;
