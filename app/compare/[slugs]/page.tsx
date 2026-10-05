import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Scale, ArrowLeft } from 'lucide-react'
import { GameDataProvider } from '@/lib/provider'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'

interface PageProps {
  params: {
    slugs: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const raw = decodeURIComponent(params.slugs)
  const slugs = raw.includes('-vs-')
    ? raw.split('-vs-').map((s) => s.trim().toLowerCase())
    : raw.split(',').map((s) => s.trim().toLowerCase())

  const games = await GameDataProvider.compareGames(slugs)
  if (games.length === 0) {
    return { title: 'Game Comparison | GameRank' }
  }

  const titles = games.map((g) => g.name).join(' vs ')
  return {
    title: `${titles} - Head-to-Head Comparison | GameRank`,
    description: `Side-by-side comparison of ${titles}. Compare GameRank scores, critic reviews, platforms, playtime, and hardware specs.`,
  }
}

export default async function DynamicComparePage({ params }: PageProps) {
  const allGames = await GameDataProvider.getAllGames()
  const raw = decodeURIComponent(params.slugs)
  
  // Parse slugs by '-vs-' or ','
  const slugs = raw.includes('-vs-')
    ? raw.split('-vs-').map((s) => s.trim().toLowerCase())
    : raw.split(',').map((s) => s.trim().toLowerCase())

  const comparedGames = await GameDataProvider.compareGames(slugs)

  if (comparedGames.length === 0) {
    notFound()
  }

  const titles = comparedGames.map((g) => g.name).join(' vs ')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00ff88] text-xs font-semibold uppercase tracking-wider transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> All Comparisons
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#00ff88] text-xs font-bold uppercase tracking-wider bg-[#00ff88]/10 px-3 py-1.5 rounded-full mb-3">
              <Scale className="w-4 h-4" /> Head-to-Head Matchup
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              {titles}
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Side-by-side comparison analysis based on verified developer metadata and community sentiment.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <ComparisonTable
        initialGames={comparedGames}
        availableGames={allGames}
      />
    </div>
  )
}
