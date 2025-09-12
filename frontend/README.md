# LogPose Token IDO Website

A modern Web3 IDO (Initial DEX Offering) website for LogPose Token (LPT) with One Piece theme and full smart contract integration.

## Features

- 🌊 One Piece themed design with Log Pose navigation references
- 💰 Web3 wallet integration (MetaMask)
- 🔗 Smart contract integration on Sepolia testnet
- 💳 PUSD token approval and LPT token purchase
- 📊 Real-time IDO progress tracking
- 📱 Responsive design with modern UI components

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Smart Contract Integration

The website connects to deployed contracts on Sepolia testnet:
- **LPT Token Contract:** `0x742d35Cc6634C0532925a3b8D4C9db96c4b4c8e6`
- **PUSD Token Contract:** `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

## Web3 Setup

1. Install MetaMask browser extension
2. Switch to Sepolia testnet
3. Get test ETH from Sepolia faucet
4. Connect wallet to purchase tokens

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main IDO interface
│   └── globals.css         # Global styles
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── utils.ts            # Utility functions
└── public/
    └── images/             # Log Pose themed images
\`\`\`

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **ethers.js** - Web3 integration
- **Radix UI** - Accessible components

## Development

The project uses modern development tools:
- Hot reload for instant updates
- TypeScript for type checking
- ESLint for code quality
- Tailwind CSS for rapid styling

## Deployment

Ready for deployment to Vercel, Netlify, or any Next.js hosting platform.
