// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
    const vibeTokenAddress = "0x3E81aDc0A3bf76928C0fBD0100bCEF12336748bB"

    const TestERC20 = await hre.ethers.getContractFactory('ERC20Def');
    const testERC20 = await TestERC20.attach(vibeTokenAddress);

    console.log(
      `[Vibe Token] Attached to: ${await testERC20.address}`
    );

    const VibeCheck = await hre.ethers.getContractFactory('VibeCheck');
    const vibeCheck = await VibeCheck.deploy(
      testERC20.address,
      'How do people like their ice cream?',
      "0",
      604800,
      1,
      30,
      3,
      6,
      "100000000000000000000",
      "50000000000000000000"
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

    let op1 = await vibeCheck.setOptions("Cup","Cone")
    let st1 = await vibeCheck.checkStartTime()

    const vibeCheck2 = await VibeCheck.deploy(
      testERC20.address,
      'Do you drink enough water everyday?',
      "0",
      604800,
      1,
      30,
      3,
      6,
      "100000000000000000000",
      "50000000000000000000"
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
    
    let op2 = await vibeCheck2.setOptions("Yes","No")
    let st2 = await vibeCheck2.checkStartTime()  

    tx = await testERC20.transfer(await vibeCheck.address,"10000000000000000000000")
    tx2 = await testERC20.transfer(await vibeCheck2.address,"10000000000000000000000")

    tx3= await vibeCheck.checkFee()
    console.log("Fee: ",tx3)

    console.log("[Question 1] Start Time: ",st1)
    console.log("[Question 2] Start Time: ",st2)
    
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
