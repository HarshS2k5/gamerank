import { Metadata } from 'next'
import { SearchBar } from '@/components/search/SearchBar'
import { GameCard } from '@/components/ui/GameCard'
import { EmptyState } from '@/components/ui/ErrorState'
import { GameDataProvider } from '@/lib/provider'

export const metadata: Metadata = {
  title: 'Search Video Games | GameRank',
  description: 'Search and filter games across all genres and platforms with official posters on GameRank.',
}

interface SearchPageProps {
  searchParams: {
    q?: string
    genres?: string
    platforms?: string
    ordering?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const genres = searchParams.genres || ''
  const platforms = searchParams.platforms || ''
  const ordering = searchParams.ordering || '-gamerank'

  const games = await GameDataProvider.searchGames(query, {
    genre: genres,
    platform: platforms,
    ordering: ordering,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-2">Search Video Games</h1>
        <p className="text-gray-400 text-sm md:text-base">
          Find games across PC, PlayStation, Xbox, Nintendo, and mobile with genuine cover artwork.
        </p>
      </div>

      {/* Interactive Search & Filter Controls */}
      <SearchBar
        initialQuery={query}
        initialGenre={genres}
        initialPlatform={platforms}
        initialOrdering={ordering}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between my-6 border-b border-white/10 pb-4">
        <h2 className="text-lg font-bold text-white">
          {query ? `Results for "${query}"` : 'All Filtered Games'}
        </h2>
        <span className="text-sm font-semibold text-[#00ff88]">
          {games.length} titles found
        </span>
      </div>

      {/* Results Grid - EVERY CARD HAS A POSTER */}
      {games.length === 0 ? (
        <EmptyState message="No games matched your search criteria. Try another title or resetting your filters." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {games.map((game, index) => (
            <GameCard key={game.id} game={game} rank={index + 1} showRank={false} />
          ))}
        </div>
      )}
    </div>
  )
}
