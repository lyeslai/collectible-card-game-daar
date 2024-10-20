import 'dotenv/config'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'hardhat-abi-exporter'

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true
          },
        },
      },
    ],
  },

  paths: {
    deploy: './deploy/deployer',
    sources: './src',
  },
  namedAccounts: {
    deployer: { default: 0 }
  },
  abiExporter: [{
    runOnCompile: true,
    path: '../frontend/src/abis',
    clear: true,
    flat: true,
    only: [],
    pretty: true,
  }, {
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    pretty: true,
  }],
  typechain: {
    outDir: '../typechain',
  },
}

export default config
