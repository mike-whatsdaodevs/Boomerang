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
  console.log("miner1 address is:", miner1_address);

  let property1 = Array(
      1_000,
      10, 
      1
  );


  let property2 = Array(
      10_000,
      100, 
      2
  );

  let property3 = Array(
      100_000,
      1000, 
      3
  );

  /// miner
  const miner1 = await ethers.getContractAt('NFTMiner', miner1_address, signer)
  let addManageTx1 = await miner1.addManage(factory_address);
  await addManageTx1.wait();

  const miner2 = await ethers.getContractAt('NFTMiner', miner2_address, signer)
  let addManageTx2 = await miner2.addManage(factory_address);
  await addManageTx2.wait();

  const miner3 = await ethers.getContractAt('NFTMiner', miner3_address, signer)
  let addManageTx3 = await miner3.addManage(factory_address);
  await addManageTx3.wait();

  /// property
  const property = await ethers.getContractAt('NFTProperty', property_address, signer)
  let addManageTx4 = await property.addManage(factory_address);
  await addManageTx4.wait();

  /// factory
  const factory = await ethers.getContractAt('NFTFactory', factory_address, signer)
  
  let addFactoryManageTx1 = await factory.addManage(deployer.address);
  await addFactoryManageTx1.wait();

  let setNFTMinerTx1 = await factory.setNFTMiner(miner1_address, true, property1);
  await setNFTMinerTx1.wait();

  let setNFTMinerTx2 = await factory.setNFTMiner(miner2_address, true, property2);
  await setNFTMinerTx2.wait();

  let setNFTMinerTx3 = await factory.setNFTMiner(miner3_address, true, property3);
  await setNFTMinerTx3.wait();

  console.log("done");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
