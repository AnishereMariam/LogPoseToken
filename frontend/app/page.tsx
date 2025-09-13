"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Navigation,
  Compass,
  TrendingUp,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Star,
  Globe,
  BarChart3,
  Lock,
  Coins,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "../components/ui/dialog"

// Contract Configuration
const IDO_ADDRESS = "0x5Bf2B9EA607C27b0F7D6F0EcffeAf00082B7529f"
const PUSD_ADDRESS = "0xDd7639e3920426de6c59A1009C7ce2A9802d0920"
const LPT_ADDRESS = "0x95Ce6Fd9cF58dEBb27A5CEbAaeEc038AED8bf5bf"

// Contract ABIs (simplified for demo - you'll need your full ABIs)
const IDO_ABI = [
  "function buyTokens(uint256 amount) external",
  "function tokensSold() view returns (uint256)",
  "function totalTokensForSale() view returns (uint256)",
]

const PUSD_ABI = [
  "function approve(address,uint256) returns (bool)",
  "function allowance(address,address) view returns (uint256)",
]

// Type declarations
declare global {
  interface Window {
    ethereum?: any
  }
}

export default function LogPoseIDO() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  // Fetch IDO progress before wallet connection
useEffect(() => {
  const fetchProgress = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_SEPOLIA_URL);
      if (!provider) throw new Error("Provider not configured");

      const ido = new ethers.Contract(IDO_ADDRESS, IDO_ABI, provider);
      const [sold, total] = await Promise.all([ido.tokensSold(), ido.totalTokensForSale()]);
      console.log("IDO Progress fetched:", {
        tokensSold: sold?.toString(),
        totalTokens: total?.toString()
      });
      setTokensSold(sold);
      setTotalTokens(total || BigInt(125000000)); // Fallback to hardcoded total if fetch fails
    } catch (error) {
      console.error("Error fetching IDO progress:", error);
      toast({
        title: "Data Fetch Failed",
        description: "Could not load IDO progress. Using default values.",
        variant: "destructive",
      });
      setTokensSold(BigInt(0)); // Fallback to 0 if fetch fails
      setTotalTokens(BigInt(125000000)); // Fallback to known total
    }
  };
  fetchProgress();
}, []);

