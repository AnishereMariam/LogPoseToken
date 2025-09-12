import { expect } from "chai";
import { ethers } from "hardhat";
import { LogPoseToken, LogPoseIDO, MockPUSD } from "../typechain-types";

describe("LogPoseIDO", function () {
  let token: LogPoseToken;
  let ido: LogPoseIDO;
  let pusd: MockPUSD;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy MockPUSD (0 decimals)
    const MockPUSDFactory = await ethers.getContractFactory("MockPUSD");
    pusd = await MockPUSDFactory.deploy(1000); // No need for parseEther since 0 decimals
    await pusd.waitForDeployment();

    // Deploy LogPoseToken (18 decimals)
    const LogPoseTokenFactory = await ethers.getContractFactory("LogPoseToken");
    token = await LogPoseTokenFactory.deploy(ethers.parseEther("500000000"));
    await token.waitForDeployment();

    // Deploy LogPoseIDO
    const LogPoseIDOFactory = await ethers.getContractFactory("LogPoseIDO");
    ido = await LogPoseIDOFactory.deploy(
      await token.getAddress(),
      await pusd.getAddress(),
      100, // rate
      ethers.parseEther("125000000") // totalTokensForSale in 18 decimals
    );
    await ido.waitForDeployment();

    // Transfer LPT to IDO contract
    await token.transfer(await ido.getAddress(), ethers.parseEther("125000000"));

    // Transfer PUSD to addr1 (0 decimals) and approve IDO
    await pusd.transfer(addr1.address, 100); // No parseEther needed
    await pusd.connect(addr1).approve(await ido.getAddress(), 100);
  });

  it("Should allow buying tokens", async function () {
    await ido.connect(addr1).buyTokens(10); // 10 PUSD (0 decimals)
    const expectedLPT = ethers.parseEther("1000"); // 10 * 100 * 10^18
    expect(await token.balanceOf(addr1.address)).to.equal(expectedLPT);
    expect(await ido.tokensSold()).to.equal(expectedLPT);
  });
});