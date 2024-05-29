const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })

async function main() {
  await run('compile')

  let provider = ethers.provider

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)


  const network = (await ethers.provider.getNetwork()).chainId;
  console.log(network);


  let bfuel_address;
  switch (network) {
  case 5 :  
    bfuel_address = process.env.G_bfuel;
    break;
  case 963 :  
    bfuel_address = process.env.M_BFUEL;
    break;
  default: 
    bfuel_address = process.env.LOCAL_bfuel;
  }

  const bfuel = await ethers.getContractAt('BFuelToken', bfuel_address, deployer);

  // let addManageTx1 = await bfuel.addManage(deployer.address);
  // await addManageTx1.wait();

  let address = deployer.address
  let amount = ethers.utils.parseEther("0");
  console.log(amount);
  console.log(address);
  return;
  let tx = await bfuel.mint(address, amount);
  await tx.wait();
  console.log(tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
