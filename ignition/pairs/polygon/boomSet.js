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

  const boom = await ethers.getContractAt('Boomerang', boom_address, signer);

  console.log(await boom.vault());return;

  let setVaultTx = await boom.setVault(vault_address);
  await setVaultTx.wait();
  console.log(setVaultTx.hash);
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

