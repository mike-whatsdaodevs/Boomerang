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
  let bridge_address;
  switch (network) {
  case 963 :
    usdt_address = process.env.M_USDT;
    bridge_address = process.env.M_BTCCBRIDGE;
    break;
  default: 
    usdt_address = process.env.B_usdt;
    bridge_address = process.env.B_BRIDGE;
  }

  const usdt = await ethers.getContractAt('USDT', usdt_address, signer)
  const bridge = await ethers.getContractAt('BTCCBridge', bridge_address, signer)

  // let approveTx = await usdt.approve(bridge_address, ethers.constants.MaxUint256);
  // await approveTx.wait();

  // let addManageTx = await usdt.manage(process.env.ERIC_BTCC_GAS_PRE);
  // console.log(addManageTx);
  // return;

  // let addTx = await bridge.addToken(usdt_address);
  // await addTx.wait();

  // let baseFee = ethers.utils.parseUnits("5", 6);
  // console.log(baseFee);
  // let setGasFeeTx = await bridge.setGasFee(baseFee)
  // await setGasFeeTx.wait();
  // return; 

  // let setGasFeeTx = await bridge.setGasFee(0);
  // await setGasFeeTx.wait();
  // console.log(setGasFeeTx.hash);

  //  let 30 = await bridge.setGasFee(20);
  // await setGasFeeTx.wait();
  // console.log(setGasFeeTx.hash);

  

  // let amount = ethers.utils.parseUnits("2", 6);
  // let bridgeTokenTx = await bridge.bridgeToken(usdt_address, amount, "TMeh8e4o6HELTRiWWpeeKmqZXVC3dNrtEM");
  // await bridgeTokenTx.wait();
  // console.log(bridgeTokenTx.hash);
 
  // return;
  // let queueData = await bridge.getQueneByIndex(addr, 1);
  // console.log(queueData);

  // let list = await bridge.getQueneList(deployer.address);
  // console.log(list);


  // let harvestFeeTx = await bridge.harvestFee(usdt_address, deployer.address);
  // await harvestFeeTx.wait();
  // console.log(harvestFeeTx.hash);


  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
