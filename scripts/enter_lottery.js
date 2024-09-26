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
  const lotteryAddress = '0xaB9900E9dA3aa224E74f1cC6B92563E2e0b222Aa';
  // const minterAddress = '0xaB9900E9dA3aa224E74f1cC6B92563E2e0b222Aa';

  const LERC20 = await hre.ethers.getContractFactory("LERC20");
  const lERC20Instance = await LERC20.attach(
    tokenAddress
  );

  tx = await lERC20Instance.approve(lotteryAddress,'1000000000000000000000000');
  await tx.wait();

  console.log('Approved')

  const signer =await hre.ethers.getSigner();
  // console.log(signer)

  bal = await lERC20Instance.balanceOf(signer.address);
  await tx.wait();

  console.log('Balance: ',bal)

  const LotteryContract = await hre.ethers.getContractFactory("contracts/LotteryContractV2.sol:LotteryContract");
  const lotteryContractInstance = await LotteryContract.attach(
    lotteryAddress
  );


  console.log("Attached to:", lotteryContractInstance.address);

  tx = await lotteryContractInstance.enterLottery();
  await tx.wait();

  console.log('Entered Lottery')

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
