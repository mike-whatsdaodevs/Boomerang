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
  let market_address;
  switch (network) {
  case 5 :
    miner1_address = process.env.G_MINER1;
    miner2_address = process.env.G_MINER2;
    miner3_address = process.env.G_MINER3;
    market_address = process.env.G_MARKET;
    break;
  case 66666 :
    miner1_address = process.env.B_MINER1;
    miner2_address = process.env.B_MINER2;
    miner3_address = process.env.B_MINER3;
    market_address = process.env.B_MARKET;
    break;
  case 963 :
    miner1_address = process.env.M_MINER1;
    miner2_address = process.env.M_MINER2;
    miner3_address = process.env.M_MINER3;
    market_address = process.env.M_MARKET;
    break;
  default: 
    miner1_address = process.env.LOCAL_MINER1;
    miner2_address = process.env.LOCAL_MINER2;
    miner3_address = process.env.LOCAL_MINER3;
    market_address = process.env.LOCAL_MARKET;
  }
  /// market
  const market = await ethers.getContractAt('MarketPlace', market_address, signer)
  let setMarketNFTMinerTx1 = await market.setNFTMiner(miner1_address, true);
  await setMarketNFTMinerTx1.wait();

  let setMarketNFTMinerTx2 = await market.setNFTMiner(miner2_address, true);
  await setMarketNFTMinerTx2.wait();

  let setMarketNFTMinerTx3 = await market.setNFTMiner(miner3_address, true);
  await setMarketNFTMinerTx3.wait();

  console.log("done");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
