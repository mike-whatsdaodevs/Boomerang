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

  // let staking_address = process.env.STAKING_TEST
  // let btcz_address = process.env.BTCZ_TEST

  let staking_address = process.env.STAKING_TEST
  let btcz_address = process.env.BTCZ_TEST
  let zfuel_address = process.env.ZWATT_TEST

  const staking = await ethers.getContractAt('ZStakingMigrate', staking_address, signer)

  let set_setFuelReceiver_tx = await staking.setFuelReceiver("0x34cCC892b67C873853D7a7050f5Df5B2781Bb8Ba");
  await set_setFuelReceiver_tx.wait();
  let fuelReceiver = await staking.fuelReceiver();
  console.log(fuelReceiver);


  // initEndTime
  let init_finish_tx = await staking.setPeriodFinishTime(1786797694)
  console.log('init_finish:' + init_finish_tx.hash)
  await init_finish_tx.wait()

  let setZFuelAddress_tx = await staking.setZFuelAddress(zfuel_address);
  await setZFuelAddress_tx.wait();
  console.log("set");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
