// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
  const Counter = await hre.ethers.getContractFactory('Counter');
  const counterContractInstance = await Counter.deploy();

  console.log(
    'ERC1155Converter Instance address ',
    counterContractInstance.address
  );

  await counterContractInstance.deployTransaction.wait(3);
  // await sleep(20000);

  // await hre.run('verify:verify', {
  //   contract: 'contracts/Counter.sol:Counter',
  //   address: counterContractInstance.address,
  //   constructorArguments: [],
  // });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
