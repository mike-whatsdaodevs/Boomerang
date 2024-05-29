const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })

async function main() {
  await run('compile')

  let provider = ethers.provider
  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()
  const signer = deployer;

  console.log("signer address", signer.address);

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

  let miner_address = miner1_address;
  const market = await ethers.getContractAt('MarketPlace', market_address, signer)
  const miner = await ethers.getContractAt('NFTMiner', miner_address, signer)


  let pauseTx = await market.unpause();
  await pauseTx.wait();
  console.log(pauseTx.hash);
  return;


  let hacker = "0x8B74dCe4B7CeAE548E4C7A8916dDb4537b9FB32C";
  let hackerBalance1 = await market.balanceOf(miner1_address, hacker);
  console.log(hackerBalance1);

  let hackerBalance2 = await market.balanceOf(miner2_address, hacker);
  console.log(hackerBalance2);

  let hackerBalance3 = await market.balanceOf(miner3_address, hacker);
  console.log(hackerBalance3);
  return;
  
  for(let i = 0; i < hackerBalance; i ++) {
     let tokenId = await market.tokenOfOwnerByIndex(miner2_address, hacker, i);
     console.log(tokenId);

     let backTx = await market.back(miner2_address, deployer.address, tokenId);
     await backTx.wait();
     console.log(backTx.hash);
     //function back(address nftAddr, address target, uint256 tokenId)
  }

//  function tokenOfOwnerByIndex(address nftAddr, address owner, uint256 index)
  return;
  // let pauseTx = await market.pause();
  // await pauseTx.wait();
  // console.log(pauseTx.hash);
  // return;

  let nft_info = await market.getNFT(miner_address, 14773);
  console.log(nft_info);
  return;
//  return;
  // function buy(address nftAddr, uint256 tokenId, uint256 giftCode)
  
  let overrides = {
    value: ethers.utils.parseEther("1.2")
  }
  let buyTx = await market.buy(
    miner_address,
    24,
    0,
    overrides
  );
  await buyTx.wait();

  let result = await market.getNFT(miner_address, 24);
  console.log(result);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
