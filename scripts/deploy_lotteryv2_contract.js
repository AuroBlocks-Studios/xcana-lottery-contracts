// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const config = require("./config.json");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const network = "arbtest"; // Possible values : mumbai or matic
  const LotteryContract = await hre.ethers.getContractFactory("contracts/LotteryContractV2.sol:LotteryContract");

  await sleep(20000);

  const lotteryContractInstance = await LotteryContract.deploy(
    config[network].buyToken,
    config[network].lotteryToken.address,
    config[network].feeAddress,
    config[network].subid,
    config[network].keyHash,
    '0x5CE8D5A2BC84beb22a398CCA51996F7930313D61'
  );

  await lotteryContractInstance.deployed();

  console.log("Lottery Contract deployed to:", lotteryContractInstance.address);
  await sleep(20000);

  let tx = await lotteryContractInstance.setLotteryRules(
    1,
    2,
    '10000000000000000000',
    1,
    1
  )
  tx.wait();

  console.log('Lottery Rules Set');

  await hre.run("verify:verify", {
    address: lotteryContractInstance.address,
    constructorArguments: [
      config[network].buyToken,
      config[network].lotteryToken.address,
      config[network].feeAddress,
      config[network].subid,
      config[network].link,
      config[network].keyHash,
    ],
  });

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
