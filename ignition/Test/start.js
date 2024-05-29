const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)

  
  const network = (await ethers.provider.getNetwork()).chainId;
  console.log(network);

  let staking_address;
  let btcc_address;
  switch (network) {
  case 5:
    staking_address = process.env.G_PROXY;
    btcc_address = process.env.G_BTCC
    break;
  default:
    staking_address = process.env.LOCAL_PROXY;
    btcc_address = process.env.LOCAL_BTCC
  }

  const staking = await ethers.getContractAt('ZStaking', staking_address, signer)
  const token = await ethers.getContractAt('BTCCToken', btcc_address, signer)

  // totalSupply
  let totalSupply = await token.totalSupply()
  console.log('totalSupply:' + totalSupply)

  // amount
  let amount = await token.balanceOf(deployer.address)
  console.log('amount:' + amount)

  // approve
  let approveTx = await token.approve(staking_address, ethers.constants.MaxUint256);
  await approveTx.wait();

  // start
  let startTx = await staking.start()
  console.log('startTx:' + startTx.hash)
  await startTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
