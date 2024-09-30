const { expect } = require('chai');
const hre = require('hardhat');
const {ethers} = require('hardhat');
const config = require("../scripts/config.json");

const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');

describe('Deploy Contracts', function () {
  async function deployContracts(){

    const [owner, player] = await ethers.getSigners();
    console.log(
        `Owner: ${await owner.address}`
      );  
    console.log(
        `Player: ${await player.address}`
      );

    // Deploy USDC
    const LERC20 = await hre.ethers.getContractFactory("LERC20");
    const usdcInstance = await LERC20.deploy(
      "USDC",
      "USDC",
      "6"
    );
  
    await usdcInstance.deployed();
  
    console.log("USDC deployed to:", usdcInstance.address);
  
    let tx = await usdcInstance.mint(owner.address,'10000000');
    await tx.wait();

    tx = await usdcInstance.mint(player.address,'10000000');
    await tx.wait();

    // Deploy LUSD
    const lERC20Instance = await LERC20.deploy(
      "Lottery USD",
      "LUSD",
      "18"
    );
  
    await lERC20Instance.deployed();
  
    console.log("Lottery ERC20 deployed to:", lERC20Instance.address);

    // Deploy LUSD
    const xcanaInstance = await LERC20.deploy(
      "Staked CANA",
      "xCANA",
      "18"
    );
  
    await xcanaInstance.deployed();
  
    console.log("[xCANA] deployed to:", xcanaInstance.address);


    const MockVRF = await hre.ethers.getContractFactory('VRFCoordinatorV2_5Mock');
    const mockVRF = await MockVRF.deploy(
        "100000000000000000",
        "1000000000",
        "4086131897999514"
    )

    console.log("Mock VRF deployed to:", mockVRF.address);

    tx = await mockVRF.createSubscription();
    
    let subid = await tx.wait();
    subid = subid.events[0].args.subId;
    subid = subid.toString()

    console.log('Sub ID: ', subid);
    
    tx = mockVRF.fundSubscription(subid, '100000000000000000000');
    console.log('Subscription Funded');
  
    // Deploy Lottery[USDC to LUSD]
    const LotteryContract = await hre.ethers.getContractFactory("contracts/LotteryContractV3.sol:LotteryContract");

    const lotteryContractInstance = await LotteryContract.deploy(
        usdcInstance.address,
        lERC20Instance.address,
        owner.address,
        subid,
        '0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae',
        mockVRF.address
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

    tx = await mockVRF.addConsumer(subid,lotteryContractInstance.address);
    console.log('Consumer added')

    // Deploy Loser Lottery[LUSD to XCANA]
    const LoserLotteryContract = await hre.ethers.getContractFactory("contracts/LoserLotteryContractV3.sol:LoserLotteryContract");

    const loserContractInstance = await LoserLotteryContract.deploy(
        xcanaInstance.address,
        '1000000000000000000',
        lERC20Instance.address,
        owner.address,
        subid,
        '0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae',
        mockVRF.address
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

    tx = await mockVRF.addConsumer(subid,loserContractInstance.address);
    console.log('Consumer added')
        

    return{
        owner,
        player,
        mockVRF,
        usdcInstance,
        lERC20Instance,
        xcanaInstance,
        lotteryContractInstance,
        loserContractInstance
    }
    }
    it("Check if USDC is deployed", async function () {
      const { usdcInstance} = await loadFixture(deployContracts);
    //   console.log(await vibeCheck.address)
      expect(await usdcInstance.name()).to.equal("USDC");
    });
    describe('Play', function () {
        it('Should be able to enter the lottery', async function () {
          const { player,usdcInstance,lotteryContractInstance} = await loadFixture(deployContracts);
          
          tx = await usdcInstance.connect(player).approve(lotteryContractInstance.address,"10000000000000000000")
          receipt = await tx.wait();
          console.log("Approved")

          tx = await lotteryContractInstance.connect(player).enterLottery();
          receipt = await tx.wait();

          finBal = await usdcInstance.balanceOf(lotteryContractInstance.address);
          console.log("USDC Bal of lottery contract: ", finBal) 

          expect(finBal).to.equal("10000000");
        });

        it('Should be able to enter the lottery with 2 users', async function () {
            const { owner, player, usdcInstance, lotteryContractInstance, mockVRF} = await loadFixture(deployContracts);
            
            tx = await usdcInstance.connect(owner).approve(lotteryContractInstance.address,"10000000000000000000")
            receipt = await tx.wait();
            console.log("Approved")

            tx = await usdcInstance.connect(player).approve(lotteryContractInstance.address,"10000000000000000000")
            receipt = await tx.wait();
            console.log("Approved")
  
            tx = await lotteryContractInstance.connect(owner).enterLottery();
            receipt = await tx.wait();

            tx = await lotteryContractInstance.connect(player).enterLottery();
            receipt = await tx.wait();
  
            finBal = await usdcInstance.balanceOf(lotteryContractInstance.address);
            console.log("USDC Bal of lottery contract: ", finBal)
            
            let reqId = await lotteryContractInstance.currentReqId();
            console.log('Req ID: ',reqId)

            tx = await mockVRF.fulfillRandomWords(reqId,lotteryContractInstance.address);
            receipt = await tx.wait();
            console.log("Request fulfilled")
            
            let testCase = (finBal == "20000000")
  
            expect(testCase).to.equal(true);
          }); 

        it('Should be able to enter the loser lottery with 2 users', async function () {
            const { owner, player, lERC20Instance, xcanaInstance, loserContractInstance, mockVRF} = await loadFixture(deployContracts);
            
            tx = await lERC20Instance.mint(owner.address,"1000000000000000000")
            receipt = await tx.wait();
            tx = await lERC20Instance.mint(player.address,"1000000000000000000")
            receipt = await tx.wait();
            console.log("LUSD Minted")

            tx = await lERC20Instance.connect(owner).approve(loserContractInstance.address,"1000000000000000000")
            receipt = await tx.wait();
            console.log("Approved")

            tx = await lERC20Instance.connect(player).approve(loserContractInstance.address,"1000000000000000000")
            receipt = await tx.wait();
            console.log("Approved")
  
            tx = await loserContractInstance.connect(owner).enterLottery();
            receipt = await tx.wait();

            tx = await loserContractInstance.connect(player).enterLottery();
            receipt = await tx.wait();
  
            finBal = await lERC20Instance.balanceOf(owner.address);
            console.log("LUSD Bal of player1: ", finBal)

            finBalTwo = await lERC20Instance.balanceOf(player.address);
            console.log("LUSD Bal of player2: ", finBalTwo)
            
            let reqId = await loserContractInstance.currentReqId();
            console.log('Req ID: ',reqId)

            tx = await mockVRF.fulfillRandomWords(reqId,loserContractInstance.address);
            receipt = await tx.wait();
            console.log("Request fulfilled")
            
            let testCase = (finBal == "0") && (finBalTwo == "0")
  
            expect(testCase).to.equal(true);
          });        

    })


    describe('Settle Lottery', function () {
      
        it('Should be able to settle the lottery', async function () {
            const { owner, player, usdcInstance, lotteryContractInstance, mockVRF} = await loadFixture(deployContracts);
            
            tx = await usdcInstance.connect(owner).approve(lotteryContractInstance.address,"10000000000000000000")
            receipt = await tx.wait();
            console.log("Approved")

            tx = await usdcInstance.connect(player).approve(lotteryContractInstance.address,"10000000000000000000")
            receipt = await tx.wait();
            console.log("Approved")
  
            tx = await lotteryContractInstance.connect(owner).enterLottery();
            receipt = await tx.wait();

            tx = await lotteryContractInstance.connect(player).enterLottery();
            receipt = await tx.wait();
  
            let reqId = await lotteryContractInstance.currentReqId()
            console.log('Req ID: ',reqId)

            tx = await mockVRF.fulfillRandomWords(reqId,lotteryContractInstance.address);
            receipt = await tx.wait();
            console.log("Request fulfilled")

            let randomNumber = await lotteryContractInstance.randomResult();
            console.log("Random Number: ", randomNumber);
            
            tx = await lotteryContractInstance.settleLottery()
            receipt = await tx.wait();
            console.log("Lottery settled")

            finBal = await usdcInstance.balanceOf(lotteryContractInstance.address);
            console.log("USDC Bal of lottery contract: ", finBal)

            let testCase = (finBal == "0");
  
            expect(testCase).to.equal(true);
          });

        it('Should be able to settle the loser lottery', async function () {
            const { owner, player, lERC20Instance, xcanaInstance, loserContractInstance, mockVRF} = await loadFixture(deployContracts);
            
            tx = await lERC20Instance.mint(owner.address,"1000000000000000000")
            receipt = await tx.wait();
            tx = await lERC20Instance.mint(player.address,"1000000000000000000")
            receipt = await tx.wait();
            console.log("LUSD Minted")

            tx = await lERC20Instance.connect(owner).approve(loserContractInstance.address,"1000000000000000000")
            receipt = await tx.wait();
            console.log("Approved")

            tx = await lERC20Instance.connect(player).approve(loserContractInstance.address,"1000000000000000000")
            receipt = await tx.wait();
            console.log("Approved")
  
            tx = await loserContractInstance.connect(owner).enterLottery();
            receipt = await tx.wait();

            tx = await loserContractInstance.connect(player).enterLottery();
            receipt = await tx.wait();
            
            let reqId = await loserContractInstance.currentReqId();
            console.log('Req ID: ',reqId)

            tx = await mockVRF.fulfillRandomWords(reqId,loserContractInstance.address);
            receipt = await tx.wait();
            console.log("Request fulfilled")

            let randomNumber = await loserContractInstance.randomResult();
            console.log("Random Number: ", randomNumber);
            
            tx = await loserContractInstance.settleLottery()
            receipt = await tx.wait();
            console.log("Lottery settled")

            finBalOne = await xcanaInstance.balanceOf(owner.address);
            console.log("XCANA Bal of player1: ", finBalOne)

            finBalTwo = await xcanaInstance.balanceOf(player.address);
            console.log("XCANA Bal of player2: ", finBalTwo)

            let testCase = (finBalOne != "0") || (finBalTwo != "0");
  
            expect(testCase).to.equal(true);
          });


    })
    describe('Different Random values', function () {
      
        it('Should be able to settle the lottery [Random Number = 0]', async function () {
            const { owner, player, usdcInstance, lotteryContractInstance, mockVRF} = await loadFixture(deployContracts);
            
            tx = await usdcInstance.connect(owner).approve(lotteryContractInstance.address,"10000000000000000000")
            receipt = await tx.wait();
            console.log("Approved")

            tx = await usdcInstance.connect(player).approve(lotteryContractInstance.address,"10000000000000000000")
            receipt = await tx.wait();
            console.log("Approved")
  
            tx = await lotteryContractInstance.connect(owner).enterLottery();
            receipt = await tx.wait();

            tx = await lotteryContractInstance.connect(player).enterLottery();
            receipt = await tx.wait();
  
            let reqId = await lotteryContractInstance.currentReqId()
            console.log('Req ID: ',reqId)

            tx = await mockVRF.fulfillRandomWords(reqId,lotteryContractInstance.address);
            receipt = await tx.wait();
            console.log("Request fulfilled")

            tx = await lotteryContractInstance.changeRandomResult(0);
            receipt = await tx.wait();

            let randomNumber = await lotteryContractInstance.randomResult();
            console.log("Random Number: ", randomNumber);
            
            tx = await lotteryContractInstance.settleLottery()
            receipt = await tx.wait();
            console.log("Lottery settled")

            finBal = await usdcInstance.balanceOf(lotteryContractInstance.address);
            console.log("USDC Bal of lottery contract: ", finBal)

            let testCase = (finBal == "0");
  
            expect(testCase).to.equal(true);
          });


    })
    describe('Test Owner functions', function () {
      
        // it('Should be able to settle the lottery', async function () {
        //     const { owner, player, usdcInstance, lotteryContractInstance, mockVRF} = await loadFixture(deployContracts);
            
        //   });



    })
   
});

  