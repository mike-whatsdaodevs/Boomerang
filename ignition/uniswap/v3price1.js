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

  let priceOracle_address = process.env.PRICE_ORACLE;
  let token_address = process.env.USDC;

  const priceOracle = await ethers.getContractAt('PriceOracle', priceOracle_address, signer)

  let ethAmount = await priceOracle.convertToETH(token_address, ethers.utils.parseUnits("1", 6));
  console.log(
  	ethers.utils.formatEther(ethAmount)
  );



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

