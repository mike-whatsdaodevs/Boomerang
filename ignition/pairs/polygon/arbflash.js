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

  let boom_address = "0xB43D918B95Cdc4fA726273B2a572fcE773f9Dd66";
  let pair_address = "0x584ab462F592C40c253a74885E2F6345B91f8A2C";

  let uniswap_routerV2 = process.env.P_UNISAWP_ROUTERV2;
  let quick_routerV2 = process.env.P_QUICK_ROUTERV2;

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


  const poolsPrice = await ethers.getContractAt('Boomerang', boom_address, signer);
  const weth9 = await ethers.getContractAt('IWETH9', wmatic_address, signer)
  const wmatic = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", wmatic_address, signer);
  const usdt = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", usdt_address, signer);

  // let recoveryTx = await poolsPrice.recovery(wmatic_address, deployer.address);
  // await recoveryTx.wait();
  // console.log(recoveryTx.hash);return;

  let path1 = await poolsPrice.getMultiPath(
    [ 
      wmatic_address, 
      usdc_e_address,
      wmatic_address

    ],
    [
      fees[1],
      fees[1]
    ]
  );

  let path2 = await poolsPrice.getMultiPath(
    [ 
      usdt_address, 
      dai_address,
      wmatic_address

    ],
    [
      fees[1],
      fees[1]
    ]
  );

  // let approveTx = await poolsPrice.safeApprove(wmatic_address, uniswap_routerV2);
  // await approveTx.wait();
  // console.log(approveTx.hash);
  // return;

  // console.log(await usdt.allowance(pathPrice_address, uniswap_routerV2));
  // return;

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

  let amount = ethers.utils.parseEther("3");
  let amount1 = ethers.utils.parseUnits("4", 6);
  let override = {
    value: amount
  }

  let pathx = ethers.utils.defaultAbiCoder.encode([ "uint256"], [ amount1 ]);

  // let depositTx = await weth9.deposit(override);
  // await depositTx.wait();
  // console.log(depositTx.hash);

  // console.log(await token.balanceOf(deployer.address));


  let pairdata = await poolsPrice.encodePair(link_address, amount1);
  console.log(pairdata);
 
  let params = {
    protocolTypes: [3, 1, 3],
    routers: [uniswap_routerV2, pair_address, uniswap_routerV2],
    paths: [path1, pathx, path2],
    token: wmatic_address,
    amountIn: amount,
  }

  let swapSingleCallByFlashLoanTx = await poolsPrice.swapSingleCallByFlashLoan(params);
  await swapSingleCallByFlashLoanTx.wait();
  console.log(swapSingleCallByFlashLoanTx.hash);return;

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

