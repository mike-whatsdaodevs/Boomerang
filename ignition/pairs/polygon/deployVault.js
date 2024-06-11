// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const [deployer] = await ethers.getSigners()
  console.log('deployer:' + deployer.address)

  const network = (await ethers.provider.getNetwork()).chainId;
  console.log(network);

  let usdt_address = process.env.USDT;

  console.log("usdt_address is:", usdt_address);

  const Vault = await hre.ethers.getContractFactory('Vault')
  const vault = await Vault.deploy()
  await vault.deployed()
  console.log('vault deployed to:', vault.address);

  const initialize_data = await vault.populateTransaction.initialize(usdt_address);
  console.log("initialize_data data is",initialize_data)

  const BoomerangProxy = await hre.ethers.getContractFactory('BoomerangProxy')
  let proxy = await BoomerangProxy.deploy(vault.address, initialize_data.data);
  await proxy.deployed()
  console.log("proxy address is", proxy.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
