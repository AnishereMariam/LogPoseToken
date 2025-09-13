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

## Test Run Results (September 13, 2025)

```
All smart contract test cases passed:

Lock
  Deployment
    ✔ Should set the right unlockTime
    ✔ Should set the right owner
    ✔ Should receive and store the funds to lock
    ✔ Should fail if the unlockTime is not in the future
  Withdrawals
    Validations
      ✔ Should revert with the right error if called too soon
      ✔ Should revert with the right error if called from another account
      ✔ Shouldn't fail if the unlockTime has arrived and the owner calls it
    Events
      ✔ Should emit an event on withdrawals
    Transfers
      ✔ Should transfer the funds to the owner

LogPoseIDO
  ✔ Should allow buying tokens

LogPoseToken
  ✔ Should set the right owner
  ✔ Should assign the total supply to owner
  ✔ Should allow owner to mint tokens
  ✔ Should allow burning tokens

14 passing (577ms)
```


·············································································································
|  Solidity and Network Configuration                                                                       │
························|·················|···············|·················|································
|  Solidity: 0.8.30     ·  Optim: true    ·  Runs: 200    ·  viaIR: true    ·     Block: 30,000,000 gas     │
························|·················|···············|·················|································
|  Methods                                                                                                  │
························|·················|···············|·················|················|···············
|  Contracts / Methods  ·  Min            ·  Max          ·  Avg            ·  # calls       ·  usd (avg)   │
························|·················|···············|·················|················|···············
|  Lock                 ·                                                                                   │
························|·················|···············|·················|················|···············
|      withdraw         ·              -  ·            -  ·         33,656  ·             7  ·           -  │
························|·················|···············|·················|················|···············
|  LogPoseIDO           ·                                                                                   │
························|·················|···············|·················|················|···············
|      buyTokens        ·              -  ·            -  ·        125,876  ·             1  ·           -  │
························|·················|···············|·················|················|···············
|  LogPoseToken         ·                                                                                   │
························|·················|···············|·················|················|···············
|      burn             ·              -  ·            -  ·         33,585  ·             1  ·           -  │
························|·················|···············|·················|················|···············
|      mint             ·              -  ·            -  ·         53,270  ·             1  ·           -  │
························|·················|···············|·················|················|···············
|      transfer         ·              -  ·            -  ·         51,353  ·             1  ·           -  │
························|·················|···············|·················|················|···············
|  MockPUSD             ·                                                                                   │
························|·················|···············|·················|················|···············
|      approve          ·              -  ·            -  ·         45,890  ·             1  ·           -  │
························|·················|···············|·················|················|···············
|      transfer         ·              -  ·            -  ·         51,259  ·             1  ·           -  │
························|·················|···············|·················|················|···············
|  Deployments                            ·                                 ·  % of limit    ·              │
························|·················|···············|·················|················|···············
|  Lock                 ·              -  ·            -  ·        198,338  ·         0.7 %  ·           -  │
························|·················|···············|·················|················|···············
|  LogPoseIDO           ·              -  ·            -  ·        722,942  ·         2.4 %  ·           -  │
························|·················|···············|·················|················|···············
|  LogPoseToken         ·              -  ·            -  ·        718,140  ·         2.4 %  ·           -  │
························|·················|···············|·················|················|···············
|  MockPUSD             ·              -  ·            -  ·        645,606  ·         2.2 %  ·           -  │
························|·················|···············|·················|················|···············
|  Key                                                                                                      │
·············································································································
|  ◯  Execution gas for this method does not include intrinsic gas overhead                                 │
·············································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
·············································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
·············································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
·············································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
·············································································································
|  Toolchain:  hardhat                                                                                      │
·············································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
·············································································································
|  Toolchain:  hardhat                                                                                      │
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
·············································································································
·············································································································
·············································································································
|  Toolchain:  hardhat                                                                                      │
·············································································································