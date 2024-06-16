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

  let boom_address = process.env.BOOM_MAIN;
  let pair_address = process.env.WMATIC_USDT_PAIR;
  let vault_address = process.env.VAULT;

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


  const boom = await ethers.getContractAt('Boomerang', boom_address, signer);
  const weth9 = await ethers.getContractAt('IWETH9', wmatic_address, signer)
  const token = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", usdc_address, signer);

  // let setManagerTx = await boom.setManager(deployer.address, true);
  // await setManagerTx.wait();
  // console.log(setManagerTx.hash);return;

  // let setProtocolWhitelistTx = await boom.setProtocolWhitelist(uniswap_routerV2, true);
  // await setProtocolWhitelistTx.wait();
  // console.log(setProtocolWhitelistTx.hash);return;

  // let approveTx = await boom.safeApprove(usdt_address, uniswap_routerV2);
  // await approveTx.wait();
  // console.log(approveTx.hash);
  // return;


  let path1 = await boom.getMultiPath(
    [ 
      usdt_address, 
      weth_address,
      wmatic_address,
      usdt_address

    ],
    [
      fees[1],
      fees[3],
      fees[1]
    ]
  );


  let path2 = await boom.getMultiPath(
    [ 
      wmatic_address,
      usdc_address,
      usdt_address

    ],
    [
      fees[1],
      fees[1]
    ]
  );


  let amount = ethers.utils.parseUnits("1", 6);
  let amount1 = ethers.utils.parseEther("3");
  let override = {
    value: amount
  }
  let pathx = ethers.utils.defaultAbiCoder.encode([ "uint256", "address"], [ amount1, wmatic_address]);
  path1 = ethers.utils.defaultAbiCoder.encode([ "bytes", "uint256"], [ path1, 0]);
  path2 = ethers.utils.defaultAbiCoder.encode([ "bytes", "uint256"], [ path2, 0]);

  // let pathxdata = "0x0000000000000000000000000000000000000000000000004563918244f400000000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
  // let res = ethers.utils.defaultAbiCoder.decode([ "uint256", "address"], pathxdata);
  // console.log(ethers.utils.formatEther(res[0].toString()));
  // return;
 
  let params = {
    protocolTypes: [3,1,3],
    routers: [uniswap_routerV2, pair_address, uniswap_routerV2],
    paths: [path1, pathx, path2],
    target: deployer.address,
    amountIn: amount,
  }
  let paramsEncodeData = await boom.paramsEncode(params);
  console.log(paramsEncodeData);

  let paramsDecodeData = await boom.paramsDecode(paramsEncodeData);
  console.log(paramsDecodeData);

  let tx1 = await boom.requestFlashLoan(
    usdt_address,
    amount,
    paramsEncodeData
  );
  await tx1.wait();
  console.log("hash:", tx1.hash);
  let endBalance = await token.attach(wmatic_address).balanceOf(boom_address);
  console.log(ethers.utils.formatEther(endBalance));


  // let tx = await boom.justWethSwapDirect(
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

