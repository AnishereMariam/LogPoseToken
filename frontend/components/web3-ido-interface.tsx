"use client"

import LogPoseIDOArtifact from "../../artifacts/contracts/LogPoseIDO.sol/LogPoseIDO.json"
import LPTArtifact from "../../artifacts/contracts/LogPoseToken.sol/LogPoseToken.json"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { useToast } from "../components/ui/use-toast"
import { Navigation, Compass, TrendingUp, Shield, Users, Zap, ArrowRight, Star, Globe, Lock, Coins } from "lucide-react"
import RoadmapTabs from "./RoadmapTabs"

// Contract Configuration
const IDO_ADDRESS = "0x5Bf2B9EA607C27b0F7D6F0EcffeAf00082B7529f"
const PUSD_ADDRESS = "0xDd7639e3920426de6c59A1009C7ce2A9802d0920"
const LPT_ADDRESS = "0x95Ce6Fd9cF58dEBb27A5CEbAaeEc038AED8bf5bf"

// Minimal ABI for PUSD (only what's needed)
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
  const { toast } = useToast()

  // Web3 States
  const [account, setAccount] = useState("")
  const [connected, setConnected] = useState(false)
  const [approved, setApproved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [idoContract, setIdoContract] = useState<any>(null)
  const [pusdContract, setPusdContract] = useState<any>(null)
  const [lptContract, setLptContract] = useState<any>(null)

  // IDO States
  const [tokensSold, setTokensSold] = useState<bigint>(BigInt(0))
  const [totalTokens, setTotalTokens] = useState<bigint>(BigInt(0))
  const [pusdAmount, setPusdAmount] = useState("")
  const [lptAmount, setLptAmount] = useState("")

  // Calculate progress percentage
  const progressPercentage = totalTokens > BigInt(0) ? Number(tokensSold * BigInt(100) / totalTokens) : 0

  // Connect Wallet Function
  const connectWallet = async () => {
    try {
      setLoading(true)
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const network = await provider.getNetwork()

        if (Number(network.chainId) !== 11155111) {
          toast({
            title: "Wrong Network",
            description: "Please switch to Sepolia Testnet",
            variant: "destructive",
          })
          return
        }

        await window.ethereum.request({ method: "eth_requestAccounts" })
        const signer = await provider.getSigner()
        const address = await signer.getAddress()

        // Use full ABIs for your contracts, minimal ABI for PUSD
        const ido = new ethers.Contract(IDO_ADDRESS, LogPoseIDOArtifact.abi, signer)
        const pusd = new ethers.Contract(PUSD_ADDRESS, PUSD_ABI, signer)
        // To interact with LPT:
        const lpt = new ethers.Contract(LPT_ADDRESS, LPTArtifact.abi, signer)

        setProvider(provider)
        setSigner(signer)
        setAccount(address)
        setConnected(true)
        setIdoContract(ido)
        setLptContract(lpt)
        setPusdContract(pusd)

        // Check PUSD allowance
        const allowance = await pusd.allowance(address, IDO_ADDRESS)
        setApproved(allowance > 0)

        // Fetch IDO data
        const sold = await ido.tokensSold()
        const total = await ido.totalTokensForSale()
        setTokensSold(sold)
        setTotalTokens(total)

        toast({
          title: "Connected!",
          description: "Wallet connected successfully",
        })
      }
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
  const buyTokens = async () => {
    if (!idoContract || !pusdAmount) return
    try {
      setLoading(true)
      const tx = await idoContract.buyTokens(pusdAmount)
      await tx.wait()

      // Update states
      const sold = await idoContract.tokensSold()
      setTokensSold(sold)
      setPusdAmount("")
      setLptAmount("")

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
    const lptTokens = pusdValue * 100 // Rate is 1:100
    setLptAmount(lptTokens.toString())
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
          // eslint-disable-next-line no-console
          console.error("Error fetching IDO data:", error)
        }
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [idoContract])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LogPose</span>
              <Badge className="ml-2">IDO Live</Badge>
            </div>
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
                {connected ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-muted opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-accent text-accent-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  IDO Now Live
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                  Navigate the <span className="text-primary">Crypto Seas</span> with LogPose
                </h1>
                <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                  The first decentralized price aggregator that guides traders through volatile markets. Join our
                  adventure and discover profitable trading opportunities across the Grand Line of crypto exchanges.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={connected ? (approved ? buyTokens : approvePUSD) : connectWallet}
                  disabled={loading}
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
              </div>

              {/* Progress Stats */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">IDO Progress</span>
                  <span className="text-sm text-muted-foreground">{progressPercentage.toFixed(1)}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      ₦{(Number(ethers.formatEther(tokensSold)) * 6.4).toFixed(1)}M
                    </div>
                    <div className="text-xs text-muted-foreground">Raised</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">
                      ₦{(Number(ethers.formatEther(totalTokens)) * 6.4).toFixed(1)}M
                    </div>
                    <div className="text-xs text-muted-foreground">Target</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">₦6.4</div>
                    <div className="text-xs text-muted-foreground">Per LPT</div>
                  </div>
                </div>
              </div>

              {/* Purchase Card */}
              <Card className="bg-card border-border shadow-lg">
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
                      <span className="font-medium">~0.0001 PUSD</span>
                    </div>
                  </div>

                  {/* Replace the static button with the Web3-enabled button */}
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={connected ? (approved ? buyTokens : approvePUSD) : connectWallet}
                    disabled={loading}
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
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Chart Your Course Through <span className="text-primary">Crypto Waters</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              LogPose combines the adventure of One Piece with cutting-edge DeFi technology, creating the ultimate
              navigation tool for crypto traders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
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

            <Card className="border-border hover:shadow-lg transition-shadow">
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

            <Card className="border-border hover:shadow-lg transition-shadow">
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

            <Card className="border-border hover:shadow-lg transition-shadow">
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

            <Card className="border-border hover:shadow-lg transition-shadow">
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

            <Card className="border-border hover:shadow-lg transition-shadow">
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
      <section id="tokenomics" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-primary">Treasure</span> Distribution
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              500 million LPT tokens distributed fairly across our crew of traders, developers, and adventurers
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    <span className="font-medium">IDO Sale</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">25%</div>
                    <div className="text-sm text-muted-foreground">125M LPT</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-accent rounded-full"></div>
                    <span className="font-medium">Treasury</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">25%</div>
                    <div className="text-sm text-muted-foreground">125M LPT</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-chart-3 rounded-full"></div>
                    <span className="font-medium">Team</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">20%</div>
                    <div className="text-sm text-muted-foreground">100M LPT</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-chart-4 rounded-full"></div>
                    <span className="font-medium">Staking Rewards</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">15%</div>
                    <div className="text-sm text-muted-foreground">75M LPT</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-chart-5 rounded-full"></div>
                    <span className="font-medium">Marketing</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">10%</div>
                    <div className="text-sm text-muted-foreground">50M LPT</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
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
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>IDO Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Raise:</span>
                    <span className="font-bold">₦800M (~$500K)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token Price:</span>
                    <span className="font-bold">₦6.4/0.01 PUSD ($0.004)</span>
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
                </CardContent>
              </Card>

              <Card className="border-border bg-accent/5">
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
      <section id="roadmap" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-primary">Adventure</span> Roadmap
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow our journey from East Blue to the New World of decentralized finance
            </p>
          </div>

          {/* Tabs implementation with manual state for tab selection */}
          <RoadmapTabs />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
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
      <footer className="bg-card border-t border-border py-12">
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
            <p>&copy; 2024 LogPose Token. All rights reserved. Set sail responsibly! 🏴‍☠️</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
