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

  // 0x4BE6339E1480761e650D2F2Eb27a702dD458654A
  let provider = ethers.provider
  const [signer] = await ethers.getSigners()
  let my_address = signer.address;
  console.log('my_address is:', my_address)

  let uniV3_facotry_address = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
  let weth9_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

  const Boomerang = await hre.ethers.getContractFactory('Boomerang')
  const obj = await Boomerang.deploy(facotry_address, weth9_address);
  await obj.deployed()
  console.log('Boomerang deployed to:', obj.address)
  return;

  // 0xf67394B56827246644359D4A3fc0D817dF8E90c0

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
