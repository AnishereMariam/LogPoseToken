const hre = require("hardhat");
async function main() {
  const token = await hre.ethers.getContractAt("LogPoseToken", "0x95Ce6Fd9cF58dEBb27A5CEbAaeEc038AED8bf5bf");
  console.log("Total Supply:", await token.totalSupply());
  console.log("Decimals:", await token.decimals());
}
main().catch(console.error);