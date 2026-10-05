import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    template: '%s | GameRank',
    default: 'GameRank - Worldwide Gaming Rankings & Discovery',
  },
  description: 'Discover, rank, and explore the best video games worldwide. GameRank provides comprehensive rankings across all platforms including PC, PlayStation, Xbox, Nintendo, and mobile games.',
  keywords: ['games', 'gaming', 'rankings', 'best games', 'top games', 'game discovery', 'PC games', 'PlayStation', 'Xbox', 'Nintendo', 'mobile games'],
  authors: [{ name: 'GameRank' }],
  openGraph: {
    type: 'website',
    siteName: 'GameRank',
    title: 'GameRank - Worldwide Gaming Rankings & Discovery',
    description: 'Discover the best video games worldwide with data-driven rankings across all platforms.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GameRank - Worldwide Gaming Rankings',
    description: 'Discover the best video games worldwide.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0f0f0f',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0f0f0f] text-white min-h-screen font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
