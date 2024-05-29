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

  let pathPrice_address = "0x43511Fd2F305900CECD9FdC8d808177F871E4a27";

  let weth9_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  let wbtc_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  let usdc_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  let usdt_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  let wstETH_address = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0";
  let dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  let pepe_address = "0x6982508145454Ce325dDbE47a25d4ec3d2311933";


  let fees = [100, 500, 3000, 10000];

  const poolsPrice = await ethers.getContractAt('PoolsPrice', pathPrice_address, signer)
  const token = await ethers.getContractAt("IERC20Metadata", pepe_address, signer);

  console.log(await token.decimals());return;


  let params = {
      tokenIn: weth9_address,
      tokenOut: usdt_address,
      amountIn: ethers.utils.parseEther("1"),
      fee: fees[0],
      sqrtPriceLimitX96: 0
  }
  let result = await poolsPrice.callStatic.getExactInputSingleAmountOut(params);

  console.log(result);
  console.log(ethers.utils.formatUnits(result.eAmount.toString(), 6));

  let params1 = {
      tokenIn: weth9_address,
      tokenOut: usdt_address,
      amountIn: ethers.utils.parseEther("1"),
      fee: fees[1],
      sqrtPriceLimitX96: 0
  }
  let result1 = await poolsPrice.callStatic.getExactInputSingleAmountOut(params1);
  console.log(ethers.utils.formatUnits(result1.eAmount.toString(), 6));

  let params2 = {
      tokenIn: weth9_address,
      tokenOut: usdt_address,
      amountIn: ethers.utils.parseEther("1"),
      fee: fees[2],
      sqrtPriceLimitX96: 0
  }
  let result2 = await poolsPrice.callStatic.getExactInputSingleAmountOut(params2);
  console.log(ethers.utils.formatUnits(result2.eAmount.toString(), 6));

  let params3 = {
      tokenIn: weth9_address,
      tokenOut: usdt_address,
      amountIn: ethers.utils.parseEther("1"),
      fee: fees[3],
      sqrtPriceLimitX96: 0
  }
  let result3 = await poolsPrice.callStatic.getExactInputSingleAmountOut(params3);
  console.log(ethers.utils.formatUnits(result3.eAmount.toString(), 6));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

