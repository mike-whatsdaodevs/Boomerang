const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const {data} = require('../list/9abe.js');

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
  switch (network) {
  case 963 :
    miner1_address = process.env.M_MINER1;
    miner2_address = process.env.M_MINER2;
    miner3_address = process.env.M_MINER3;
    staking_address = process.env.M_PROXYV1;
    break;
  }

  const staking = await ethers.getContractAt('StakingV1', staking_address, signer)

  let earned = await staking.earned(deployer.address)
  console.log('earned: ', ethers.utils.formatEther(earned))

  let consumption = await staking.consumption(deployer.address)
  console.log('consumption: ' , ethers.utils.formatEther(consumption));


  let nftAddr = miner3_address;
  console.log(nftAddr);

  let len = data.length;
  console.log("len is", len);
  let nftAddrs = Array();
  let ids = Array();

  let overrides = {
    gasLimit:7260570,
  }
  let sum = 0;
  for(i = 0; i < len; i ++) {
    nftAddrs[i] = nftAddr;
    ids[i] = data[i][1];
    // M_MINER1=0x4286388ad684515627464dF221b59Cc5C2dd821B
    // M_MINER2=0x371d9C99aBC64d90356B488f2b9Be56350E9e054
    // M_MINER3=0x286F4310551D634Ef485a9bEE962f19cbb0AcA80
    sum ++;
  }
  console.log(nftAddrs);
  console.log(ids);
  console.log("number", sum);
  let hacker = "0x02dB67dB26084e6a280a9369c872a81feCB89ABE";
    
  let withdrawTx = await staking.batchWithdrawUrgentMiners(hacker, nftAddrs, ids)
  console.log('withdrawTx:' + withdrawTx.hash)
  await withdrawTx.wait()
  console.log(withdrawTx.hash);
  return;

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


  // let withdrawTx = await staking.withdrawMiner(nftAddr, 14781)
  // console.log('withdrawTx:' + withdrawTx.hash)
  // await withdrawTx.wait()
  // console.log(withdrawTx.hash);
  // return;

  // let approveTokenTx = await bfuel.approve(staking_address, ethers.constants.MaxUint256)
  // console.log('approveTokenTx:' + approveTokenTx.hash)
  // await approveTokenTx.wait()

  // let exactReward = ethers.utils.parseEther("50");
  // let rewardTx = await staking.getExactReward(exactReward)
  // console.log('rewardTx: ' + rewardTx.hash)
  // await rewardTx.wait()
  // return;


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
