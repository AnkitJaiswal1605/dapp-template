const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAppTemplate", function () {
  it("Should return the new value once it's updated", async function () {
    const DAppTemplate = await ethers.getContractFactory("DAppTemplate");
    const dappTemplate = await DAppTemplate.deploy();
    await dappTemplate.deployed();

    const setValueTx = await dappTemplate.set("Hello, world!");

    // wait until the transaction is mined
    await setValueTx.wait();

    expect(await dappTemplate.get()).to.equal("Hello, world!");
  });
});
