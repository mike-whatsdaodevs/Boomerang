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


  let bfuel_address;
  let bridge_address;
  switch (network) {
  case 66666 :  
    bfuel_address = process.env.B_BFUEL;
    bridge_address = process.env.B_BRIDGE;
    break;
  case 963 :
    bfuel_address = process.env.M_BFUEL;
    bridge_address = process.env.M_BRIDGE;
    break;
  default: 
    bfuel_address = process.env.B_BFUEL;
    bridge_address = process.env.B_BRIDGE;
  }

  const bfuel = await ethers.getContractAt('BFuelToken', bfuel_address, signer)
  const bridge = await ethers.getContractAt('Bridge', bridge_address, signer)

  // let approveTx = await bfuel.approve(bridge_address, ethers.constants.MaxUint256);
  // await approveTx.wait();

  // let addManageTx = await bridge.addManage(deployer.address);
  // await addManageTx.wait();

  // let addTx = await bridge.addToken(bfuel_address);
  // await addTx.wait();

  // let amount = ethers.utils.parseEther("10");
  // let bridgeTokenTx = await bridge.bridgeToken(bfuel_address, amount, deployer.address);
  // await bridgeTokenTx.wait();
  // console.log(bridgeTokenTx.hash);
  
  // return;
  // let queueData = await bridge.getQueneByIndex(deployer.address, 0);
  // console.log(queueData);

  // let list = await bridge.getQueneList(deployer.address);
  // console.log(list);


  // let harvestFeeTx = await bridge.harvestFee(bfuel_address, deployer.address);
  // await harvestFeeTx.wait();
  // console.log(harvestFeeTx.hash);

  // let bridgeConfirmTx = await bridge.bridgeConfirm(bfuel_address, deployer.address, 0, 0);
  // await bridgeConfirmTx.wait();
  // console.log(bridgeConfirmTx.hash);

  // let amount = ethers.utils.parseEther("1");
  // let sendTx = await bridge.tokenSend(
  //   bfuel_address, 
  //   deployer.address,
  //   amount,
  //   "0x6baf964059f9dccf0939c526b048251cc102456d675661681e2008276c4bc619"
  // );
  // await sendTx.wait();
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
