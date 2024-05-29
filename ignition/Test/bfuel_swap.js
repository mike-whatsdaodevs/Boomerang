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


  let usdt_address;
  let bfuel_address;
  let bfuelswap_address
  switch (network) {
  case 5 :  
    usdt_address = process.env.G_bfuel;
    break;
  case 963 :  
    usdt_address = process.env.M_USDT;
    bfuelswap_address = process.env.M_BFUELSWAP;
    bfuel_address = process.env.M_BFUEL;
    break;
  default: 
    usdt_address = process.env.LOCAL_bfuel;
  }

  const usdt = await ethers.getContractAt('USDT', usdt_address, signer)
  const swap = await ethers.getContractAt('BFuelSwap', bfuelswap_address, signer)
  const bfuel = await ethers.getContractAt('BFuelToken', bfuel_address, signer)

  let swapBalance = await bfuel.balanceOf(bfuelswap_address);
  console.log(ethers.utils.formatEther(swapBalance));
  return;
  let addManageTx1 = await swap.addManage(deployer.address);
  await addManageTx1.wait();
  let takeBackBfuelTx = await swap.takeBackBfuel(deployer.address);
  await takeBackBfuelTx.wait();
  console.log(takeBackBfuelTx.hash);
  return;
  let allowance = await usdt.allowance(deployer.address, bfuelswap_address);
  let amount = ethers.utils.parseUnits("0.0125", 6);

  if(allowance > amount) {
     let approveTx = await bfuel.approve(bfuelswap_address, ethers.constants.MaxUint256);
     await approveTx.wait();
  }
  console.log(amount);
  let tx = await swap.swap(amount);
  await tx.wait();
  console.log(tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
