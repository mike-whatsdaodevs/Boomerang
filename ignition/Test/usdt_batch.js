const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const {data} = require('../list/bridge1.js');

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


  let usdt_address;
  switch (network) {
  case 66666 :  
    usdt_address = process.env.B_USDT;
    break;
  case 963 :  
    usdt_address = process.env.M_USDT;
    break;
  default: 
    usdt_address = process.env.LOCAL_USDT;
  }

  console.log(usdt_address);
  const usdt = await ethers.getContractAt('USDT', usdt_address, signer)

  console.log(data.length);

  let len = data.length;
  let totalAmount = 0;

  for(i = 0; i < len; i++) {
    let receiver = data[i].to;
    let amount = data[i].value;
    let fee = data[i].fee;

    

    if(i < 78) {
      continue
    }

    console.log(receiver);
    console.log(amount);
    console.log(fee)

    totalAmount += (amount - fee) 
    let tx = await usdt.mint(receiver, amount - fee);
    await tx.wait();
    console.log(tx.hash);
  }
  console.log("totalAmount:", totalAmount);
  return;
  // let addManageTx1 = await usdt.addManage(deployer.address);
  // await addManageTx1.wait();
  // console.log(addManageTx1.hash);
  // return;
 // let address = "0x06aCe60b5D5cC887a79AC111dEeF88B5453dCAA0";//deployer.address;
  let amount = ethers.utils.parseUnits("0", 6);
  console.log(amount);
  console.log(address);
  return;
  await tx.wait();
  console.log(tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
