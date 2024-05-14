const hre = require('hardhat');
const {ethers} = require('hardhat')
async function main() {
    const TestERC20 = await hre.ethers.getContractFactory('ERC20Def');
    const testERC20 = await TestERC20.attach('0x3E81aDc0A3bf76928C0fBD0100bCEF12336748bB')

    // const VibeCheck = await hre.ethers.getContractFactory('VibeCheck');
    // const vibeCheck = await VibeCheck.attach("0xf9062B2CF164062C58878a602181Fdc1Ec0b06b8")

    // tx = await vibeCheck.checkCurrentAverage()
    // console.log("Avg:",tx)

    // guess = await vibeCheck.guess("0x0000000000000000000000000000000000000000",25,{value: ethers.utils.parseEther("0.000000000000000001")})
    // receipt = await guess.wait();
    // console.log(receipt)

    // console.log(ethers.utils.parseEther("0.000000000000000001"))

    // check = await vibeCheck.checkIfPlayed("0x758F7700F6310c97b9c386e65336f50d6fF6780c")
    // console.log(check)
    tx2 = await testERC20.transfer("0x5b93b682423de253daf64165500dCecD7F349D28","10000000000000000000000")

    vibeBal = await testERC20.balanceOf("0x5b93b682423de253daf64165500dCecD7F349D28")
    console.log(vibeBal)
    vibeBal = await testERC20.balanceOf("0x758F7700F6310c97b9c386e65336f50d6fF6780c")
    console.log(vibeBal)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });