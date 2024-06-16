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

  const boom = await ethers.getContractAt('Boomerang', boom_address, signer);

  // let setManagerTx = await boom.setManager(deployer.address, true);
  // await setManagerTx.wait();
  // console.log(setManagerTx.hash);return;

  let uniswap_routerV2 = process.env.P_UNISAWP_ROUTERV2;
  let quick_routerV2 = process.env.P_QUICK_ROUTERV2;

  // let setProtocolWhitelistTx = await boom.setProtocolWhitelist(quick_routerV2, true);
  // await setProtocolWhitelistTx.wait();
  // console.log(setProtocolWhitelistTx.hash);return;

  // let approveTx = await boom.safeApprove(usdt_address, uniswap_routerV2);
  // await approveTx.wait();
  // console.log(approveTx.hash);
  // return;

  let setVaultTx = await boom.setVault(vault_address);
  await setVaultTx.wait();
  console.log(setVaultTx.hash);

   console.log(await boom.vault());return;
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

