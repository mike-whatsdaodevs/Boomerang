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

  let miner1_address;
  let miner2_address;
  let miner3_address;
  let staking_address;
  let stakingV1_address;
  let bfuel_address;
  switch (network) {
  case 5 :
    miner1_address = process.env.G_MINER1;
    miner2_address = process.env.G_MINER2;
    miner3_address = process.env.G_MINER3;
    staking_address = process.env.G_PROXY;
    stakingV1_address = process.env.G_PROXYV1;
    bfuel_address = process.env.G_BFUEL;
    break;
  case 66666 :
    miner1_address = process.env.B_MINER1;
    miner2_address = process.env.B_MINER2;
    miner3_address = process.env.B_MINER3;
    staking_address = process.env.B_PROXY;
    stakingV1_address = process.env.B_PROXYV1;
    bfuel_address = process.env.B_BFUEL;
    break;
  case 963 :
    miner1_address = process.env.M_MINER1;
    miner2_address = process.env.M_MINER2;
    miner3_address = process.env.M_MINER3;
    stakingV1_address = process.env.M_PROXYV1;
    bfuel_address = process.env.M_BFUEL;
    break;
  default: 
    miner1_address = process.env.LOCAL_MINER1;
    miner2_address = process.env.LOCAL_MINER2;
    miner3_address = process.env.LOCAL_MINER3;
    stakingV1_address = process.env.LOCAL_PROXYV1;
    bfuel_address = process.env.LOCAL_BFUEL;
  }

  let nftAddr = miner1_address;
  staking_address = stakingV1_address;
  const staking = await ethers.getContractAt('Staking', staking_address, signer)
  const miner = await ethers.getContractAt('NFTMiner', nftAddr, signer)
  const bfuel = await ethers.getContractAt('BFuelToken', bfuel_address, signer)

  // let withdrawAllMinersTx = await staking.withdrawAllMiners()
  // console.log('withdrawAllMinersTx:' + withdrawAllMinersTx.hash)
  // await withdrawAllMinersTx.wait()

  // return;

 
  let earned = await staking.earned(deployer.address)
  console.log('earned: ', ethers.utils.formatEther(earned))

  let consumption = await staking.consumption(deployer.address)
  console.log('consumption: ' , ethers.utils.formatEther(consumption));

  
  // const tx = await signer.sendTransaction({
  //   to: staking_address,
  //   value: ethers.utils.parseEther("200.0")
  // });
  // await tx.wait();
  // console.log("done");
  // return;

  
  // let minerAmountOf = await staking.minerAmountOf(deployer.address)
  // console.log('minerAmountOf: ' + minerAmountOf)

  // // amount
  // // let amount = await token.balanceOf(deployer.address)
  // // console.log('amount: ' + amount)
  // // approve
  // let approveTx = await token.approve(staking_address, ethers.constants.MaxUint256)
  // console.log('approveTx: ' + approveTx.hash)
  // await approveTx.wait()

  // let rewardTx = await staking.getReward()
  // console.log('rewardTx: ' + rewardTx.hash)
  // await rewardTx.wait()


  // let earned1 = await staking.earned(deployer.address)
  // console.log('earned: ', ethers.utils.formatEther(earned1))

  // let consumption1 = await staking.consumption(deployer.address)
  // console.log('consumption: ' , ethers.utils.formatEther(consumption1))

  // approve
  // let approveTokenTx = await bfuel.approve(staking_address, ethers.constants.MaxUint256)
  // console.log('approveTokenTx:' + approveTokenTx.hash)
  // await approveTokenTx.wait()

  let withdrawTx = await staking.withdrawMiner(nftAddr, 6819)
  console.log('withdrawTx:' + withdrawTx.hash)
  await withdrawTx.wait()
  console.log(withdrawTx.hash);

  //   let rewardTx = await staking.getReward()
  // console.log('rewardTx: ' + rewardTx.hash)
  // await rewardTx.wait()
  return;


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
