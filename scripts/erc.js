const hre = require('hardhat');

async function main() {
    const TokenA = await hre.ethers.getContractFactory('contracts/ERC20Def.sol:ERC20Def');
    const tokenA = await TokenA.attach("0x47607BbB2d39D2F7866af8B3060d6D96c0e54E3a");
    await tokenA.deployed()
    console.log(
      `[Token A] Deployed to: ${await tokenA.address}`
    );

    bal = await tokenA.balanceOf("0x758f7700f6310c97b9c386e65336f50d6ff6780c")
    console.log("[Token A] Initial Balance:",bal)
    tx = await tokenA.transfer("0xD19f62b5A721747A04b969C90062CBb85D4aAaA8","900000000000000000000000000")
    // console.log(tx)
    bal = await tokenA.balanceOf("0x758f7700f6310c97b9c386e65336f50d6ff6780c")
    console.log("[Token A] Final Balance:",bal)
    
    // const TokenB = await hre.ethers.getContractFactory('contracts/ERC20Def.sol:ERC20Def');
    // const tokenB = await TokenB.deploy("CTT","CTT","1000000000000000000000000000");
    // await tokenB.deployed()
    // console.log(
    //   `[Token B] Deployed to: ${await tokenB.address}`
    // );
    // bal = await tokenB.balanceOf("0x758f7700f6310c97b9c386e65336f50d6ff6780c")
    // console.log("[Token B] Initial Balance:",bal)
    // tx = await tokenB.transfer("0xD19f62b5A721747A04b969C90062CBb85D4aAaA8","900000000000000000000000000")
    // bal = await tokenB.balanceOf("0x758f7700f6310c97b9c386e65336f50d6ff6780c")
    // console.log("[Token B] Final Balance:",bal)

    // const TokenC = await hre.ethers.getContractFactory('contracts/ERC20Def.sol:ERC20Def');
    // const tokenC = await TokenC.deploy("USDT","USDT","1000000000000000000000000000");
    // await tokenC.deployed()
    // console.log(
    //   `[Token C] Deployed to: ${await tokenC.address}`
    // );
    // bal = await tokenC.balanceOf("0x758f7700f6310c97b9c386e65336f50d6ff6780c")
    // console.log("[Token C] Initial Balance:",bal)
    // tx = await tokenC.transfer("0xD19f62b5A721747A04b969C90062CBb85D4aAaA8","900000000000000000000000000")
    // bal = await tokenC.balanceOf("0x758f7700f6310c97b9c386e65336f50d6ff6780c")
    // console.log("[Token C] Final Balance:",bal)

    // const TokenD = await hre.ethers.getContractFactory('contracts/ERC20Def.sol:ERC20Def');
    // const tokenD = await TokenD.deploy("SHIB","SHIB","1000000000000000000000000000");
    // await tokenD.deployed()
    // console.log(
    //   `[Token D] Deployed to: ${await tokenD.address}`
    // );
    // bal = await tokenD.balanceOf("0x758f7700f6310c97b9c386e65336f50d6ff6780c")
    // console.log("[Token D] Initial Balance:",bal)
    // tx = await tokenD.transfer("0xD19f62b5A721747A04b969C90062CBb85D4aAaA8","900000000000000000000000000")
    // bal = await tokenD.balanceOf("0x758f7700f6310c97b9c386e65336f50d6ff6780c")
    // console.log("[Token D] Final Balance:",bal)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });