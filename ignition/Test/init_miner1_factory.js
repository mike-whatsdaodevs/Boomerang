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
  let property_address;
  let factory_address;
  switch (network) {
  case 66666 :
    miner1_address = process.env.B_MINER1;
    property_address = process.env.B_PROPERTY;
    factory_address = process.env.B_FACTORY;
    break;
  case 963 :
    miner1_address = process.env.M_MINER1;
    property_address = process.env.M_PROPERTY;
    factory_address = process.env.M_FACTORY;
    break;
  default: 
    miner1_address = process.env.LOCAL_MINER1;
    property_address = process.env.LOCAL_PROPERTY;
    factory_address = process.env.LOCAL_FACTORY;
  }
  console.log("miner1 address is:", miner1_address);

  let property1 = Array(
      1_000,
      10, 
      1
  );

  /// miner
  const miner1 = await ethers.getContractAt('NFTMiner', miner1_address, signer)
  let addManageTx1 = await miner1.addManage(factory_address);
  await addManageTx1.wait();

  /// factory
  const factory = await ethers.getContractAt('NFTFactory', factory_address, signer)
  
  let setNFTMinerTx1 = await factory.setNFTMiner(miner1_address, true, property1);
  await setNFTMinerTx1.wait();

  console.log("done");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
