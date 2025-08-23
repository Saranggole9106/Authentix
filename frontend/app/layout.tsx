import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DeSkill - Decentralized Skill Verification',
  description: 'Verify your skills and earn Soulbound Tokens on BNB Smart Chain',
  keywords: ['blockchain', 'skills', 'verification', 'NFT', 'soulbound', 'BNB', 'web3'],
  authors: [{ name: 'DeSkill Team' }],
  openGraph: {
    title: 'DeSkill - Decentralized Skill Verification',
    description: 'Verify your skills and earn Soulbound Tokens on BNB Smart Chain',
    type: 'website',
    url: 'https://deskill.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DeSkill Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeSkill - Decentralized Skill Verification',
    description: 'Verify your skills and earn Soulbound Tokens on BNB Smart Chain',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
