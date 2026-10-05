import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { GameCard } from '@/components/ui/GameCard'
import { RankingCard } from '@/components/ui/RankingCard'
import { Pagination } from '@/components/ui/Pagination'
import { RankingFilters } from '@/components/rankings/RankingFilters'
import { Trophy } from 'lucide-react'

const VALID_CATEGORIES = [
  'all-time', 'pc', 'android', 'ios', 'playstation', 'xbox', 'nintendo',
  'cross-platform', 'free-to-play', 'multiplayer', 'open-world', 'story',
  'rpg', 'action', 'shooter', 'racing', 'horror', 'strategy', 'sports',
  'indie', 'best-of-year', 'most-popular', 'upcoming'
]

const CATEGORY_META: Record<string, { title: string; description: string; icon: string }> = {
  'all-time': { title: 'Top 100 Games of All Time', description: 'The highest-rated video games ever made, ranked by critic scores, community ratings, and popularity.', icon: '🥇' },
  'pc': { title: 'Best PC Games', description: 'Top-rated PC games from Steam and beyond, ranked by GameRank score.', icon: '🖥️' },
  'android': { title: 'Best Android Games', description: 'Top-rated games for Android devices worldwide.', icon: '📱' },
  'ios': { title: 'Best iOS Games', description: 'Top-rated games for iPhone and iPad.', icon: '🍎' },
  'playstation': { title: 'Best PlayStation Games', description: 'Top-rated PlayStation 4 and PlayStation 5 games.', icon: '🎮' },
  'xbox': { title: 'Best Xbox Games', description: 'Top-rated Xbox One and Xbox Series X|S games.', icon: '🟩' },
  'nintendo': { title: 'Best Nintendo Games', description: 'Top-rated Nintendo Switch games and Nintendo exclusives.', icon: '🕹️' },
  'cross-platform': { title: 'Best Cross-Platform Games', description: 'Top games available across multiple platforms.', icon: '🌐' },
  'free-to-play': { title: 'Best Free-to-Play Games', description: 'Top-rated free games — zero cost, maximum fun.', icon: '🆓' },
  'multiplayer': { title: 'Best Multiplayer Games', description: 'Top games to play with friends online.', icon: '👥' },
  'open-world': { title: 'Best Open-World Games', description: 'Top games with vast open worlds to explore.', icon: '🌍' },
  'story': { title: 'Best Story-Rich Games', description: 'Games with the most compelling narratives and stories.', icon: '📖' },
  'rpg': { title: 'Best RPG Games', description: 'Top role-playing games with deep stories and character progression.', icon: '⚔️' },
  'action': { title: 'Best Action Games', description: 'Top fast-paced action games worldwide.', icon: '💥' },
  'shooter': { title: 'Best Shooter Games', description: 'Top first-person and third-person shooter games.', icon: '🔫' },
  'racing': { title: 'Best Racing Games', description: 'Top racing and driving games for all platforms.', icon: '🏎️' },
  'horror': { title: 'Best Horror Games', description: 'The scariest and most acclaimed horror games ever made.', icon: '👻' },
  'strategy': { title: 'Best Strategy Games', description: 'Top strategy games including turn-based and real-time strategy.', icon: '♟️' },
  'sports': { title: 'Best Sports Games', description: 'Top sports simulation and arcade sports games.', icon: '⚽' },
  'indie': { title: 'Best Indie Games', description: 'Top-rated independent developer games worldwide.', icon: '🎨' },
  'best-of-year': { title: 'Best Games of the Year', description: 'Top-rated games released this year.', icon: '📅' },
  'most-popular': { title: 'Most Popular Games Right Now', description: 'Games trending and most played worldwide right now.', icon: '🔥' },
  'upcoming': { title: 'Most Anticipated Upcoming Games', description: 'Most anticipated games coming soon.', icon: '⏳' },
}

