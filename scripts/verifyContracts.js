const hre = require("hardhat");

async function main() {
    // Contract addresses
    const TOKEN_ADDRESS = "0x95Ce6Fd9cF58dEBb27A5CEbAaeEc038AED8bf5bf";
    const IDO_ADDRESS = "0x5Bf2B9EA607C27b0F7D6F0EcffeAf00082B7529f";
    const PUSD_ADDRESS = "0xDd7639e3920426de6c59A1009C7ce2A9802d0920";
    
    try {
        console.log("\n=== Starting Contract Verification ===");
        
        // 1. Verify LogPoseToken
        console.log("\n1. Verifying LogPoseToken:");
        try {
            await hre.run("verify:verify", {
                address: TOKEN_ADDRESS,
                constructorArguments: [
                    ethers.parseEther("500000000") // Initial supply
                ],
            });
            console.log("✅ LogPoseToken verified successfully");
        } catch (error) {
            if (error.message.includes("Already Verified")) {
                console.log("✅ LogPoseToken already verified");
            } else {
                console.log("❌ LogPoseToken verification failed:", error.message);
            }
        }

        // 2. Verify IDO Contract
        console.log("\n2. Verifying LogPoseIDO:");
        try {
            await hre.run("verify:verify", {
                address: IDO_ADDRESS,
                constructorArguments: [
                    TOKEN_ADDRESS,
                    PUSD_ADDRESS,
                    100, // rate
                    ethers.parseEther("125000000") // totalTokensForSale
                ],
            });
            console.log("✅ LogPoseIDO verified successfully");
        } catch (error) {
            if (error.message.includes("Already Verified")) {
                console.log("✅ LogPoseIDO already verified");
            } else {
                console.log("❌ LogPoseIDO verification failed:", error.message);
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch(console.error);