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

  let weth9_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  let wbtc_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  let usdc_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  let usdt_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  let wstETH_address = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0";
  let dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  let pepe_address = "0x6982508145454Ce325dDbE47a25d4ec3d2311933";
  
  let fees = [100, 500, 3000, 10000];

  const poolsPrice = await ethers.getContractAt('PoolsPrice', pathPrice_address, deployer)
  const token = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", usdc_address, deployer);

  let path1 = await poolsPrice.getSinglePath(usdc_address, dai_address, fees[1]);
  let path2 = await poolsPrice.getSinglePath(dai_address, usdt_address, fees[0]);

  // let recoveryTx = await poolsPrice.recovery(usdc_address, deployer.address);
  // await recoveryTx.wait();

  let approveTx = await token.approve(pathPrice_address, ethers.utils.parseEther("1"));
  await approveTx.wait();

  let safeApprove1Tx = await poolsPrice.safeApprove(usdc_address, uniswap_routerV2);
  await safeApprove1Tx.wait();

  let safeApprove2Tx = await poolsPrice.safeApprove(dai_address, uniswap_routerV2);
  await safeApprove2Tx.wait();

  let amount = ethers.utils.parseUnits("100", 6);
  let override = {
    value: amount
  }
  console.log(await token.attach(weth9_address).balanceOf(pathPrice_address));

  let tx = await poolsPrice.swapSingleCall(
    [3,3],
    [uniswap_routerV2, uniswap_routerV2],
    [path1, path2],
    usdc_address,
    amount,
  );
  await tx.wait();
  console.log("static result:", tx.hash);
  console.log(await token.attach(usdt_address).balanceOf(pathPrice_address));


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

