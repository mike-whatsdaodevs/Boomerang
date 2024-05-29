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

  const network = (await ethers.provider.getNetwork()).chainId;
  console.log(network);

  let stakingV1_address;
  switch (network) {
  case 5 :
    stakingV1_address = process.env.G_PROXYV1;
    break;
  default: 
    stakingV1_address = process.env.LOCAL_PROXYV1;
  }

  staking_address = stakingV1_address;
    


  let balance = await provider.getBalance(staking_address);
  let formatBalance = ethers.utils.formatEther(balance)
  console.log("balance is", formatBalance);
  return;  
  const tx = await signer.sendTransaction({
    to: staking_address,
    value: ethers.utils.parseEther("200.0")
  });
  await tx.wait();
  console.log("done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
