const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const TronWeb = require('tronweb')


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


  let bfuel_address;
  let bridge_address;
  switch (network) {
  case 66666 :  
    bfuel_address = process.env.B_BFUEL;
    bridge_address = process.env.B_BRIDGE;
    break;
  case 963 :
    bfuel_address = process.env.M_BFUEL;
    bridge_address = process.env.M_BRIDGE;
    break;
  default: 
    bfuel_address = process.env.B_BFUEL;
    bridge_address = process.env.B_BRIDGE;
  }

  const bfuel = await ethers.getContractAt('BFuelToken', bfuel_address, signer)
  const bridge = await ethers.getContractAt('Bridge', bridge_address, signer)

  ethers.utils.defaultAbiCoder(
    ["address", "uint256", "address"],

  )

  const HttpProvider = TronWeb.providers.HttpProvider;
  const fullNode = new HttpProvider("https://127.0.0.1:8090");
  const solidityNode = new HttpProvider("https://127.0.0.1:8090");
  const eventServer = new HttpProvider("https://127.0.0.1:8090");
  const privateKey = "your private key";
  const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);

  async function triggerSmartContract() {
      const trc20ContractAddress = "TQQg4EL8o1BSeKJY4MJ8TB8XK7xufxFBvK";//contract address

      try {
          let contract = await tronWeb.contract().at(trc20ContractAddress);
          //Use call to execute a pure or view smart contract method.
          // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
          let result = await contract.name().call();
          console.log('result: ', result);
      } catch(error) {
          console.error("trigger smart contract error",error)
      }
  }

  sdk.triggerconstantcontract1({
    owner_address: 'TSNEe5Tf4rnc9zPMNXfaTF5fZfHDDH8oyW',
    contract_address: 'TUZvR27aGDTjenuxuXEpdbtoNtHU7i2PoE',
    function_selector: 'bridgeToken(address,uint256,address)',
    parameter: '000000000000000000000000a614f803b6fd780986a42c78ec9c7f77e6ded13c',
    visible: true
  })
    .then(({ data }) => console.log(data))
    .catch(err => console.error(err));
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
