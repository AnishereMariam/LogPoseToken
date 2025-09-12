import { expect } from "chai";
import { ethers } from "hardhat";
import { LogPoseToken } from "../typechain-types";

describe("LogPoseToken", function () {
  let token: LogPoseToken;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const LogPoseTokenFactory = await ethers.getContractFactory("LogPoseToken");
    // Pass initial supply to constructor
    token = await LogPoseTokenFactory.deploy(ethers.parseEther("500000000"));
    await token.waitForDeployment();
  });

  it("Should set the right owner", async function () {
    expect(await token.owner()).to.equal(owner.address);
  });

  it("Should assign the total supply to owner", async function () {
    const totalSupply = ethers.parseEther("500000000");
    expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
  });

  it("Should allow owner to mint tokens", async function () {
    await token.mint(addr1.address, ethers.parseEther("100"));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));
  });

  it("Should allow burning tokens", async function () {
    await token.burn(ethers.parseEther("100"));
    expect(await token.balanceOf(owner.address)).to.equal(ethers.parseEther("499999900"));
  });
});