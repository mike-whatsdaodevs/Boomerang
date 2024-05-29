const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const fs = require('fs')

const {data} = require('../list/list.js');

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

  let len = data.length;
  console.log("len is", len);


  // "txid":"0xb318c8ce0f832fe0566e690bfef6665d3d5c51706dfd6cc833de77edbe3513fa",
  //        "token":"0x556da75f8b248ddb9b133dd71bc2cab7bbfa82f1",
  //        "from":"0xd006f824d6dd14f1d1ff2abcf2f7c27642166cbb",
  //        "to":"THHBxCRASgsTXL5YHGjZiSPjr5C7gqNFTK",
  //        "value":90000000.00000000,
  //        "fee":2700000.00000000,
  //        "nonce":3,
  //        "blockTime":1700806969,

  let sum = 0;
  for(i = 0; i < len; i ++) {
    let content = data[i].from + "\t" + data[i].to + "\t" + (data[i].value / 1000000);
    console.log(content)
    fs.appendFile('./file.log', content, err => {
      if (err) {
        console.error(err);
      }
      // done!
    });

  }

  console.log(sum);
  console.log(ethers.utils.formatUnits(sum.toString(), 6));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
