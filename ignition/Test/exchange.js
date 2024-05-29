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

  let exchange_address;
  switch (network) {
  case 5:
    exchange_address = process.env.G_EXCHANGE;
    break;
  case 66666:
    exchange_address = process.env.B_EXCHANGE;
    break;
  case 963 :
    exchange_address = process.env.M_EXCHANGE;
    break;
  default:
    exchange_address = process.env.LOCAL_EXCHANGE;
  }

  const exchange = await ethers.getContractAt('Exchange', exchange_address, signer)

  let takeBackBfuelTx = await exchange.takeBackBfuel(deployer.address);
  await takeBackBfuelTx.wait();
  console.log(takeBackBfuelTx.hash);
  return;


  let ethprice = await exchange.ethprice();
  console.log(ethers.utils.formatEther(ethprice));

  let set_bfuel = await exchange.bfuel();
  console.log(set_bfuel);
  return;

  let overrides = {
    value : ethers.utils.parseEther("0.05").mul(2)
  }

  let exchangeTx = await exchange.swapForETH(overrides)
  await exchangeTx.wait()
  console.log('exchangeTx:', exchangeTx.hash)


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
