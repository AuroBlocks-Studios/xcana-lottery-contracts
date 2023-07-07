const { expect } = require('chai');
const { ethers } = require('hardhat');
// const erc20Abi = require('../contracts/abi/erc20.json');

describe('ERC1155Converter', function () {
  let counterContractInstance;
  beforeEach(async function () {
    // const accounst = await ethers.getSigners();
    const Counter = await ethers.getContractFactory('Counter');
    const counterContract = await Counter.deploy();
    counterContractInstance = await counterContract.deployed();
  });
  // test case to increase the counter value
  it('should increase the counter value', async function () {
    await counterContractInstance.inc();
    const counterValue = await counterContractInstance.get();
    expect(counterValue).to.equal(1);
  });
  // test case to decrease the counter value
  it('should decrease the counter value', async function () {
    await counterContractInstance.dec();
    const counterValue = await counterContractInstance.get();
    expect(counterValue).to.equal(-1);
  });
});
