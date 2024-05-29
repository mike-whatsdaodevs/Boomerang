const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const {data} = require('../list/pending.js');

async function main() {
  await run('compile')

  const [signer] = await ethers.getSigners()
  console.log('signer:' + signer.address)

  let usdt_address = process.env.M_USDT;
  let bridge_address = process.env.M_BTCCBRIDGE;
  let revert_address = "0xfa148b06A7cd776e8AE4A9602e3896436021c0E4";

  const usdt = await ethers.getContractAt('USDT', usdt_address, signer)
  const bridge = await ethers.getContractAt('BTCCBridge', bridge_address, signer)
  const revert = await ethers.getContractAt('USDTRevert', revert_address, signer)

  let len =  data.length;
  console.log("len is", len);

  let addrs = Array();
  let amounts = Array();


  let overrides = {
    gasLimit:7260570,
  }

  let sum = 0;
  for(i = 0; i < len; i ++) {
    let address = data[i].from;
    let value = data[i].value;
    let realValue = Math.ceil(value * 10 / 9.7);
    sum += realValue;
    console.log(realValue);
    if (!ethers.utils.isAddress(address)) {
      console.log("i is", i);
      console.log("error address is", address);return;
    }
    addrs[i] = address;
    amounts[i] = realValue * (10 **6);
  }
  console.log("sum is: ", sum);

  console.log(addrs);

  let tx = await revert.batchRevert(addrs, amounts);
  await tx.wait();
  console.log("tx is: ", tx.hash);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })



