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

  let pathPrice_address = "0x36f59EB1eEEc78ecbDBFF3fB47505a3EA833DeD1";

  let quick_quoterv2 = process.env.P_QUICK_QUOTER; 
  let uni_quoterv2 = process.env.P_UNISWAP_QUPTERV2;

  let wmatic_address = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
  let usdc_e_address = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  let weth_address = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
  let wbtc_address = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6";
  let usdt_address = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  let usdc_address = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  let rndr_address = "0x61299774020dA444Af134c82fa83E3810b309991";
  let link_address = "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39";
  let dai_address = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
  let axlUSDC_address = "0x750e4C4984a9e0f12978eA6742Bc1c5D248f40ed";
  let far_address = "0x5F32AbeeBD3c2fac1E7459A27e1AE9f1C16ccccA";

  let fees = [100, 500, 3000, 10000];

  const poolsPrice = await ethers.getContractAt('PoolsPrice', pathPrice_address, signer);
  const token = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol:IERC20Metadata", usdt_address, signer);

  let tokens = [
    wbtc_address,
    wmatic_address,
    usdc_e_address,
    weth_address,
    usdt_address,
    rndr_address,
    link_address,
    dai_address,
    axlUSDC_address,
    far_address,
  ];

  for(let k = 0; k< tokens.length; ++ k) {

      let tokenIn = usdc_address;
      let tokenOut = tokens[k];
      let tokenIn_decimal = 6;
      let tokenOut_decimal = await token.attach(tokenOut).decimals();

      console.log("Sell ", tokens[k]);
      let amountBuy = ethers.utils.parseUnits("1", tokenOut_decimal)
      let amountSell = ethers.utils.parseUnits("1", tokenIn_decimal);
      for(let i = 0; i < fees.length; i ++) {
        let path_b = await buildPath(poolsPrice, tokenOut, tokenIn, fees[i]);
        let path_s = await buildPath(poolsPrice, tokenIn, tokenOut, fees[i]);
        console.log("UNISWAP V3 fee : ", i);
        let result_b = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path_b, amountBuy);
        console.log("uniswap buy ", ethers.utils.formatUnits(result_b.expectedAmount.toString(), tokenIn_decimal));
        let result_s = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path_s, amountSell);
        console.log("uniswap sell ", ethers.utils.formatUnits(result_s.expectedAmount.toString(), tokenOut_decimal));

        console.log("QUICK V3 fee : ", i);
        let result_b1 = await poolsPrice.callStatic.getExactInAmountOut(quick_quoterv2, path_b, amountBuy);
        console.log("buy ", ethers.utils.formatUnits(result_b1.expectedAmount.toString(), tokenIn_decimal));

        let result_s1 = await poolsPrice.callStatic.getExactInAmountOut(quick_quoterv2, path_s, amountSell);
        console.log("sell ", ethers.utils.formatUnits(result_s1.expectedAmount.toString(), tokenOut_decimal));
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

