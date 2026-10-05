import { Metadata } from 'next'
import Link from 'next/link'
import { Scale, ArrowLeft } from 'lucide-react'
import { GameDataProvider } from '@/lib/provider'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'

export const metadata: Metadata = {
  title: 'Game Comparison - Side-by-Side Specs & Ratings | GameRank',
  description:
    'Compare 2 to 4 video games side-by-side. Analyze GameRank scores, critic reviews, system requirements, multiplayer modes, and more.',
}

interface ComparePageProps {
  searchParams: {
    games?: string
  }
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const allGames = await GameDataProvider.getAllGames()
  
  // Parse slugs from query params, or default to two famous comparable games
  let slugs: string[] = []
  if (searchParams.games) {
    slugs = searchParams.games
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  }

  // If no games specified via URL query, default to 2 classic head-to-head titles
  if (slugs.length === 0) {
    slugs = ['minecraft', 'terraria']
  }

  // Fetch verified records
  const comparedGames = await GameDataProvider.compareGames(slugs)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb & Navigation */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00ff88] text-xs font-semibold uppercase tracking-wider transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#00ff88] text-xs font-bold uppercase tracking-wider bg-[#00ff88]/10 px-3 py-1.5 rounded-full mb-3">
              <Scale className="w-4 h-4" /> Head-to-Head Comparison
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              Game Comparison
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Compare up to 4 games side-by-side with verified specs, metacritic scores, PC hardware requirements, and gameplay characteristics.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Matrix */}
      <ComparisonTable
        initialGames={comparedGames}
        availableGames={allGames}
      />
    </div>
  )
}
