// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  let provider = hre.ethers.provider;

  let signer = provider.getSigner();
  let my_address = await signer.getAddress();
 
  console.log("my_address:", my_address)

  await hre.run('compile');

  let miner1_address = process.env.M_MINER1;
  let router_address = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
    
  let goerliProvider = new ethers.providers.JsonRpcProvider(process.env.BTCC_MAIN);

  let abi = [
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  ]
  //let vault = await hre.ethers.getContractAt("ETHVault", vault_address);
  let vault = new ethers.Contract(miner1_address, abi, goerliProvider);
  let router = await hre.ethers.getContractAt("USDT", router_address, signer);

  /// Deposit(address indexed addr, uint256 amount, uint256 fee, uint256 subfee,  uint256 timestamp);

  vault.on("Transfer", (from, to, tokenId, event) => {
        console.log(from);
        console.log(to);
        console.log(tokenId);
        console.log(event);
  });

  return

}

const mintFunc = async function(router, addr, amount) {
    let mint_tx = await router.claimDigi(addr, amount);
    await mint_tx.wait();
    console.log(mint_tx.hash);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});