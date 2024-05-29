const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const {data} = require('../list/4-20-100X.js');

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
  let property_address;
  let factory_address;
  switch (network) {
  case 5 :
    miner1_address = process.env.G_MINER1;
    miner2_address = process.env.G_MINER2;
    miner3_address = process.env.G_MINER3;
    property_address = process.env.G_PROPERTY;
    factory_address = process.env.G_FACTORY;
    break;
  case 66666 :
    miner1_address = process.env.B_MINER1;
    miner2_address = process.env.B_MINER2;
    miner3_address = process.env.B_MINER3;
    property_address = process.env.B_PROPERTY;
    factory_address = process.env.B_FACTORY;
    break;
  case 963 :
    miner1_address = process.env.M_MINER1;
    miner2_address = process.env.M_MINER2;
    miner3_address = process.env.M_MINER3;
    property_address = process.env.M_PROPERTY;
    factory_address = process.env.M_FACTORY;
    break;
  default: 
    miner1_address = process.env.LOCAL_MINER1;
    miner2_address = process.env.LOCAL_MINER2;
    miner3_address = process.env.LOCAL_MINER3;
    property_address = process.env.LOCAL_PROPERTY;
    factory_address = process.env.LOCAL_FACTORY;
  }
  let nftAddr = miner3_address;
  console.log(nftAddr);
  const factory = await ethers.getContractAt('NFTFactory', factory_address, signer)

  let len = data.length;
  console.log("len is", len);
  let nftAddrs = Array();
  let receivers = Array();
  let amounts = Array();

  let overrides = {
    gasLimit:7260570,
  }

  let sum = 0;
  for(i = 0; i < len; i ++) {
    nftAddrs[i] = nftAddr;
    if (!ethers.utils.isAddress(data[i][0])) {
      console.log("i is", i);
      console.log("error address is", data[i][0]);return;
    }
    receivers[i] = data[i][0];
    amounts[i] = data[i][1];
    sum += data[i][1];


// M_MINER1=0x4286388ad684515627464dF221b59Cc5C2dd821B
// M_MINER2=0x371d9C99aBC64d90356B488f2b9Be56350E9e054
// M_MINER3=0x286F4310551D634Ef485a9bEE962f19cbb0AcA80

    // console.log("nftAddr :", nftAddr);
    // console.log(data[i][0]);
    // console.log(data[i][1]);
    // let buildMinerTx = await factory.batchBuildMiner(nftAddr, data[i][0], data[i][1], overrides);
    // await buildMinerTx.wait();   
    // console.log(buildMinerTx.hash);
  }
  console.log(nftAddrs);
  console.log(receivers);
  console.log(amounts);
  console.log("number", sum);

  let buildMinerTx = await factory.batchBuildMinerByArray(nftAddrs, receivers, amounts, overrides);
  await buildMinerTx.wait();   
  console.log(buildMinerTx.hash);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
