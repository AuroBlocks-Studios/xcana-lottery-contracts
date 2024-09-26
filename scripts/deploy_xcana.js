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

  const loserLotteryAddress = '';  

  const LERC20 = await hre.ethers.getContractFactory("LERC20");
  const lERC20Instance = await LERC20.deploy(
    "XCANA",
    "XCANA",
    18
  );

  await lERC20Instance.deployed();

  console.log("XCANA deployed to:", lERC20Instance.address);

  let tx = await lERC20Instance.mint(testingWallet,'1000000000000000000000000');
  await tx.wait();

  tx = await lERC20Instance.addMinter(loserLotteryAddress);
  await tx.wait();

  await sleep(20000);

  await hre.run("verify:verify", {
    address: lERC20Instance.address,
    constructorArguments: [
        "XCANA",
        "XCANA",
        18
    ],
  });

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
