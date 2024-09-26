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

  const testingWallet = '0xD914d1bA576546Ed40c5D4CCF5C18d5D251476C7';

  const LERC20 = await hre.ethers.getContractFactory("LERC20");
  const lERC20Instance = await LERC20.deploy(
    "USDC",
    "USDC",
    18
  );

  await lERC20Instance.deployed();

  console.log("USDC deployed to:", lERC20Instance.address);

  const tx = await lERC20Instance.mint(testingWallet,'1000000000000000000000000');
  await tx.wait();

  await sleep(20000);

  await hre.run("verify:verify", {
    address: lERC20Instance.address,
    constructorArguments: [
        "USDC",
        "USDC",
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
