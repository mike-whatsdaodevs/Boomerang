const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })

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

  let staking_address;
  let stakingV1_address;
  let miner1_address;
  let miner2_address;
  let miner3_address;
  let btcc_address;
  switch (network) {
  case 5:
    staking_address = process.env.G_PROXY;
    stakingV1_address = process.env.G_PROXYV1;
    miner1_address = process.env.G_MINER1;
    miner2_address = process.env.G_MINER2;
    miner3_address = process.env.G_MINER3;
    btcc_address = process.env.G_BTCC
    break;
  case 66666:
    staking_address = process.env.B_PROXYV1;
    stakingV1_address = process.env.B_PROXYV1;
    miner1_address = process.env.B_MINER1;
    miner2_address = process.env.B_MINER2;
    miner3_address = process.env.B_MINER3;
    btcc_address = process.env.B_BTCC
    break;
  case 963:
    stakingV1_address = process.env.M_PROXYV1;
    miner1_address = process.env.M_MINER1;
    miner2_address = process.env.M_MINER2;
    miner3_address = process.env.M_MINER3;
    break;
  default:
    staking_address = process.env.LOCAL_PROXY;
    stakingV1_address = process.env.LOCAL_PROXYV1;
    miner1_address = process.env.LOCAL_MINER1;
    miner2_address = process.env.LOCAL_MINER2;
    miner3_address = process.env.LOCAL_MINER3;
    btcc_address = process.env.LOCAL_BTCC
  }


  staking_address = stakingV1_address;

  console.log(staking_address);
  console.log(miner1_address);
  console.log(miner2_address);
  console.log(miner3_address);

  const staking = await ethers.getContractAt('Staking', staking_address, signer)
  const miner1 = await ethers.getContractAt('NFTMiner', miner1_address, signer)
  const miner2 = await ethers.getContractAt('NFTMiner', miner2_address, signer)
  const miner3 = await ethers.getContractAt('NFTMiner', miner3_address, signer)

  let approve_miner1_Tx = await miner1.setApprovalForAll(staking_address, true)
  console.log('approveTx:' + approve_miner1_Tx.hash)
  await approve_miner1_Tx.wait()

  let approve_miner2_Tx = await miner2.setApprovalForAll(staking_address, true)
  console.log('approveTx:' + approve_miner2_Tx.hash)
  await approve_miner2_Tx.wait()

  let approve_miner3_Tx = await miner3.setApprovalForAll(staking_address, true)
  console.log('approveTx:' + approve_miner3_Tx.hash)
  await approve_miner3_Tx.wait()

  let setFuelReceiverTx = await staking.setFuelReceiver(deployer.address);
  await setFuelReceiverTx.wait();

  let setNFTMinerTx1 = await staking.setNFTStatus(miner1_address, true);
  await setNFTMinerTx1.wait();

  let setNFTMinerTx2 = await staking.setNFTStatus(miner2_address, true);
  await setNFTMinerTx2.wait();

  let setNFTMinerTx3 = await staking.setNFTStatus(miner3_address, true);
  await setNFTMinerTx3.wait();

  console.log("done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
