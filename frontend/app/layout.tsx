import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "LogPose Token - Navigate the Crypto Seas | IDO Launch",
  description:
    "Join the LogPose Token IDO - A decentralized crypto price aggregator that guides traders through volatile markets. Purchase LPT with PUSD and embark on your trading adventure.",
  generator: "v0.app",
  keywords: "LogPose Token, LPT, IDO, crypto, price aggregator, DeFi, trading, One Piece, navigation",
  openGraph: {
    title: "LogPose Token - Navigate the Crypto Seas",
    description: "Decentralized price aggregator for crypto traders. Join our IDO and start your adventure.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
