const { ethers, run } = require('hardhat')

async function main() {
  await run('compile')

  let provider = ethers.provider

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)

  let proxy_address = process.env.M_NODE;

  const node = await ethers.getContractAt('NodeStakingRewards', proxy_address, deployer)

  // let tx = await node.setRewardRate(761);
  // await tx.wait();
  // console.log(tx.hash);

  // let rewardRate = await node.rewardRate();
  // console.log(rewardRate);

  // let balance = await node.balanceOf("0x98fF6e185bFAD21C2DE62B607077059ff6955d35");
  // console.log(ethers.utils.formatEther("76100000000000"));

  let time = await node.lastTimeRewardApplicable();
  console.log(time);
  let owner = await node.earned("0x8487F3BB028b340C06eBF5Aa10f3fBD7dAEecBa8");
  console.log(ethers.utils.formatEther(owner));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

0.0004026