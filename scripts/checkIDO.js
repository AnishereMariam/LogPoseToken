const hre = require("hardhat");
async function main() {
  const ido = await hre.ethers.getContractAt("LogPoseIDO", "0x5Bf2B9EA607C27b0F7D6F0EcffeAf00082B7529f");
  const token = await hre.ethers.getContractAt("LogPoseToken", "0x95Ce6Fd9cF58dEBb27A5CEbAaeEc038AED8bf5bf");
  console.log("Rate:", await ido.rate());
  console.log("Total Tokens for Sale:", await ido.totalTokensForSale());
  console.log("Tokens Sold:", await ido.tokensSold());
  console.log("LPT Balance in IDO:", await token.balanceOf("0x5Bf2B9EA607C27b0F7D6F0EcffeAf00082B7529f"));
  console.log("PUSD Address:", await ido.pusdToken());
}
main().catch(console.error);