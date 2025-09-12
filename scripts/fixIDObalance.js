const hre = require("hardhat");

// PUSD ABI with 0 decimals
const PUSD_ABI = [
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address,uint256) returns (bool)",
    "function approve(address,uint256) returns (bool)"
];

async function main() {
    try {
        // Get contract instances
        const pusd = await hre.ethers.getContractAt(PUSD_ABI, "0xDd7639e3920426de6c59A1009C7ce2A9802d0920");
        const ido = await hre.ethers.getContractAt("LogPoseIDO", "0x5Bf2B9EA607C27b0F7D6F0EcffeAf00082B7529f");
        const lptToken = await hre.ethers.getContractAt("LogPoseToken", await ido.lptToken());

        console.log("\nChecking Contract States:");
        console.log("PUSD Decimals:", await pusd.decimals());
        console.log("PUSD Balance in IDO:", await pusd.balanceOf(await ido.getAddress()));
        console.log("LPT Decimals:", await lptToken.decimals());
        console.log("LPT Balance in IDO:", await lptToken.balanceOf(await ido.getAddress()));

        // Calculate token amounts (note: PUSD uses 0 decimals, LPT uses 18)
        const totalTokensForSale = await ido.totalTokensForSale();
        const lptBalance = await lptToken.balanceOf(await ido.getAddress());
        
        if (lptBalance < totalTokensForSale) {
            console.log("\nNeed to transfer LPT to IDO...");
            const [signer] = await hre.ethers.getSigners();
            const amountNeeded = totalTokensForSale - lptBalance;
            
            // Check LPT balance
            const ownerBalance = await lptToken.balanceOf(signer.address);
            if (ownerBalance < amountNeeded) {
                console.log("Minting additional LPT...");
                const mintTx = await lptToken.mint(signer.address, amountNeeded);
                await mintTx.wait();
                console.log("Minted LPT successfully");
            }

            // Transfer to IDO
            console.log("Transferring LPT to IDO...");
            const transferTx = await lptToken.transfer(await ido.getAddress(), amountNeeded);
            await transferTx.wait();
            console.log("Transferred", amountNeeded.toString(), "LPT to IDO");
        }

        // Final state check
        console.log("\nFinal Contract States:");
        console.log("PUSD Balance in IDO:", await pusd.balanceOf(await ido.getAddress()));
        console.log("LPT Balance in IDO:", await lptToken.balanceOf(await ido.getAddress()));
        console.log("Total Tokens for Sale:", totalTokensForSale.toString());
        console.log("Tokens Available:", (await lptToken.balanceOf(await ido.getAddress())).toString());
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});