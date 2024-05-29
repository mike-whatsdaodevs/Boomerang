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

  let pathPrice_address = "0x22A4A8aCbFAf23aC2674b7632df88aD8f65D4C72";

  let sushi_facotry = process.env.SUSHIV2_FACTORY; 
  let uni_factory = process.env.UNISWAPV2_FACTORY;

  let weth9_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  let wbtc_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  let usdc_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  let usdt_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  let wstETH_address = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0";
  let dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  let pepe_address = "0x6982508145454Ce325dDbE47a25d4ec3d2311933";

  const poolsPrice = await ethers.getContractAt('PoolsPrice', pathPrice_address, signer)

  console.log("UNISWAP V2");
  let result1 = await poolsPrice.getUniswapV2AmountOut(uni_factory, weth9_address, usdt_address, ethers.utils.parseUnits("1", 18));
  console.log(ethers.utils.formatUnits(result1.toString(), 6));

  console.log("Sushi V2");
  let result4 = await poolsPrice.getSushiV2AmountOut(sushi_facotry, weth9_address, usdt_address, ethers.utils.parseUnits("1", 18));
  console.log(ethers.utils.formatUnits(result4.toString(), 6));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

