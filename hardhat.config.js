require('@nomiclabs/hardhat-waffle')
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            }
        },
      },
    ]
  },
  networks: {
    eth: {
      url: "https://eth.llamarpc.com",
      accounts: 
        process.env.PRIVATE_KEY_BOOM !== undefined ? [process.env.PRIVATE_KEY_BOOM] : [],
    },
    polygon: {
      url: "https://polygon.meowrpc.com",
      accounts: 
        process.env.PRIVATE_KEY_BOOM !== undefined ? [process.env.PRIVATE_KEY_BOOM] : [],
    },
    local: {
      url: process.env.LOCAL,
      accounts: 
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      forking: {
        // url: process.env.ETH,
        url: "https://polygon-mainnet.infura.io/v3/a9888517f076475d805eae5283c7c007",
      }
    }
  },
  mocha: {
    timeout: 40000,
  },
  etherscan: {
    apiKey: "MJMBRAPTDNIJKSCVRUC8C6RRMWAW7WIKKS"
  }

}
