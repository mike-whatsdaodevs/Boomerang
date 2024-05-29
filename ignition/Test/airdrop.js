const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const {data} = require('../list/10-5-100X.js');

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

  let airdrop_address;
  switch (network) {
  case 5 :
    airdrop_address = process.env.G_AIRDROP;
    break;
  case 66666 :
    airdrop_address = process.env.B_AIRDROP;
    break;
  case 963 :
    airdrop_address = process.env.M_AIRDROP;
    break;
  default: 
    airdrop_address = process.env.LOCAL_AIRDROP;
  }
  console.log(airdrop_address);
  const airdrop = await ethers.getContractAt('Airdrop', airdrop_address, signer)

  // let tackBackTx = await airdrop.tackBack();
  // await tackBackTx.wait();
  // console.log(tackBackTx.hash);
  // return;

  let len =  data.length;

  let sum = 0;
  let receivers = Array();
  let amounts = Array();

  let overrides = {
    gasLimit:6260570,
  }

  for(i = 0; i < len; i ++) {
    receivers[i] = data[i][0];
    if (!ethers.utils.isAddress(data[i][0])) {
      console.log(data[i][0]);return;
    }
    amounts[i] = data[i][1];
    sum += data[i][1];
  }

  console.log(receivers);
  console.log(amounts);
  console.log(sum);

  // const tx = await signer.sendTransaction({
  //   to: airdrop_address,
  //   value: ethers.utils.parseEther("0.017").mul(sum + 10)
  // });
  // await tx.wait();
  // return;

  let airdropTx = await airdrop.batchAirdop(receivers, amounts, overrides);
  await airdropTx.wait();   
  console.log(airdropTx.hash);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
