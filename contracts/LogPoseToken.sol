// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LogPoseToken
 * @dev Basic ERC20 Token for LPT with initial supply assigned to deployer
 */
contract LogPoseToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("LogPose Token", "LPT") Ownable(msg.sender) {
        require(initialSupply > 0, "Initial supply must be greater than 0");
        _mint(msg.sender, initialSupply); // Mint initial supply to owner
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        _burn(msg.sender, amount);
    }
}