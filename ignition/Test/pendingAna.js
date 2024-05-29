const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const {data} = require('../list/pending.js');

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)

  let len = data.length;
  console.log("len is", len);
  /// let amounts = Array();

  let count = 0;
  let amount = 0;
  let sum = 0;
  for(i = 0; i < len; i ++) {
    if(data[i].value > 100) {
      continue;
    }
    // console.log(data[i]);return;
    count ++ ;
    amount += data[i].value;
  }

  console.log(count);
  console.log(amount);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
