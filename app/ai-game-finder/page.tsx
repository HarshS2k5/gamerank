import { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Bot } from 'lucide-react'
import { GameDataProvider } from '@/lib/provider'
import { AIGameFinderView } from '@/components/ai/AIGameFinderView'

export const metadata: Metadata = {
  title: 'AI Game Finder - Personalized Video Game Recommendations | GameRank',
  description:
    'Find your next video game using AI. Search in plain English or select exact criteria for platform, genre, play style, and mood.',
}

export default async function AIGameFinderPage() {
  // Pre-seed with top recommendation candidates
  const initialMatches = await GameDataProvider.findGameMatches({})

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb & Hero Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00ff88] text-xs font-semibold uppercase tracking-wider transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#00ff88] text-xs font-bold uppercase tracking-wider bg-[#00ff88]/10 px-3 py-1.5 rounded-full mb-3">
              <Bot className="w-4 h-4" /> Intelligent Recommendation Engine
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              AI Game Finder
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Describe what you want to play in plain English or filter by platform, genre, and playstyle. Our transparent engine matches games using verified attributes without hallucinations.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive AI Finder Interface */}
      <AIGameFinderView initialResults={initialMatches} />
    </div>
  )
}
