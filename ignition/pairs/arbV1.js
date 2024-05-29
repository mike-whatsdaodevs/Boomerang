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

  let pathPrice_address = "0xf67394B56827246644359D4A3fc0D817dF8E90c0";

  let pancake_quoterv2 = process.env.PANCAKESWAP_QUOTERV2; 
  let uni_quoterv2 = process.env.UNISWAP_QUOTERV2;
  let sushi_quoterv2 = process.env.SUSHI_QUOTERV2;

  let uniswap_routerV2 = process.env.UNI_SWAP_ROUTER_V2;
  let sushiswap_routerV2 = process.env.SUSHI_SWAP_ROUTER_V2;
  let pancakeswap_routerV2 = process.env.PANCAKE_SWAP_ROUTER_V2;

  let weth9_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  let wbtc_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  let usdc_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  let usdt_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  let wstETH_address = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0";
  let dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  let pepe_address = "0x6982508145454Ce325dDbE47a25d4ec3d2311933";
  
  let fees = [100, 500, 3000, 10000];

  const poolsPrice = await ethers.getContractAt('PoolsPrice', pathPrice_address, signer);
  const weth9 = await ethers.getContractAt('IWETH9', weth9_address, signer)
  const token = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", usdc_address, signer);

  let path1 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[0]);
  let path2 = await poolsPrice.getSinglePath(usdt_address, weth9_address, fees[1]);
  let path3 = await poolsPrice.getSinglePath(usdt_address, weth9_address, fees[3]);
  //let path2 = await poolsPrice.getSinglePath(usdc_address, weth9_address, fees[1]);

  // let approveTx = await token.approve(pathPrice_address, ethers.utils.parseEther("10000"));
  // await approveTx.wait();
  // console.log("")

  // let safeApprove1Tx = await poolsPrice.safeApprove(usdt_address, uniswap_routerV2);
  // await safeApprove1Tx.wait();

  // let safeApprove2Tx = await poolsPrice.safeApprove(weth9_address, uniswap_routerV2);
  // await safeApprove2Tx.wait();

  //  let safeApprove3Tx = await poolsPrice.safeApprove(usdt_address, sushiswap_routerV2);
  // await safeApprove3Tx.wait();

  // let safeApprove4Tx = await poolsPrice.safeApprove(weth9_address, sushiswap_routerV2);
  // await safeApprove4Tx.wait();


  //  let safeApprove5Tx = await poolsPrice.safeApprove(usdt_address, pancakeswap_routerV2);
  // await safeApprove5Tx.wait();

  // let safeApprove6Tx = await poolsPrice.safeApprove(weth9_address, pancakeswap_routerV2);
  // await safeApprove6Tx.wait();

  let amount = ethers.utils.parseEther("1");
  let amount1 = ethers.utils.parseUnits("100", 6);
  let override = {
    value: amount
  }

  let depositTx = await weth9.deposit(override);
  await depositTx.wait();
  console.log(depositTx.hash);

  console.log(await token.balanceOf(deployer.address));

  // let tx = await poolsPrice.justWethSwapDirect(
  //   uniswap_routerV2,
  //   path1,
  //   weth9_address,
  //   amount
  // //  override
  // );
  // await tx.wait();
  // return;

  let tx1 = await poolsPrice.swapSingleCall(
    [3, 3],
    [uniswap_routerV2, pancakeswap_routerV2],
    [path1, path2],
    weth9_address,
    amount,
    override
  );
  await tx1.wait();
  console.log("static result:", tx1.hash);
  console.log(await token.attach(weth9_address).balanceOf(pathPrice_address));


  // let tx = await poolsPrice.justWethSwapDirect(
  //   uniswap_routerV2,
  //   path1,
  //   weth9_address,
  //   amount
  // //  override
  // );
  // await tx.wait();
  // console.log("static result:", tx.hash);

// function swapSingleCall(
//         uint256[] memory protocolTypes,
//         address[] memory routers,
//         bytes[] memory paths,
//         address token,
//         uint256 amountIn
//     ) external payable returns (uint256 amountOut) {
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

