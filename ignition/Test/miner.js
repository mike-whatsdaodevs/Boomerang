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

  let miner_address = process.env.MINER_TEST;
  let repo_address = process.env.REPOS_TEST;
  let miner_mint_address = process.env.MINER_MINT_TEST

  const miner = await ethers.getContractAt('NFTMiner', miner_address, signer)
  const property = await ethers.getContractAt('NFTProperty', repo_address, signer)

  console.log(await property.owner())
  console.log(await miner.owner())



  


  let manage_miner_Tx = await property.addManage(miner_mint_address)
  let manage_repo_Tx = await miner.addManage(miner_mint_address)
  await manage_miner_Tx.wait()
  await manage_repo_Tx.wait()

  let bool1 = await miner.manage(miner_mint_address);
  console.log("bool1 is", bool1);
  let bool2 = await property.manage(miner_mint_address);
  console.log("bool2 is", bool2);
  return;

  // let recipient = "0xFf0ff2Fa960c8337e7E28c2A9aa8be7Fe9a7cbba"
  // for (i = 0; i < 10; i++) {
  //   let mintTx = await miner.mint(recipient)
  //   console.log('mintTx: ' + mintTx.hash)
  //   await mintTx.wait()
  // }

  // let baseURI = await miner.baseURI()
  // console.log('baseURI:' + baseURI)

  // let setBaseURITX = await miner.setBaseURI('https://nft.btc-z.org/')
  // console.log('setBaseURITX:' + setBaseURITX.hash)
  // await setBaseURITX.wait()

  // let tokenURI = await miner.tokenURI(11)
  // console.log('tokenURI:' + tokenURI)

  // let tokenURI = await miner.tokenURI(11)
  // console.log('tokenURI:' + tokenURI)

  // approve
  // let approveTx = await miner.approve('0xA21C66a62f340737Aa1F3B9614522B71697a5b4e', 1)
  // console.log('approveTx:' + approveTx.hash)
  // await approveTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
