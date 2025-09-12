import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Navigation, TrendingUp, Globe, Star } from "lucide-react"

export default function RoadmapTabs() {
  const [activeTab, setActiveTab] = useState("q1")
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid w-full grid-cols-4 mb-4">
        <button
          className={`py-2 px-4 ${activeTab === "q1" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
          onClick={() => setActiveTab("q1")}
        >
          Q1 2024
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "q2" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
          onClick={() => setActiveTab("q2")}
        >
          Q2 2024
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "q3" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
          onClick={() => setActiveTab("q3")}
        >
          Q3 2024
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "q4" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
          onClick={() => setActiveTab("q4")}
        >
          Q4 2024
        </button>
      </div>

      {activeTab === "q1" && (
        <div className="mt-8">
          <Card>
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
        </div>
      )}

      {activeTab === "q2" && (
        <div className="mt-8">
          <Card>
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
        </div>
      )}

      {activeTab === "q3" && (
        <div className="mt-8">
          <Card>
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
        </div>
      )}

      {activeTab === "q4" && (
        <div className="mt-8">
          <Card>
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
        </div>
      )}
    </div>
  )
}