const hre = require("hardhat");
async function main() {
  const pusd = await hre.ethers.getContractAt("IERC20", "0xDd7639e3920426de6c59A1009C7ce2A9802d0920");
  console.log("PUSD Decimals:", await pusd.decimals());
}
main().catch(console.error);