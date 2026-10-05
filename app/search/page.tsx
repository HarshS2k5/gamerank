import { Metadata } from 'next'
import { SearchBar } from '@/components/search/SearchBar'
import { GameCard } from '@/components/ui/GameCard'
import { EmptyState } from '@/components/ui/ErrorState'
import { GENRE_DISPLAY, PLATFORM_DISPLAY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Search Video Games',
  description: 'Search and filter games across all genres and platforms on GameRank.',
}

interface SearchPageProps {
  searchParams: {
    q?: string
    genres?: string
    platforms?: string
    ordering?: string
  }
}

async function searchGames(query: string, genres?: string, platforms?: string, ordering?: string) {
  try {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) return []
    const params = new URLSearchParams()
    params.set('key', apiKey)
    params.set('page_size', '30')
    if (query) params.set('search', query)
    if (genres) params.set('genres', genres)
    if (platforms) params.set('platforms', platforms)
    if (ordering) params.set('ordering', ordering)
    else params.set('ordering', '-rating')

    const res = await fetch(`https://api.rawg.io/api/games?${params.toString()}`, {
      next: { revalidate: 300 }
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const genres = searchParams.genres || ''
  const platforms = searchParams.platforms || ''
  const ordering = searchParams.ordering || ''

  const games = await searchGames(query, genres, platforms, ordering)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3">Search & Filter Games</h1>
        <p className="text-gray-400">Find any video game worldwide with customized tags, genres, and platforms.</p>
      </div>

      {/* Interactive Search & Filter Controls */}
      <SearchBar initialQuery={query} initialGenre={genres} initialPlatform={platforms} initialOrdering={ordering} />

      {/* Results Header */}
      <div className="flex items-center justify-between my-6 border-b border-white/10 pb-4">
        <h2 className="text-lg font-bold text-white">
          {query ? `Results for "${query}"` : 'All Filtered Games'}
        </h2>
        <span className="text-sm text-gray-500">{games.length} titles found</span>
      </div>

      {/* Results Grid */}
      {games.length === 0 ? (
        <EmptyState message="No games matched your search criteria. Try adjusting your query or filters." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {games.map((game: any) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
