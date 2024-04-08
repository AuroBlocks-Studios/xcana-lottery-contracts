const hre = require('hardhat');
const {ethers} = require('hardhat')
async function main() {
    // const VibeCheck = await hre.ethers.getContractFactory('VibeCheck');
    // const vibeCheck = await VibeCheck.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")

    const TestERC20 = await hre.ethers.getContractFactory('ERC20Def');
    const testERC20 = await TestERC20.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3')

    tx = await ethers.provider.getBalance("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
    console.log("Bal:",tx)
    // tx = await vibeCheck.checkFee()
    // console.log("Fees:",tx)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });