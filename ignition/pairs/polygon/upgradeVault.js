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

  let proxy_address = process.env.VAULT;

  console.log("proxy_address is:", proxy_address);

  const Vault = await hre.ethers.getContractFactory('Vault')
  const vault = await Vault.deploy()
  await vault.deployed()
  console.log('vault deployed to:', vault.address);
  
  let implement_address = vault.address;
  const proxy = await ethers.getContractAt('Vault', proxy_address, deployer)
  console.log("proxy address is:", proxy_address);

  let upgradeToTx = await proxy.upgradeTo(implement_address);
  await upgradeToTx.wait();

  console.log(upgradeToTx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })



