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

  const usdcAddress = '';
  const ownerAddress = '';
  const subid = '';
  const coordinatorAddress = '0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e';
  // testnet coord: 0x5CE8D5A2BC84beb22a398CCA51996F7930313D61
  // mainnet coord: 0x5CE8D5A2BC84beb22a398CCA51996F7930313D61
  const keyhash = '0x8472ba59cf7134dfe321f4d61a430c4857e8b19cdd5230b09952a92671c24409';
  // testnet hash: 0x1770bdc7eec7771f7ba4ffd640f34260d7f095b79c92d34a5b2551d6f6cfd2be
  // mainnet hash: 0x8472ba59cf7134dfe321f4d61a430c4857e8b19cdd5230b09952a92671c24409

    // Deploy LUSD
    const lERC20Instance = await LERC20.deploy(
      "Lottery USD",
      "LUSD",
      "18"
    );
  
    await lERC20Instance.deployed();
  
    console.log("Lottery ERC20 deployed to:", lERC20Instance.address);

    // Deploy XCANA
    const xcanaInstance = await LERC20.deploy(
      "Staked CANA",
      "xCANA",
      "18"
    );
  
    await xcanaInstance.deployed();
  
    console.log("[xCANA] deployed to:", xcanaInstance.address);
  
    // Deploy Lottery[USDC to LUSD]
    const LotteryContract = await hre.ethers.getContractFactory("contracts/LotteryContractV3.sol:LotteryContract");

    const lotteryContractInstance = await LotteryContract.deploy(
        usdcAddress,
        lERC20Instance.address,
        ownerAddress,
        subid,
        keyhash,
        coordinatorAddress
    );

    await lotteryContractInstance.deployed();

    console.log("Lottery Contract deployed to:", lotteryContractInstance.address);

    tx = await lotteryContractInstance.setLotteryRules(
        1,
        2,
        '10000000',
        1,
        1
    )
    await tx.wait();

    console.log('Lottery Rules Set');
        
    tx = await lERC20Instance.addMinter(lotteryContractInstance.address);
    await tx.wait();
  
    console.log('Added minter')

    // Deploy Loser Lottery[LUSD to XCANA]
    const LoserLotteryContract = await hre.ethers.getContractFactory("contracts/LoserLotteryContractV3.sol:LoserLotteryContract");

    const loserContractInstance = await LoserLotteryContract.deploy(
        xcanaInstance.address,
        '1000000000000000000',
        lERC20Instance.address,
        ownerAddress,
        subid,
        keyhash,
        coordinatorAddress
    );

    await loserContractInstance.deployed();

    console.log("Lottery Contract deployed to:", loserContractInstance.address);

    tx = await loserContractInstance.setLotteryRules(
        1,
        2,
        '1000000000000000000',
        1,
        1
    )
    await tx.wait();

    console.log('Loser Lottery Rules Set');

    tx = await xcanaInstance.addMinter(loserContractInstance.address);
    await tx.wait();
  
    console.log('Added minter')


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
