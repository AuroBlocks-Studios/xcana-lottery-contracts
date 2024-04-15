const { expect } = require('chai');
const hre = require('hardhat');
const {ethers} = require('hardhat')

const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');

describe('Deploy Contracts', function () {
  async function deployContracts(){

    const TestERC20 = await hre.ethers.getContractFactory('ERC20Def');
    const testERC20 = await TestERC20.deploy('Test','TEST',100000000);
    await testERC20.deployed()
    console.log(
      `Deployed to: ${await testERC20.address}`
    );

    const VibeCheck = await hre.ethers.getContractFactory('VibeCheck');
    const vibeCheck = await VibeCheck.deploy(
      testERC20.address,
      'How do people like their coffee?',
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

    console.log(
        `Deployed to: ${await vibeCheck.address}`
      );
    
    tx = await testERC20.transfer(await vibeCheck.address,100000)
    // bal = await testERC20.balanceOf(await vibeCheck.address)
    // console.log('VibeCheck Contract Token Balance: ',bal)
      
    const [owner,player,referral] = await ethers.getSigners();
    console.log(
        `Owner: ${await owner.address}`
      );  
    console.log(
        `Player: ${await player.address}`
      );  

    return{
      testERC20,
      vibeCheck,
      owner,
      player,
      referral
    }
    }
    it("Check fee amount", async function () {
      const { testERC20,vibeCheck } = await loadFixture(deployContracts);
    //   console.log(await vibeCheck.address)
      expect(await vibeCheck.checkFee()).to.equal(1);
    });
    describe('Guessing', function () {
        it('Should store a guess', async function () {
          const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
          
          tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",15,{value: ethers.utils.parseEther("0.000000000000000001")});
          receipt = await tx.wait();
        //   console.log(receipt)
        //   console.log('#########')
          tx = await vibeCheck.connect(player).checkTotalGuesses()
        //   console.log(tx)
          tx = await vibeCheck.connect(player).checkMyGuess(player.address)
        //   console.log(tx)
          expect(tx).to.equal(15);
        });
        it('Should record if guessed', async function () {
          const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
          
          tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",15,{value: ethers.utils.parseEther("0.000000000000000001")});
          receipt = await tx.wait();

          tx = await vibeCheck.connect(player).checkIfPlayed(player.address)
        //   console.log(tx)
          expect(tx).to.equal(true);
        });
        it('Should not record if not guessed', async function () {
          const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
          

          tx = await vibeCheck.connect(player).checkIfPlayed(player.address)
        //   console.log(tx)
          expect(tx).to.equal(false);
        });
        it('Should store a players winnings', async function () {
          const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
          
          tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",28,{value: ethers.utils.parseEther("0.000000000000000001")});
          receipt = await tx.wait();
        //   console.log(receipt)
        //   console.log('#########')
        // tx = await vibeCheck.connect(player).checkTotalGuesses()
        //   console.log(tx)
          tx = await vibeCheck.connect(player).checkMyWinnings(player.address)
        //   console.log(tx)
          expect(tx).to.equal(100);
        });
        it('Should store a players referral address', async function () {
          const { testERC20,vibeCheck,player,referral } = await loadFixture(deployContracts);
          
          tx = await vibeCheck.connect(player).guess(referral.address,35,{value: ethers.utils.parseEther("0.000000000000000001")});
          receipt = await tx.wait();
        //   console.log(receipt)
        //   console.log('#########')
        // tx = await vibeCheck.connect(player).checkTotalGuesses()
        //   console.log(tx)
          tx = await vibeCheck.connect(player).checkMyReferral(player.address)
        //   console.log(tx)
          expect(tx).to.equal(referral.address);
        });
        it('Should increase total guess counter', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",15,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await vibeCheck.connect(player).checkTotalGuesses()
            // console.log(tx)
            
            expect(tx).to.equal(1);
          });
        it('Should not let player guess again', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",15,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await vibeCheck.connect(player).checkTotalGuesses()
            // console.log(tx)
            
            await expect(vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",15,{value: ethers.utils.parseEther("0.000000000000000001")})).to.be.revertedWith(
                "You have already guessed",
              );
          });  
        it('Should not let player guess more than 100', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            await expect(vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",101,{value: ethers.utils.parseEther("0.000000000000000001")})).to.be.revertedWith(
                "Value must be between 0-100",
              );
          });  
        it('Should not let player guess less than 1', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            await expect(vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",0,{value: ethers.utils.parseEther("0.000000000000000001")})).to.be.revertedWith(
                "Value must be between 0-100",
              );
          });  
        it('Should not allow incorrect gas fees', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            await expect(vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",10,{value: ethers.utils.parseEther("0.000000000000000002")})).to.be.revertedWith(
                "Incorrect fee amount",
              );
          });  
          //add test for start and end time
    })
    describe('Rewards', function () {
        it('Should get broad reward for higher broad guess', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",35,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await testERC20.connect(player).balanceOf(player.address)
            // console.log(tx)
            
            expect(tx).to.equal(50);
        });
        it('Should get broad reward for lower broad guess', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",25,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await testERC20.connect(player).balanceOf(player.address)
            // console.log(tx)
            
            expect(tx).to.equal(50);
        });
        it('Should get narrow reward for higher narrow guess', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",32,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await testERC20.connect(player).balanceOf(player.address)
            // console.log(tx)
            
            expect(tx).to.equal(100);
        });
        it('Should get narrow reward for lower narrow guess', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",27,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await testERC20.connect(player).balanceOf(player.address)
            // console.log(tx)
            
            expect(tx).to.equal(100);
        });
        it('Should get narrow reward for perfect guess', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",30,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await testERC20.connect(player).balanceOf(player.address)
            // console.log(tx)
            
            expect(tx).to.equal(100);
        });
        it('Should get no reward for out of range guess', async function () {
            const { testERC20,vibeCheck,player } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",10,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await testERC20.connect(player).balanceOf(player.address)
            // console.log(tx)
            
            expect(tx).to.equal(0);
        });
        it('Should give reward for referring [Broad]', async function () {
            const { testERC20,vibeCheck,player,referral } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess(referral.address,35,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await testERC20.connect(referral).balanceOf(referral.address)
            // console.log(tx)
            
            expect(tx).to.equal(5);
        });
        it('Should give reward for referring [Narrow]', async function () {
            const { testERC20,vibeCheck,player,referral } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess(referral.address,32,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await testERC20.connect(referral).balanceOf(referral.address)
            // console.log(tx)
            
            expect(tx).to.equal(10);
        });
        
    })
    describe('Average Calculation', function () {
        it('Should change average on new guess', async function () { 
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",24,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await vibeCheck.connect(owner).checkCurrentAverage()
            // console.log(tx)
            expect(tx).to.equal(27);
        }); 
        it('Should keep average as rounded off integer', async function () { 
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",25,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await vibeCheck.connect(owner).checkCurrentAverage()
            // console.log(tx)
            expect(tx).to.equal(27);
        });
        it('Should change average correctly after 2 guesses', async function () { 
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",25,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            tx = await vibeCheck.connect(owner).guess("0x0000000000000000000000000000000000000000",23,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // console.log(receipt)
            // console.log('#########')
            tx = await vibeCheck.connect(owner).checkCurrentAverage()
            // console.log(tx)
            expect(tx).to.equal(25);
        });
        it('Should change average correctly after 5 guesses', async function () { 
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);

            const [player2,playerx,player3,player4,player5] = await ethers.getSigners();
            
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",25,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // tx = await vibeCheck.connect(owner).checkCurrentAverage()
            // console.log(tx)
            tx = await vibeCheck.connect(player2).guess("0x0000000000000000000000000000000000000000",23,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // tx = await vibeCheck.connect(owner).checkCurrentAverage()
            // console.log(tx)
            tx = await vibeCheck.connect(player3).guess("0x0000000000000000000000000000000000000000",21,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // tx = await vibeCheck.connect(owner).checkCurrentAverage()
            // console.log(tx)
            tx = await vibeCheck.connect(player4).guess("0x0000000000000000000000000000000000000000",17,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            // tx = await vibeCheck.connect(owner).checkCurrentAverage()
            // console.log(tx)
            tx = await vibeCheck.connect(player5).guess("0x0000000000000000000000000000000000000000",10,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            tx = await vibeCheck.connect(owner).checkCurrentAverage()
            // console.log(tx)
            expect(tx).to.equal(20);
        });   
    })
    describe('Owner functions', function () {
        it('Should be able to check average', async function () {
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);  
            tx = await vibeCheck.connect(owner).checkCurrentAverage()
            expect(tx).to.equal(30);
        });   
        // it('Should be able to check all winnings', async function () {
        //     const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);
        //     tx = await vibeCheck.connect(player).guess(35,{value: ethers.utils.parseEther("0.000000000000000001")});
        //     receipt = await tx.wait();
        //     tx = await vibeCheck.connect(owner).guess(32,{value: ethers.utils.parseEther("0.000000000000000001")});
        //     receipt = await tx.wait();  
        //     tx = await vibeCheck.connect(owner).readAllWinnings()
        //     console.log(tx)
        //     expect(tx).to.equal(
        //       [
        //             "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        //             "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        //          ]
        //           [
        //             {
        //               "_hex": "0x32",
        //               "_isBigNumber": true,
        //             },
        //            {
        //               "_hex": "0x64",
        //               "_isBigNumber": true
        //             }
        //          ]
        //     );
        // });   
        it('Should be able to withdraw fees', async function () {
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",25,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();  
            bal = await vibeCheck.connect(owner).getContractBalance()
            tx = await vibeCheck.connect(owner).withdrawFees(owner.address)
            receipt = await tx.wait(); 
            balFin = await vibeCheck.connect(owner).getContractBalance()   
            expect(bal-balFin).to.equal(1);
        });
        it('Should be able to change narrow range', async function () {
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);  
            tx = await vibeCheck.connect(owner).setLimits(4,8)
            receipt = await tx.wait();
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",26,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            reward = await testERC20.connect(player).balanceOf(player.address)
            expect(reward).to.equal(100);
        });   
        it('Should be able to change broad range', async function () {
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);  
            tx = await vibeCheck.connect(owner).setLimits(4,8)
            receipt = await tx.wait();
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",22,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            reward = await testERC20.connect(player).balanceOf(player.address)
            expect(reward).to.equal(50);
        });   
        it('Should be able to change narrow reward', async function () {
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);  
            tx = await vibeCheck.connect(owner).setRewards(40,20)
            receipt = await tx.wait();
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",27,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            reward = await testERC20.connect(player).balanceOf(player.address)
            expect(reward).to.equal(40);
        });   
        it('Should be able to change broad reward', async function () {
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);  
            tx = await vibeCheck.connect(owner).setRewards(40,20)
            receipt = await tx.wait();
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",25,{value: ethers.utils.parseEther("0.000000000000000001")});
            receipt = await tx.wait();
            reward = await testERC20.connect(player).balanceOf(player.address)
            expect(reward).to.equal(20);
        });   
        it('Should be able to change playing fee', async function () {
            const { testERC20,vibeCheck,player,owner } = await loadFixture(deployContracts);  
            tx = await vibeCheck.connect(owner).setFeeAmount(2)
            receipt = await tx.wait();
            tx = await vibeCheck.connect(player).guess("0x0000000000000000000000000000000000000000",25,{value: ethers.utils.parseEther("0.000000000000000002")});
            receipt = await tx.wait();
            reward = await testERC20.connect(player).balanceOf(player.address)
            expect(reward).to.equal(50);
        });   
    })
});

  
