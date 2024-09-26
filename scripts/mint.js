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

  const tokenAddress = '0x3e1E4b8ED15384D59dC3D68C4a74A2095cD56E74';
  const mintAddress = '0x36AbaB5DbBC5ba78f0E43939fbAEb6ECC784f40d';
  const amount = '1000000000000000000000000'

  const LERC20 = await hre.ethers.getContractFactory("LERC20");
  const lERC20Instance = await LERC20.attach(
    tokenAddress
  );


  console.log("Attached to:", lERC20Instance.address);

  tx = await lERC20Instance.mint(mintAddress, amount);
  await tx.wait();

  console.log('Minted')

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
