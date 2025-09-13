# LogPose: Product Requirement Document

## 1. Overview
**Product Name:** LogPose
**Purpose:** Decentralized IDO sale platform for LogPose Token (LPT) on Sepolia Testnet. Users can purchase LPT using PUSD via wallet connection (MetaMask). 
**Target Audience:** Crypto traders, DeFi users, early adopters.
**Version:** MVP for Sepolia Testnet, Q4 2025.

## 2. Objectives
- Deliver a responsive Next.js (React) frontend for IDO sale and wallet integration.
- Deploy Solidity smart contracts for LPT token and IDO sale.
- Achieve successful IDO launch and user participation.

## 3. Functional Requirements
### Frontend (Next.js/React)
- **IDO Interface:** Users can purchase LPT with PUSD (1 LPT = 0.01 PUSD) via MetaMask wallet connection.
- **Wallet Connection:** MetaMask integration for buying and approving PUSD.
- **Progress Tracking:** Display IDO progress (tokens sold, total tokens, percentage).
- **Contract Addresses:** Show LPT and IDO contract addresses in the UI.
- **Mobile Responsive:** Navigation and UI adapt to mobile devices.
- **Theme:** Dark/light mode toggle, with blue/cyan accents.
- **Notifications:** Modal and toast notifications for transaction status and errors.

### Smart Contracts (Solidity, Sepolia Testnet)
- **LPT Token:** ERC-20 token with 500M total supply, 25% (125M) for IDO.
  - Functions: transfer, approve.
  - Contract Address: 0x95Ce6Fd9cF58dEBb27A5CEbAaeEc038AED8bf5bf
- **IDO Contract:** Handles LPT purchases and fund collection.
  - Address: 0x5Bf2B9EA607C27b0F7D6F0EcffeAf00082B7529f
- **MockPUSD:** ERC-20 stablecoin for test purchases.

### Not Yet Implemented (Future Work)
- Price tracker for multiple exchanges
- Arbitrage alerts
- Staking, governance, and price oracle
- Node.js backend/API aggregation
- Advanced analytics and premium features

## 4. Non-Functional Requirements
- **Performance:** Frontend loads <2s.
- **Security:** Uses OpenZeppelin templates for contracts; wallet-based authentication.
- **Reliability:** UI handles errors and network issues gracefully.
- **Compliance:** UI includes crypto risk disclaimer.

## 5. Success Metrics
- Successful IDO sale and token distribution.
- Wallet connection and transaction flows work for all users.
- Responsive UI across devices and themes.

## 6. Directory Structure (Current)
```
LogPoseToken/
├── contracts/        # Solidity smart contracts (LPT, IDO, MockPUSD)
├── frontend/         # Next.js frontend (IDO page, wallet logic, UI)
├── test/             # Hardhat tests for contracts
├── scripts/          # Deployment and verification scripts
├── README.md         # Project overview
├── PRD.md            # Product Requirement Document
```

## 7. Notes
- Features like price tracking, arbitrage, staking, governance, and backend are planned for future releases.
- For full PRD history, see previous document versions.

---

## Documentation and AI-Aided Development

### 1. Product Requirement Document (PRD)
See above for the aligned PRD section.

### 2. Test Cases
#### Unit Tests (Smart Contracts)
- Validate LPT token and IDO contract functionality using Hardhat and Chai.
- Example:
  - Mint initial supply
  - Transfer tokens
  - Purchase LPT with PUSD
  - Prevent over-purchase
  - Check raised funds
- Test files: `test/LogPoseToken.test.ts`, `test/LogPoseIDO.test.ts`

#### Integration Tests (Frontend + Smart Contracts)
- Ensure wallet connection, IDO purchase, and UI updates work together.
- Simulate user flows and transaction status notifications.

### 3. Prompts Used with AI Agents

#### Smart Contract Agent Prompts
- Identity: Solidity Developer
- Task: Write ERC-20 token and IDO sale contracts
- Constraints: OpenZeppelin templates, Sepolia Testnet, secure coding

#### My Prompt
- "You are a Blockchain Engineer. Your task is to deploy an IDO website for LogPose Token. Write an ERC-20 smart contract with a total supply of 500,000,000 tokens. In addition, create an IDO smart contract that allows users to buy LogPose Tokens using PUSD as the payment token."

#### Frontend Agent Prompts
- Identity: React/Next.js Developer
- Task: Build IDO purchase UI, wallet connection, progress display, modal notifications
- Constraints: TypeScript, mobile responsive, dark/light mode, contract addresses

#### My Prompt
You are a React/Next.js Developer, who is heavily interested in the One Piece Anime Series. Your task is to build the IDO purchase UI for the LogPose Token. While taking into consideration, the intentional reference of Log Pose from One Piece:
- Create a purchase interface for the IDO.
- Implement MetaMask wallet connection.


### 4. Process Report
#### How Prompts Were Structured
- Defined agent role, task, and constraints for each prompt.
- Used project specifics (addresses, pricing) to guide AI.
- Iterated with follow-up prompts for error handling and UI polish.

#### Debugging Errors with AI
- Used Copilot, Grok and V0 for TypeScript and Solidity errors (e.g., wallet connection, contract deployment).
- Validated fixes by running tests and checking UI/UX.

#### Validating Correctness and Security
- Ran Hardhat tests for contracts.
- Used OpenZeppelin templates for security.
- UI tested for error handling and transaction feedback.

#### Integrating Layers
- Frontend calls smart contracts via ethers.js and MetaMask.
- No backend implemented yet; all logic is client-side and on-chain.

### 5. GitHub Repository Structure
- Contains:
  - Smart contracts (`contracts/`)
  - Frontend (`frontend/`)
  - Test cases (`test/`)
  - Deployment scripts (`scripts/`)
  - Documentation (`PRD.md`, `README.md`)
- See directory structure above for details.
