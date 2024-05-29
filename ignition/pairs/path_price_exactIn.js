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

  let pancake_quoterv2 = process.env.PANCAKESWAP_QUOTERV2; 
  let uni_quoterv2 = process.env.UNISWAP_QUOTERV2;
  let sushi_quoterv2 = process.env.SUSHI_QUOTERV2;

  let weth9_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  let wbtc_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  let usdc_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  let usdt_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  let wstETH_address = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0";
  let dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  let pepe_address = "0x6982508145454Ce325dDbE47a25d4ec3d2311933";
  
  let fees = [100, 500, 3000, 10000];

  const poolsPrice = await ethers.getContractAt('PoolsPrice', pathPrice_address, signer)

  console.log("UNISWAP V3");
  let path = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[0]);
  let result = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result.expectedAmount.toString(), 6));

  let path1 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[1]);
  let result1 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path1, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result1.expectedAmount.toString(), 6));

  let path2 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[2]);
  let result2 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path2, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result2.expectedAmount.toString(), 6));

  let path3 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[3]);
  let result3 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path3, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result3.expectedAmount.toString(), 6));


  let path_0 = await poolsPrice.getSinglePath(usdt_address, weth9_address, fees[0]);
  let result_0 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path_0, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_0.expectedAmount.toString(), 18));

  let path_1 = await poolsPrice.getSinglePath(usdt_address, weth9_address, fees[1]);
  let result_1 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path_1, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_1.expectedAmount.toString(), 18));

  let path_2 = await poolsPrice.getSinglePath(usdt_address, weth9_address, fees[0]);
  let result_2 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path_2, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_2.expectedAmount.toString(), 18));

  let path_3 = await poolsPrice.getSinglePath(usdt_address, weth9_address, fees[0]);
  let result_3 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path_3, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_3.expectedAmount.toString(), 18));



  console.log("PANCAKESWAP V3");
  let path4 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[0]);
  let result4 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path4, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result4.expectedAmount.toString(), 6));

  let path5 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[1]);
  let result5 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path5, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result5.expectedAmount.toString(), 6));

  let path6 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[2]);
  let result6 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path6, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result6.expectedAmount.toString(), 6));

  let path7 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[3]);
  let result7 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path7, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result7.expectedAmount.toString(), 6));

  let result_4 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path_0, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_4.expectedAmount.toString(), 18));

  let result_5 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path_1, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_5.expectedAmount.toString(), 18));

  let result_6 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path_2, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_6.expectedAmount.toString(), 18));

  let result_7 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path_3, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_7.expectedAmount.toString(), 18));

  console.log("SUSHI V3");
  let path8 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[0]);
  let result8 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path8, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result8.expectedAmount.toString(), 6));

  let path9 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[1]);
  let result9 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path9, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result9.expectedAmount.toString(), 6));

  let path10 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[2]);
  let result10 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path10, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result10.expectedAmount.toString(), 6));

  let path11 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[3]);
  let result11 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path11, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result11.expectedAmount.toString(), 6));

  let result_8 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path_0, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_8.expectedAmount.toString(), 18));

  let result_9 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path_1, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_9.expectedAmount.toString(), 18));

  let result_10 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path_2, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_10.expectedAmount.toString(), 18));

  let result_11 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path_3, ethers.utils.parseUnits("1000", 6));
  console.log(ethers.utils.formatUnits(result_11.expectedAmount.toString(), 18));


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

