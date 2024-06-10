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

  let boom_address = "0x8FD70f94790d06b8338b86eE776F6de7cb40Ea58";
  let pair_address = "0x4864A8833a42838A47E453d816B5212C80EA8e08";
  let vault_address = "0xbDb0f9DAedbE52941233D794F16404178dBd70Ee";


  const vault = await ethers.getContractAt('Vault', vault_address, deployer);
  // let tx = await vault.setBoomerang(boom_address);
  // await tx.wait();
  // console.log(tx.hash);



  let claimTx = await vault.claim();
  await claimTx.wait();
  console.log(claimTx.hash);

  let profit = await vault.profits(deployer.address);
  console.log(ethers.utils.formatEther(profit));

  let claimedAmount = await vault.claimed(deployer.address);
  console.log(ethers.utils.formatEther(claimedAmount));

  // let amount = ethers.utils.parseUnits("1500", 18);
  // let tx = await vault.addMemberValue(deployer.address, amount);
  // await tx.wait();
  // console.log(tx.hash);


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

