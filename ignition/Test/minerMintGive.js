const {ethers} = require("hardhat");

async function main(){
    
    let provider = ethers.provider;
    let signer = provider.getSigner();

    let my_address = await signer.getAddress();
    console.log("my address ", my_address);

    await run("compile");
    console.log("networks ID is ", (await ethers.provider.getNetwork()).chainId)
    console.log("networks name is ", (await ethers.provider.getNetwork()).name)



    const miner_mint = process.env.MINER_MINT_TEST;

    const minermint = await ethers.getContractAt("MinerMint", miner_mint, signer)


    const mint_tx = await minermint.GiveMintNum(my_address, 100000);    
    await mint_tx.wait();
    console.log("give end");


    // const mint_tx1 = await miner.transferFrom(recipient, "0xa5ad5864170ecbCAe865228Bd8745B452eC807bc", 22);    
    // await mint_tx1.wait();
    // console.log("transferred");
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