// Ensure environment variable is set in .env.local
// NEXT_PUBLIC_INFURA_SEPOLIA_URL=https://sepolia.infura.io/v3/your-api-key
const { toast } = useToast();

  // Web3 States
  const [account, setAccount] = useState("")
  const [connected, setConnected] = useState(false)
  const [approved, setApproved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<ethers.Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [idoContract, setIdoContract] = useState<any>(null)
  const [pusdContract, setPusdContract] = useState<any>(null)

  // IDO States
  const [tokensSold, setTokensSold] = useState<bigint>(BigInt(0))
  const [totalTokens, setTotalTokens] = useState<bigint>(BigInt(125000000)) // 125M tokens for IDO
  const [pusdAmount, setPusdAmount] = useState("")
  const [lptAmount, setLptAmount] = useState("")

  
  const [activeRoadmapTab, setActiveRoadmapTab] = useState("q1")

  // Calculate progress percentage
  // Use BigInt division and convert to number for display
  const progressPercentage = Number(totalTokens) > 0
  ? ((Number(tokensSold) * 100) / Number(totalTokens))
  : 0; // Default 0% for demo

  // Connect Wallet Function
  const connectWallet = async () => {
    try {
      console.log("Connect Wallet button clicked");
      setLoading(true);
      if (typeof window.ethereum !== "undefined") {
        console.log("window.ethereum found");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        console.log("Network chainId:", network.chainId);

        if (Number(network.chainId) !== 11155111) {
          toast({
            title: "Wrong Network",
            description: "Please switch to Sepolia Testnet. Attempting to switch...",
            variant: "destructive",
          });
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xAA36A7" }], // Sepolia chain ID in hex
            });
          } catch (switchError: any) {
            toast({
              title: "Network Switch Failed",
              description: switchError.message || "Manual switch required",
              variant: "destructive",
            });
          }
          setLoading(false);
          return;
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Requested accounts");
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log("Signer address:", address);

        const ido = new ethers.Contract(IDO_ADDRESS, IDO_ABI, signer);
        const pusd = new ethers.Contract(PUSD_ADDRESS, PUSD_ABI, signer);

        setProvider(provider);
        setSigner(signer);
        setAccount(address);
        setConnected(true);
        setIdoContract(ido);
        setPusdContract(pusd);

        // Check PUSD allowance
        try {
          const allowance = await pusd.allowance(address, IDO_ADDRESS);
          setApproved(allowance > 0);
        } catch (error) {
          console.log("Error checking allowance:", error);
        }

        // Fetch IDO data
        try {
          const sold = await ido.tokensSold();
          const total = await ido.totalTokensForSale();
          setTokensSold(sold);
          setTotalTokens(total);
        } catch (error) {
          console.log("Error fetching IDO data:", error);
        }

        toast({
          title: "Connected!",
          description: `Wallet connected successfully: ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      } else {
        toast({
          title: "No Wallet Found",
          description: "Please install MetaMask or another Web3 wallet",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Approve PUSD Function
  const approvePUSD = async () => {
    if (!pusdContract || !signer) return
    try {
      setLoading(true)
      const tx = await pusdContract.approve(IDO_ADDRESS, ethers.MaxUint256)
      await tx.wait()
      setApproved(true)
      toast({
        title: "Approved!",
        description: "PUSD spending approved",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Buy Tokens Function
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInstallMetaMaskModal, setShowInstallMetaMaskModal] = useState(false);
  const buyTokens = async () => {
    if (!idoContract || !pusdAmount) return;
    try {
      setLoading(true);
      const amount = ethers.parseUnits(pusdAmount, 0);
      const tx = await idoContract.buyTokens(amount);
      await tx.wait();

      // Update states
      try {
        const sold = await idoContract.tokensSold()
        setTokensSold(sold)
      } catch (error) {
        console.log("Error updating sold tokens:", error)
      }

      setPusdAmount("")
      setLptAmount("")

      setShowSuccessModal(true); // Show modal on success

      toast({
        title: "Success!",
        description: "Tokens purchased successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate LPT amount based on PUSD input
  const handlePusdChange = (value: string) => {
    setPusdAmount(value)
    const pusdValue = Number.parseFloat(value) || 0
    const lptTokens = pusdValue * 100 // PUSD 0.01 per LPT
    setLptAmount(lptTokens.toFixed(0))
  }

  // Effect to fetch IDO data periodically
  useEffect(() => {
    const fetchData = async () => {
      if (idoContract) {
        try {
          const sold = await idoContract.tokensSold()
          const total = await idoContract.totalTokensForSale()
          setTokensSold(sold)
          setTotalTokens(total)
        } catch (error) {
          console.error("Error fetching IDO data:", error)
        }
      }
    }

    if (connected) {
      fetchData()
      const interval = setInterval(fetchData, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [idoContract, connected])

  return (
    <>
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Successful</DialogTitle>
            <DialogDescription>
              Your purchase was successful! You have received your LPT tokens.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded" onClick={() => setShowSuccessModal(false)}>
                OK
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Install MetaMask Modal */}
      <Dialog open={showInstallMetaMaskModal} onOpenChange={setShowInstallMetaMaskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>MetaMask Not Detected</DialogTitle>
            <DialogDescription>
              Please install MetaMask to continue. You can download it from <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="text-primary underline">metamask.io</a>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded" onClick={() => setShowInstallMetaMaskModal(false)}>
                OK
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
            style={{
              backgroundImage: "url('/images/ocean-waves-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-800/20 to-blue-900/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse" />
        </div>

        {/* Navigation */}
        <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 relative">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Compass className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">LogPose</span>
                <Badge className="ml-2">IDO Live</Badge>
              </div>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
                <a href="#tokenomics" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tokenomics
                </a>
                <a href="#roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
                  Roadmap
                </a>
                <Button variant="outline" size="sm" onClick={connectWallet} disabled={loading}>
                  <Navigation className="w-4 h-4 mr-2" />
                  {connected
                    ? `${account.slice(0, 6)}...${account.slice(-4)}`
                    : typeof window !== "undefined" && typeof window.ethereum === "undefined"
                      ? "Install MetaMask"
                      : "Connect Wallet"}
                </Button>
              </div>
              {/* Mobile Navigation */}
              <div className="md:hidden flex items-center">
                <button
                  className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  aria-label="Open navigation menu"
                >
                  <Navigation className="w-6 h-6 text-primary" />
                </button>
                {mobileNavOpen && (
                  <div className="absolute top-16 right-4 bg-card border border-border rounded-lg shadow-lg z-50 w-48">
                    <div className="flex flex-col py-2">
                      <a
                        href="#about"
                        className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded"
                        onClick={() => setMobileNavOpen(false)}
                      >
                        About
                      </a>
                      <a
                        href="#tokenomics"
                        className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded"
                        onClick={() => setMobileNavOpen(false)}
                      >
                        Tokenomics
                      </a>
                      <a
                        href="#roadmap"
                        className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded"
                        onClick={() => setMobileNavOpen(false)}
                      >
                        Roadmap
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mx-4 my-2"
                        onClick={() => {
                          setMobileNavOpen(false);
                          connectWallet();
                        }}
                        disabled={loading}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        {connected
                          ? `${account.slice(0, 6)}...${account.slice(-4)}`
                          : typeof window !== "undefined" && typeof window.ethereum === "undefined"
                            ? "Install MetaMask"
                            : "Connect Wallet"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/50" />
          <div
            className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/images/pirate-ship-sailing.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center right",
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    IDO Now Live
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight text-white drop-shadow-lg">
                    Navigate the <span className="text-blue-300">Crypto Sea</span> with LogPose
                  </h1>
                  <p className="text-xl text-blue-100 text-pretty max-w-2xl drop-shadow-md">
                    The first decentralized price aggregator that guides traders through volatile markets. Join our
                    adventure and discover profitable trading opportunities across the Grand Line of crypto exchanges.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/price-island.html" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      <Zap className="w-4 h-4 mr-2" />
                      Price Island
                    </Button>
                  </a>
                  <a href="/whitepaper.html" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      View Whitepaper
                    </Button>
                  </a>
                </div>

                {/* Progress Stats */}
                <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">IDO Progress</span>
                    <span className="text-sm text-muted-foreground">{progressPercentage.toFixed(1)}% Complete</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-1xl font-bold text-primary">
                        ₦{Number((Number(ethers.formatEther(tokensSold)) * 15).toFixed(0)).toLocaleString()}
                      </div>
                      <div className="text-1xl font text-primary">{" ("}
                        {Intl.NumberFormat("en-US", { style: "decimal", maximumFractionDigits: 0 }).format((Number(ethers.formatEther(tokensSold)) * 0.01))} PUSD
                        {")"}
                      </div>
                      <div className="text-xs text-muted-foreground">Raised</div>
                    </div>
                    <div>
                      <div className="text-1xl font text-foreground">₦15</div>
                      <div className="text-1xl font text-foreground">(0.01 PUSD)</div>
                      <div className="text-xs text-muted-foreground">Per LPT</div>
                    </div>
                    <div>
                      <div className="text-1xl font-bold text-accent">₦800M</div>
                      <div className="text-1xl font text-foreground">(500,000 PUSD)</div>
                      <div className="text-xs text-muted-foreground">Target</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Card */}
              <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="w-5 h-5 mr-2 text-primary" />
                    Purchase LPT Tokens
                  </CardTitle>
                  <CardDescription>Join the crew and secure your LogPose Tokens with PUSD</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">PUSD Amount</label>
                      <Input
                        type="number"
                        placeholder="Enter PUSD amount"
                        value={pusdAmount}
                        onChange={(e) => handlePusdChange(e.target.value)}
                        className="text-lg"
                        disabled={loading}
                      />
                    </div>

                    <div className="flex items-center justify-center py-2">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">LPT Tokens</label>
                      <Input type="text" value={lptAmount} readOnly className="text-lg bg-muted" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exchange Rate:</span>
                      <span className="font-medium">1 LPT = 0.01 PUSD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Network Fee:</span>
                      <span className="font-medium">~0.001 PUSD</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={() => {
                      if (!connected) {
                        if (typeof window !== "undefined" && typeof window.ethereum === "undefined") {
                          setShowInstallMetaMaskModal(true);
                        } else {
                          connectWallet();
                        }
                      } else if (approved) {
                        buyTokens();
                      } else {
                        approvePUSD();
                      }
                    }}
                    disabled={loading || (connected && approved && (!pusdAmount || Number(pusdAmount) <= 0))}
                  >
                    {loading ? (
                      "Processing..."
                    ) : connected ? (
                      approved ? (
                        "Purchase LPT Tokens"
                      ) : (
                        "Approve PUSD"
                      )
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By purchasing, you agree to our terms and acknowledge the risks of crypto investments
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="about" className="py-20 bg-blue-950/20 backdrop-blur-sm relative z-10">
          <div
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-64 h-64 bg-contain bg-no-repeat opacity-10"
            style={{
              backgroundImage: "url('/images/compass-navigation.jpg')",
            }}
          />
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-white drop-shadow-lg">
                Chart Your Course Through <span className="text-blue-300">Crypto Waters</span>
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto text-pretty drop-shadow-md">
                LogPose combines the adventure of One Piece with cutting-edge DeFi technology, creating the ultimate
                navigation tool for crypto traders.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-border hover:shadow-2xl transition-all duration-300 bg-card/90 backdrop-blur-sm hover:bg-card/95">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Navigation className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Decentralized Navigation</CardTitle>
                  <CardDescription>
                    Community-verified price feeds across multiple exchanges, just like navigating the Grand Line
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border hover:shadow-2xl transition-all duration-300 bg-card/90 backdrop-blur-sm hover:bg-card/95">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>Arbitrage Opportunities</CardTitle>
                  <CardDescription>
                    AI-powered alerts help you discover profitable trading routes between crypto islands
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border hover:shadow-2xl transition-all duration-300 bg-card/90 backdrop-blur-sm hover:bg-card/95">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Tamper-Proof Data</CardTitle>
                  <CardDescription>
                    On-chain verification ensures your trading compass always points to accurate prices
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border hover:shadow-2xl transition-all duration-300 bg-card/90 backdrop-blur-sm hover:bg-card/95">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>Community Governance</CardTitle>
                  <CardDescription>
                    LPT holders vote on platform decisions, building a true pirate democracy
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border hover:shadow-2xl transition-all duration-300 bg-card/90 backdrop-blur-sm hover:bg-card/95">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Lightning Fast</CardTitle>
                  <CardDescription>
                    Real-time price updates faster than Luffy's Gear Second for instant trading decisions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border hover:shadow-2xl transition-all duration-300 bg-card/90 backdrop-blur-sm hover:bg-card/95">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>Global Exchange Coverage</CardTitle>
                  <CardDescription>
                    Track prices across all major crypto exchanges worldwide, from East Blue to New World
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section id="tokenomics" className="py-20 relative z-10">
          <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-80 h-80 bg-contain bg-no-repeat opacity-15"
            style={{
              backgroundImage: "url('/images/treasure-chest-crypto.jpg')",
            }}
          />
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
                <span className="text-yellow-400">Treasure</span> Distribution
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto drop-shadow-md">
                500 million LPT tokens distributed fairly across our crew of traders, developers, and adventurers
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border hover:bg-card/95 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                      <span className="font-medium">IDO Sale</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">25%</div>
                      <div className="text-sm text-muted-foreground">125M LPT</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border hover:bg-card/95 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-accent rounded-full"></div>
                      <span className="font-medium">Treasury</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">25%</div>
                      <div className="text-sm text-muted-foreground">125M LPT</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border hover:bg-card/95 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Team</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">20%</div>
                      <div className="text-sm text-muted-foreground">100M LPT</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border hover:bg-card/95 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                      <span className="font-medium">Staking Rewards</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">15%</div>
                      <div className="text-sm text-muted-foreground">75M LPT</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border hover:bg-card/95 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-accent rounded-full"></div>
                      <span className="font-medium">Airdrops</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">10%</div>
                      <div className="text-sm text-muted-foreground">50M LPT</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border hover:bg-card/95 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Reserve</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">5%</div>
                      <div className="text-sm text-muted-foreground">25M LPT</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <Card className="border-border bg-card/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>IDO Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Raise:</span>
                      <span className="font-bold">₦800M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token Price:</span>
                      <span className="font-bold">₦15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Supply:</span>
                      <span className="font-bold">500M LPT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IDO Allocation:</span>
                      <span className="font-bold">125M LPT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span className="font-bold">Sepolia Testnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IDO Contract:</span>
                      <span className="font-bold break-all">0x5Bf2B9EA607C27b0F7D6F0EcffeAf00082B7529f</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token Contract:</span>
                      <span className="font-bold break-all">0x95Ce6Fd9cF58dEBb27A5CEbAaeEc038AED8bf5bf</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-accent/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-accent">Early Bird Advantage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This Sepolia testnet IDO offers early investors the chance to join at accessible rates before our
                      larger mainnet launch. Set sail with the crew before we reach the New World!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="py-20 bg-blue-950/30 backdrop-blur-sm relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
                Our <span className="text-blue-300">Adventure</span> Roadmap
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto drop-shadow-md">
                Follow our journey from East Blue to the New World of decentralized finance
              </p>
            </div>

            <Tabs defaultValue="q1" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 bg-card/90 backdrop-blur-sm">
                <TabsTrigger value="q1">Q1 2024</TabsTrigger>
                <TabsTrigger value="q2">Q2 2024</TabsTrigger>
                <TabsTrigger value="q3">Q3 2024</TabsTrigger>
                <TabsTrigger value="q4">Q4 2024</TabsTrigger>
              </TabsList>

              <TabsContent value="q1" className="mt-8">
                <Card className="bg-card/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Navigation className="w-5 h-5 mr-2 text-primary" />
                      East Blue - Foundation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>✅ IDO Launch on Sepolia Testnet</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>✅ Core Price Aggregation MVP</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>🔄 Community Building & Staking Launch</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 Integration with 5 Major Exchanges</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="q2" className="mt-8">
                <Card className="bg-card/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                      Alabasta - Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 AI-Powered Arbitrage Alerts</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 Mobile App Beta Release</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 Governance Portal Launch</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 Partnership with DeFi Protocols</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="q3" className="mt-8">
                <Card className="bg-card/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-primary" />
                      Sky Island - Innovation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 Mainnet Migration</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 Advanced Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 API for Institutional Clients</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 Cross-Chain Price Feeds</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="q4" className="mt-8">
                <Card className="bg-card/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-primary" />
                      New World - Expansion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 Global Exchange Partnerships</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 Advanced Trading Tools</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 Enterprise Solutions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>📋 One Piece of the Crypto Puzzle Complete! 🏴‍☠️</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-900 text-primary-foreground relative z-10">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          </div>
          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Set Sail with the LogPose Crew?</h2>
              <p className="text-xl opacity-90 text-pretty">
                Join thousands of traders who trust LogPose to navigate the volatile crypto seas. Your adventure to
                financial freedom starts here!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={connected ? (approved ? buyTokens : approvePUSD) : connectWallet}
                  disabled={loading}
                >
                  <Compass className="w-5 h-5 mr-2" />
                  {loading
                    ? "Processing..."
                    : connected
                      ? approved
                        ? "Purchase LPT Tokens"
                        : "Approve PUSD"
                      : "Purchase LPT Tokens"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Join Our Discord
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card/95 backdrop-blur-sm border-t border-border py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Compass className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">LogPose</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Navigate the crypto seas with confidence. Verified by the community, for the community.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Price Aggregator
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Arbitrage Alerts
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      API Access
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Mobile App
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Community</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Telegram
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Whitepaper
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2025 LogPose Token. All rights reserved. Set sail responsibly! 🏴‍☠️</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
