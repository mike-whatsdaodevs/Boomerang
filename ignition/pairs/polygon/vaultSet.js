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

  let boom_address = process.env.BOOM_MAIN;
  let pair_address = process.env.WMATIC_USDT_PAIR;
  let vault_address = process.env.VAULT;

  const vault = await ethers.getContractAt('Vault', vault_address, deployer);

  // let syncTx = await vault.sync();
  // await syncTx.wait();
  // console.log(syncTx.hash);
  // return;
  // let setBoomerangTx = await vault.setBoomerang(boom_address);
  // await setBoomerangTx.wait();
  // console.log(setBoomerangTx.hash);
  // return;

  // let amount = ethers.utils.parseUnits("1500", 18);
  // let addMemberValueTx = await vault.addMemberValue(deployer.address, amount);
  // await addMemberValueTx.wait();
  // console.log(addMemberValueTx.hash);
  // return;

  // let claimTx = await vault.claim();
  // await claimTx.wait();
  // console.log(claimTx.hash);

  let profit = await vault.profits(deployer.address);
  console.log(ethers.utils.formatUnits(profit, 6));

  let claimedAmount = await vault.claimed(deployer.address);
  console.log(ethers.utils.formatUnits(claimedAmount, 6));

  console.log(await vault.totalProfit());
  console.log(await vault.totalClaimed());




}

async function buildPath(poolsPrice, tokenIn, tokenOut, fee) {
  return await poolsPrice.getSinglePath(tokenIn, tokenOut, fee);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

