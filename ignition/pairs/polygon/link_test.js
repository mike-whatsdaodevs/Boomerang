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
  let crv_address = "0x172370d5Cd63279eFa6d502DAB29171933a610AF";

  let oracle_address = process.env.LINK;
  let link_matic = process.env.LINK_MATIC;
  let link_weth = process.env.LINK_WETH;
  let link_wbtc = process.env.LINK_WBTC;
  let link_link = process.env.LINK_LINK;

  const link = await ethers.getContractAt('ChainLink', oracle_address, deployer);
  const token = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol:IERC20Metadata", wmatic_address, signer);


  // let r = await link.calculateUSDWealth(weth_address, ethers.utils.parseUnits("1", 18));
  // console.log(r);
  // console.log(ethers.utils.formatUnits(r.toString(), 6));

  let r1 = await link.calculateUSDWealth(wmatic_address, ethers.utils.parseUnits("1", 18));
  console.log(r1);
  console.log(ethers.utils.formatUnits(r1.toString(), 6));
  // let decimal = await link.getLinkDecimals(link_weth);

  // let tx1 = await link.setOracle(weth_address, link_weth, ethers.utils.parseUnits("1", decimal));
  // await tx1.wait();
  // console.log(await link.oracles(weth_address));

  // let decimal = await token.attach(weth_address).decimals();
  // console.log(decimal);

  // let tx = await link.setTokenDecimals(weth_address, ethers.utils.parseUnits("1", decimal));
  // await tx.wait();
  // console.log(await link.tokenDecimals(weth_address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

