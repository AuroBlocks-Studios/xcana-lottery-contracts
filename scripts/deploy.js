// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
  const TestERC20 = await hre.ethers.getContractFactory('ERC20Def');
    const testERC20 = await TestERC20.deploy('Vibe','VIBE',100000000);
    await testERC20.deployed()
    console.log(
      `[Vibe Token] Deployed to: ${await testERC20.address}`
    );

    const VibeCheck = await hre.ethers.getContractFactory('VibeCheck');
    const vibeCheck = await VibeCheck.deploy(
      testERC20.address,
      'How do people like their coffee?',
      'Hot',
      'Cold',
      100000,
      1,
      30,
      3,
      6,
      100,
      50
    );//address _token, 
    // string memory _question, 
    // uint256 _duration, 
    // uint256 _feeAmount,
    // uint256 _initialAverage, 
    // uint256 _narrowLimit, 
    // uint256 _broadLimit,
    // uint256 _narrowReward,
    //  uint256 _broadReward
    
    await vibeCheck.deployed()
    console.log(
        `[Question 1] Deployed to: ${await vibeCheck.address}`
      );
    const vibeCheck2 = await VibeCheck.deploy(
      testERC20.address,
      'Do you go to the gym regularly?',
      'Yes',
      'No',
      100000,
      1,
      30,
      3,
      6,
      100,
      50
    );//address _token, 
    // string memory _question, 
    // uint256 _duration, 
    // uint256 _feeAmount,
    // uint256 _initialAverage, 
    // uint256 _narrowLimit, 
    // uint256 _broadLimit,
    // uint256 _narrowReward,
    //  uint256 _broadReward
    
    await vibeCheck2.deployed()
    console.log(
        `[Question 2] Deployed to: ${await vibeCheck2.address}`
      );
    
    tx = await testERC20.transfer(await vibeCheck.address,100000)
    tx2 = await testERC20.transfer(await vibeCheck.address,100000)

    tx3= await vibeCheck.checkFee()
    console.log(tx3)  
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
