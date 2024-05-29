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

  let my_address = deployer.address;
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
    break;
  case 963 :
    miner1_address = process.env.M_MINER1;
    miner2_address = process.env.M_MINER2;
    miner3_address = process.env.M_MINER3;
    staking_address = process.env.M_PROXY;
    stakingV1_address = process.env.M_PROXYV1;
    bfuel_address = process.env.M_BFUEL;
    break;
  default: 
    miner1_address = process.env.LOCAL_MINER1;
    miner2_address = process.env.LOCAL_MINER2;
    miner3_address = process.env.LOCAL_MINER3;
    staking_address = process.env.LOCAL_PROXY;
    stakingV1_address = process.env.LOCAL_PROXYV1;
  }

  let nftAddr = miner1_address;
  staking_address = stakingV1_address;
  const staking = await ethers.getContractAt('StakingV1', staking_address, signer)
  const miner = await ethers.getContractAt('NFTMiner', nftAddr, signer)
  const bfuel = await ethers.getContractAt('BFuelToken', bfuel_address, signer)


  my_address = "0x7f322012d76115A12d127baCD34c86E19D33FfC7";

  const stakedMiner1 = [];
  const stakedMiner2 = [];
  const stakedMiner3 = [];
  // let rewardRate = await staking.rewardRate()
  // console.log('rewardRate: ' + rewardRate)

  // let earned = await staking.earned(my_address)
  // console.log('earned: ', ethers.utils.formatEther(earned.toString()));

  // let consumption = await staking.consumption(my_address)
  // console.log('consumption: ' , ethers.utils.formatEther(consumption.toString()))

  // let bfuelBalance = await bfuel.balanceOf(my_address);
  // console.log('bfuelBalance: ' , ethers.utils.formatEther(bfuelBalance.toString()))

  // let allowance = await bfuel.allowance(my_address, staking_address);
  // console.log('allowance: ' , ethers.utils.formatEther(allowance.toString()))

  let miner1AmountOf = await staking.minerAmountOf(miner1_address, my_address)
  console.log('miner1AmountOf: ' + miner1AmountOf)

  for(let m1 = 0; m1 < miner1AmountOf; m1 ++) {
    let m1TokenId = await staking.minerOfOwnerByIndex(miner1_address, my_address, m1);

    // console.log(m1TokenId);
    stakedMiner1.push(m1TokenId);
  }

  let miner2AmountOf = await staking.minerAmountOf(miner2_address, my_address)
  console.log('miner2AmountOf: ' + miner2AmountOf)


  for(let m2 = 0; m2 < miner2AmountOf; m2 ++) {
    let m2TokenId = await staking.minerOfOwnerByIndex(miner2_address, my_address, m2);

   // console.log(m2TokenId);
    stakedMiner2.push(m2TokenId);
  }


  let miner3AmountOf = await staking.minerAmountOf(miner3_address, my_address)
  console.log('miner3AmountOf: ' + miner3AmountOf)


  for(let m3 = 0; m3 < miner3AmountOf; m3 ++) {
    let m3TokenId = await staking.minerOfOwnerByIndex(miner3_address, my_address, m3);

    //console.log(m3TokenId);
    stakedMiner3.push(m3TokenId);
  }

  console.log(Object.keys(stakedMiner1)); 


  console.log(Object.keys(stakedMiner2)); 

  console.log(Object.keys(stakedMiner3)); 
  return;

  let totalHashRate = await staking.totalHashRate()
  console.log('totalHashRate is: ', totalHashRate)

  let myHashRate = await staking.hashRateOf(my_address)
  console.log('myHashRate is: ', myHashRate)

  let rewardPerToken = await staking.rewardPerToken();
  console.log("rewardPerToken is", rewardPerToken);

  let consumptionPerToken = await staking.consumptionPerToken();
  console.log("consumptionPerToken is", consumptionPerToken);

  let userRewardPerHashRatePaid = await staking.userRewardPerHashRatePaid(my_address);
  console.log("userRewardPerHashRatePaid is", userRewardPerHashRatePaid)

  let myRewards = await staking.rewards(my_address);
  console.log("my rewards is", myRewards);

  let lastTimeRewardApplicable = await staking.lastTimeRewardApplicable();
  let periodFinish = await staking.periodFinish();
  console.log("lastTimeRewardApplicable is,", lastTimeRewardApplicable);
  console.log("periodFinish is,", periodFinish);


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

  // return;

  // approve
  // let approveTokenTx = await token.approve(process.env.STAKING, consumption)
  // console.log('approveTokenTx:' + approveTokenTx.hash)
  // await approveTokenTx.wait()

  // let withdrawTx = await staking.withdrawMiner(4)
  // console.log('withdrawTx:' + withdrawTx.hash)
  // await withdrawTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
