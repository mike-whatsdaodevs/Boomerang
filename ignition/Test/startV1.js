const { ethers, run } = require('hardhat')

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
  switch (network) {
  case 5:
    staking_address = process.env.G_PROXYV1;
    break;
  case 66666:
    staking_address = process.env.B_PROXYV1;
    break;
  case 963:
    staking_address = process.env.M_PROXYV1;
    break;
  default:
    staking_address = process.env.LOCAL_PROXYV1;
  }

  const staking = await ethers.getContractAt('StakingV1', staking_address, signer)

  let overrides = {
    value : ethers.utils.parseEther("20")
  }
  // start
  let startTx = await staking.start(overrides)
  console.log('startTx:' + startTx.hash)
  await startTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
