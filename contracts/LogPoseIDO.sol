// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LogPoseIDO
 * @dev IDO contract for selling LPT in exchange for PUSD
 */
contract LogPoseIDO is Ownable {
    IERC20 public lptToken; // Token being sold (LogPose Token)
    IERC20 public pusdToken; // Payment token (PUSD)
    uint256 public rate;     // Number of LPT tokens per 1 PUSD (scaled by decimals)
    uint256 public totalTokensForSale; // Total LPT tokens available for sale
    uint256 public tokensSold; // Track sold tokens

    event TokensPurchased(address indexed buyer, uint256 amountPUSD, uint256 amountLPT);
    event RateUpdated(uint256 oldRate, uint256 newRate);
    event TokensWithdrawn(address indexed to, uint256 amount);
    event PaymentsWithdrawn(address indexed to, uint256 amount);

    constructor(address _lptToken, address _pusdToken, uint256 _rate, uint256 _totalTokensForSale) Ownable(msg.sender) {
        require(_lptToken != address(0) && _pusdToken != address(0), "Invalid token address");
        require(_rate > 0, "Rate must be > 0");
        require(_totalTokensForSale > 0, "Total tokens for sale must be > 0");

        lptToken = IERC20(_lptToken);
        pusdToken = IERC20(_pusdToken);
        rate = _rate;
        totalTokensForSale = _totalTokensForSale;
    }

    /**
     * @notice Buy LPT using PUSD
     * @param amountPUSD Amount of PUSD user wants to spend
     */
    function buyTokens(uint256 amountPUSD) external {
    require(amountPUSD > 0, "Amount must be > 0");
    require(tokensSold < totalTokensForSale, "All tokens sold");

    // Convert PUSD amount (0 decimals) to LPT amount (18 decimals)
    uint256 amountLPT = amountPUSD * rate * 10**18;
    require(amountLPT > 0, "Invalid LPT amount");
    require(tokensSold + amountLPT <= totalTokensForSale, "Exceeds available tokens");
    require(lptToken.balanceOf(address(this)) >= amountLPT, "Not enough LPT in contract");

    // Transfer PUSD from buyer to contract (0 decimals)
    require(pusdToken.transferFrom(msg.sender, address(this), amountPUSD), "PUSD transfer failed");

    // Transfer LPT to buyer (18 decimals)
    require(lptToken.transfer(msg.sender, amountLPT), "LPT transfer failed");

    tokensSold += amountLPT;
    emit TokensPurchased(msg.sender, amountPUSD, amountLPT);
}

    /**
     * @notice Withdraw unsold LPT tokens
     */
    function withdrawLPT(uint256 amount) external onlyOwner {
        require(amount <= totalTokensForSale - tokensSold, "Invalid withdrawal amount");
        require(lptToken.transfer(owner(), amount), "Withdraw LPT failed");
        emit TokensWithdrawn(owner(), amount);
    }

    /**
     * @notice Withdraw collected PUSD tokens
     */
    function withdrawPUSD(uint256 amount) external onlyOwner {
        require(pusdToken.transfer(owner(), amount), "Withdraw PUSD failed");
        emit PaymentsWithdrawn(owner(), amount);
    }

    /**
     * @notice Update sale rate
     */
    function setRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be > 0");
        emit RateUpdated(rate, newRate);
        rate = newRate;
    }
}