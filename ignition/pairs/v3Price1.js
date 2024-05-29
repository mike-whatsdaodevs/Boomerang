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

  const poolsPrice = await ethers.getContractAt('PoolsPrice', pathPrice_address, signer);
  const token = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol:IERC20Metadata", usdt_address, signer);

  let tokens = [
    weth9_address,
    wbtc_address,
    usdc_address,
    wstETH_address,
    dai_address,
    pepe_address
  ];

  let usdt_decimal = 6;
  for(let k = 0; k< tokens.length; ++ k) {

      let tokenIn = tokens[k];
      let tokenOut = usdt_address;
      let decimal = await token.attach(tokenIn).decimals();

      console.log("BUY ", tokens[k]);
      let amountBuy = ethers.utils.parseUnits("1000", usdt_decimal)
      for(let i = 0; i < fees.length; i ++) {
        let path = await buildPath(poolsPrice, tokenOut, tokenIn, fees[i]);
        console.log("UNISWAP V3 fee : ", i);
        let result = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path, amountBuy);
        console.log(ethers.utils.formatUnits(result.expectedAmount.toString(), decimal));

        console.log("PANCAKESWAP V3 fee : ", i);
        let result1 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path, amountBuy);
        console.log(ethers.utils.formatUnits(result.expectedAmount.toString(), decimal));

        console.log("SUSHI V3 fee : ", i);
        let result2 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path, amountBuy);
        console.log(ethers.utils.formatUnits(result.expectedAmount.toString(), decimal));
      }

      if(k > 0) {
        continue;
      }

      console.log("SELL ", tokens[k]);
      let amountSell = ethers.utils.parseUnits("1", decimal);
      for(let i = 0; i < fees.length; i ++) {
        let path = await buildPath(poolsPrice, tokenIn, tokenOut, fees[i]);
        console.log("UNISWAP V3 fee : ", i);
        let result = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path, amountSell);
        console.log(ethers.utils.formatUnits(result.expectedAmount.toString(), usdt_decimal));

        console.log("PANCAKESWAP V3 fee : ", i);
        let result1 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path, amountSell);
        console.log(ethers.utils.formatUnits(result.expectedAmount.toString(), usdt_decimal));

        console.log("SUSHI V3 fee : ", i);
        let result2 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path, amountSell);
        console.log(ethers.utils.formatUnits(result.expectedAmount.toString(), usdt_decimal));
      }

      console.log("-----------------------");
  }

}

async function buildPath(poolsPrice, tokenIn, tokenOut, fee) {
  return await poolsPrice.getSinglePath(tokenIn, tokenOut, fee);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

