// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const {ethers} = require("hardhat");

async function main(){
    
    let provider = ethers.provider;
    let signer = provider.getSigner();

    let my_address = await signer.getAddress();
    console.log(my_address);
    await run("compile");
    console.log("networks ID is ", (await ethers.provider.getNetwork()).chainId)
    console.log("networks name is ", (await ethers.provider.getNetwork()).name)    

    const miner_mint = process.env.MINT

    const minermint = await ethers.getContractAt("MinerMint", miner_mint, signer)
    


    //***************
    // 29230
    // 22160
    let data = [
        ["0x868736F0dE95C7A2515e073190381c6FEd1FaD77", 5],
     ];   

     console.log(data);
    //***************

    let len = data.length
    console.log("data length", len);

    for(i = 0; i < len; i ++) {
      let addr = data[i][0];
      let amount = data[i][1];
      console.log("addr address=", addr);

      console.log("amount=", amount);

      const mint_tx = await minermint.RoleMintMiners(addr, amount);    
      await mint_tx.wait();
      
      console.log("mint end", addr);
      await new Promise(r => setTimeout(r, 5000));
    }
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
