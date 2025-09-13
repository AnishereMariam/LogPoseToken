# LogPoseToken Project Test Cases

## LogPoseToken (ERC-20) Smart Contract

### 1. Ownership
- **Test:** Should set the right owner
- **Input:** Deploy LogPoseToken
- **Expected Output:** `owner()` returns deployer address

### 2. Initial Supply
- **Test:** Should assign the total supply to owner
- **Input:** Deploy LogPoseToken with 500M supply
- **Expected Output:** `balanceOf(owner)` equals 500,000,000 LPT

### 3. Minting
- **Test:** Should allow owner to mint tokens
- **Input:** Owner calls `mint(addr1, 100 LPT)`
- **Expected Output:** `balanceOf(addr1)` equals 100 LPT

### 4. Burning
- **Test:** Should allow burning tokens
- **Input:** Owner calls `burn(100 LPT)`
- **Expected Output:** `balanceOf(owner)` decreases by 100 LPT

---

## LogPoseIDO Smart Contract

### 1. Token Purchase
- **Test:** Should allow buying tokens
- **Input:** addr1 approves 10 PUSD, calls `buyTokens(10)`
- **Expected Output:** `balanceOf(addr1)` increases by 1,000 LPT; `tokensSold()` increases by 1,000 LPT

---


