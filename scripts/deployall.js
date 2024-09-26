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

    const testingWallet = '0x36AbaB5DbBC5ba78f0E43939fbAEb6ECC784f40d'
    // Deploy USDC
    const LERC20 = await hre.ethers.getContractFactory("LERC20");
    const usdcInstance = await LERC20.deploy(
      "USDC",
      "USDC",
      "18"
    );
  
    await usdcInstance.deployed();
  
    console.log("USDC deployed to:", usdcInstance.address);
  
    let tx = await usdcInstance.mint(owner.address,'1000000000000000000000000');
    await tx.wait();

    // Deploy LUSD
    const lERC20Instance = await LERC20.deploy(
      "Lottery USD",
      "LUSD",
      "18"
    );
  
    await lERC20Instance.deployed();
  
    console.log("Lottery ERC20 deployed to:", lERC20Instance.address);
  
    // Deploy Lottery[USDC to LUSD]
    const LotteryContract = await hre.ethers.getContractFactory("contracts/LotteryContractV2.sol:LotteryContract");

    const lotteryContractInstance = await LotteryContract.deploy(
        usdcInstance.address,
        lERC20Instance.address,
        owner.address,
        subid,
        '0x1770bdc7eec7771f7ba4ffd640f34260d7f095b79c92d34a5b2551d6f6cfd2be',
        mockVRF.address
    );

    await lotteryContractInstance.deployed();

    console.log("Lottery Contract deployed to:", lotteryContractInstance.address);

    tx = await lotteryContractInstance.setLotteryRules(
        1,
        2,
        '10000000000000000000',
        1,
        1
    )
    await tx.wait();

    console.log('Lottery Rules Set');
        
    tx = await lERC20Instance.addMinter(lotteryContractInstance.address);
    await tx.wait();
  
    console.log('Added minter')


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