interface PageProps {
  params: { category: string }
  searchParams: { page?: string; ordering?: string; view?: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const meta = CATEGORY_META[params.category]
  if (!meta) return { title: 'Rankings' }
  return {
    title: meta.title,
    description: meta.description,
  }
}

async function getRankingGames(category: string, page: number, ordering?: string) {
  try {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) return { results: [], count: 0 }
    
    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1
    const nextYear = currentYear + 1
    const now = new Date().toISOString().split('T')[0]
    const nextYearDate = `${nextYear}-12-31`
    
    const categoryParamsMap: Record<string, Record<string, string>> = {
      'all-time': { ordering: ordering || '-metacritic', metacritic: '1,100' },
      'pc': { platforms: '4', ordering: ordering || '-metacritic' },
      'android': { platforms: '21', ordering: ordering || '-rating' },
      'ios': { platforms: '3', ordering: ordering || '-rating' },
      'playstation': { platforms: '187,18,16', ordering: ordering || '-metacritic' },
      'xbox': { platforms: '186,1,14', ordering: ordering || '-metacritic' },
      'nintendo': { platforms: '7,83', ordering: ordering || '-metacritic' },
      'cross-platform': { ordering: ordering || '-rating' },
      'free-to-play': { tags: '35078', ordering: ordering || '-rating' },
      'multiplayer': { tags: '7', ordering: ordering || '-rating' },
      'open-world': { tags: '149', ordering: ordering || '-rating' },
      'story': { tags: '406', ordering: ordering || '-rating' },
      'rpg': { genres: '5', ordering: ordering || '-metacritic' },
      'action': { genres: '4', ordering: ordering || '-metacritic' },
      'shooter': { genres: '2', ordering: ordering || '-metacritic' },
      'racing': { genres: '1', ordering: ordering || '-metacritic' },
      'horror': { genres: '19', ordering: ordering || '-rating' },
      'strategy': { genres: '10', ordering: ordering || '-metacritic' },
      'sports': { genres: '15', ordering: ordering || '-metacritic' },
      'indie': { genres: '51', ordering: ordering || '-rating' },
      'best-of-year': { dates: `${lastYear}-01-01,${currentYear}-12-31`, ordering: ordering || '-metacritic' },
      'most-popular': { ordering: ordering || '-added' },
      'upcoming': { dates: `${now},${nextYearDate}`, ordering: ordering || '-added' },
    }
    
    const catParams = categoryParamsMap[category] || { ordering: '-rating' }
    const urlParams = new URLSearchParams()
    urlParams.set('key', apiKey)
    urlParams.set('page_size', '40')
    urlParams.set('page', String(page))
    Object.entries(catParams).forEach(([k, v]) => urlParams.set(k, v))
    
    const res = await fetch(
      `https://api.rawg.io/api/games?${urlParams.toString()}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return { results: [], count: 0 }
    return await res.json()
  } catch {
    return { results: [], count: 0 }
  }
}

export default async function RankingCategoryPage({ params, searchParams }: PageProps) {
  const { category } = params
  
  if (!VALID_CATEGORIES.includes(category)) {
    notFound()
  }
  
  const page = parseInt(searchParams.page || '1', 10)
  const ordering = searchParams.ordering
  const view = searchParams.view || 'grid'
  const meta = CATEGORY_META[category]
  
  const data = await getRankingGames(category, page, ordering)
  const games = data.results || []
  const totalCount = data.count || 0
  const totalPages = Math.ceil(totalCount / 40)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-[#00ff88] text-sm font-medium mb-3">
          <Trophy className="w-4 h-4" />
          <span>GameRank › Rankings</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
              {meta?.icon} {meta?.title || category}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">{meta?.description}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-gray-500 text-sm">{totalCount.toLocaleString()} games</div>
            <div className="text-gray-600 text-xs mt-1">Page {page} of {Math.max(totalPages, 1)}</div>
          </div>
        </div>
      </div>
      
      <RankingFilters currentOrdering={ordering} currentView={view} />
      
      {!process.env.RAWG_API_KEY && (
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
          ⚠️ <strong>RAWG_API_KEY not configured.</strong> Add it to .env.local to see real game data.
          <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer" className="underline ml-1">Get free key →</a>
        </div>
      )}
      
      {games.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎮</div>
          <p className="text-gray-400">No games found for this ranking.</p>
          <p className="text-gray-600 text-sm mt-2">Make sure your RAWG_API_KEY is configured in .env.local</p>
        </div>
      ) : view === 'list' ? (
        <div className="space-y-1">
          {games.map((game: any, index: number) => (
            <RankingCard
              key={game.id}
              game={game}
              rank={(page - 1) * 40 + index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {games.map((game: any, index: number) => (
            <GameCard
              key={game.id}
              game={game}
              rank={(page - 1) * 40 + index + 1}
              showRank={page === 1}
            />
          ))}
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination currentPage={page} totalPages={Math.min(totalPages, 25)} />
        </div>
      )}
      
      <div className="mt-16 glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-3">📊 Ranking Methodology</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          GameRank scores are calculated using a weighted combination of four factors:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Critic Score', weight: '40%', desc: 'Metacritic aggregate (when available)' },
            { label: 'Community Rating', weight: '30%', desc: 'RAWG user ratings (out of 5)' },
            { label: 'Popularity', weight: '20%', desc: 'Normalized ratings count' },
            { label: 'Recency Bonus', weight: '10%', desc: 'Up to +10 pts for recent releases' },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-[#00ff88] font-bold text-lg">{item.weight}</div>
              <div className="text-white text-sm font-medium mt-1">{item.label}</div>
              <div className="text-gray-500 text-xs mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-xs mt-4">
          Data source: <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-[#00ff88] hover:underline">RAWG Video Games Database API</a>.
          Rankings are cached for 1 hour and recalculated automatically.
        </p>
      </div>
    </div>
  )
}
