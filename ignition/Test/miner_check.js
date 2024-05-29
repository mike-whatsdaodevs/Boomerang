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

  let tokenId = 13459;
  let nftAddr = miner1_address;
  console.log(nftAddr);
  let miner = await ethers.getContractAt('NFTMiner', nftAddr, signer);
  let property = await ethers.getContractAt("NFTProperty", property_address, signer);

  // let uri = await miner.tokenURI(6819);
  // console.log(uri);

  // let setBaseURItx = await miner.setBaseURI("https://nft.bitcoincode.technology/zeongt100x/");
  // await setBaseURItx.wait();

  // uri = await miner.tokenURI(1);
  // console.log(uri);return;
  
  let balance = await miner.balanceOf(deployer.address);
  console.log(balance);


  let owner = await miner.ownerOf(tokenId);
  console.log(owner);

  let hashRate = await property.getHashRate(nftAddr, tokenId);
  console.log("hash rate is:", hashRate);

  let consumption = await property.getConsumption(nftAddr, tokenId);
  console.log("consumption rate is:", consumption);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
