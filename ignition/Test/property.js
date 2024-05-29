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
  switch (network) {
  case 5 :
    miner1_address = process.env.G_MINER1;
    property_address = process.env.G_PROPERTY;
    break;
  case 963 :
    miner1_address = process.env.M_MINER1;
    property_address = process.env.M_PROPERTY;
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
  /// property
  const property = await ethers.getContractAt('NFTProperty', property_address, signer)

  // let changePropertyTx = await property.addProperty(miner1_address, 6819, property3);
  // await changePropertyTx.wait();

  let hashRate = await property.getHashRate(miner1_address, 6819);
  console.log(hashRate); 
  // let addManageTx4 = await property.addManage(deployer.address);
  // await addManageTx4.wait();
  // console.log("done");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
