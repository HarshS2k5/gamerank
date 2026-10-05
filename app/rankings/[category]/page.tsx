import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { GameCard } from '@/components/ui/GameCard'
import { Pagination } from '@/components/ui/Pagination'
import { RankingFilters } from '@/components/rankings/RankingFilters'
import { Trophy } from 'lucide-react'
import { GameDataProvider } from '@/lib/provider'

const CATEGORY_META: Record<string, { title: string; description: string; icon: string }> = {
  // Worldwide
  'all-time': { title: 'Top 100 Games of All Time', description: 'The highest-rated video games ever made, ranked by GameRank algorithm.', icon: '🥇' },
  'top-rated': { title: 'Top Rated Games', description: 'Games with the absolute highest critic and user ratings across all platforms.', icon: '⭐' },
  'most-popular': { title: 'Most Popular Games', description: 'Worldwide most active and widely played games right now.', icon: '🔥' },
  'trending': { title: 'Trending Games Worldwide', description: 'Titles experiencing explosive player interest and viral momentum.', icon: '📈' },
  'best-of-year': { title: 'Best Games of the Year', description: 'Standout video games released over the past 12-24 months.', icon: '📅' },
  'upcoming': { title: 'Most Anticipated Upcoming Games', description: 'Upcoming blockbuster releases with massive community hype.', icon: '⏳' },
  'free-to-play': { title: 'Best Free-to-Play Games', description: 'Zero cost, maximum quality — the best free games in the world.', icon: '🆓' },
  'multiplayer': { title: 'Best Multiplayer Games', description: 'Top titles to jump into with online players and competitive squads.', icon: '👥' },
  'co-op': { title: 'Best Co-op Games', description: 'Team up with friends for cooperative campaigns and raids.', icon: '🤝' },
  'cross-platform': { title: 'Best Cross-Platform Games', description: 'Seamless play across PC, consoles, and mobile devices.', icon: '🌐' },
  'crossplay': { title: 'Best Crossplay Games', description: 'Connect with friends no matter which platform they own.', icon: '🔄' },

  // Platforms
  'pc': { title: 'Best PC Games', description: 'Unrivaled PC masterworks from Steam, Epic Games, and Battle.net.', icon: '🖥️' },
  'playstation': { title: 'Best PlayStation Games', description: 'The finest titles across PlayStation 5 and PlayStation 4.', icon: '🎮' },
  'ps5': { title: 'Best PS5 Games', description: 'Harnessing the full power of PlayStation 5 next-generation hardware.', icon: '⚡' },
  'ps4': { title: 'Best PS4 Games', description: 'Timeless PlayStation 4 classics with unforgettable storytelling.', icon: '🕹️' },
  'xbox': { title: 'Best Xbox Games', description: 'Top titles available on Xbox Series X|S, Xbox One, and Game Pass.', icon: '🟩' },
  'nintendo': { title: 'Best Nintendo Games', description: 'Masterpiece adventures from Nintendo Switch and Nintendo consoles.', icon: '🕹️' },
  'nintendo-switch': { title: 'Best Nintendo Switch Games', description: 'Portable and docked favorites for Nintendo Switch.', icon: '🔴' },
  'mobile': { title: 'Best Mobile Games Overall', description: 'High-quality gaming experiences for iOS and Android smartphones.', icon: '📱' },
  'android': { title: 'Best Android Games', description: 'Top mobile games available on the Google Play Store.', icon: '🤖' },
  'ios': { title: 'Best iPhone & iPad Games', description: 'Premium and free mobile experiences optimized for iOS devices.', icon: '🍎' },

  // Genres
  'action': { title: 'Best Action Games', description: 'High-octane, reflex-driven gameplay from around the world.', icon: '💥' },
  'rpg': { title: 'Best RPG Games', description: 'Deep character building, world exploration, and engaging storytelling.', icon: '⚔️' },
  'action-rpg': { title: 'Best Action RPGs', description: 'Fast combat combined with rich role-playing mechanics.', icon: '🗡️' },
  'shooter': { title: 'Best Shooter Games', description: 'Tactical and adrenaline-fueled first-person and third-person shooters.', icon: '🔫' },
  'fps': { title: 'Best First-Person Shooters', description: 'Master the gunplay in the world’s most intense FPS games.', icon: '🎯' },
  'open-world': { title: 'Best Open-World Games', description: 'Vast, seamless landscapes waiting for unguided exploration.', icon: '🌍' },
  'horror': { title: 'Best Horror Games', description: 'Spine-chilling psychological and survival horror masterpieces.', icon: '👻' },
  'racing': { title: 'Best Racing Games', description: 'Arcade and simulation racers delivering blisteringly fast speeds.', icon: '🏎️' },
  'sports': { title: 'Best Sports Games', description: 'Authentic athletic simulations and high-energy arcade sports.', icon: '⚽' },
  'strategy': { title: 'Best Strategy Games', description: 'Turn-based and real-time tactical mastery from top designers.', icon: '♟️' },
  'fighting': { title: 'Best Fighting Games', description: 'Frame-precise martial arts and fighting tournaments.', icon: '🥋' },
  'battle-royale': { title: 'Best Battle Royale Games', description: '100 players drop in, only one survivor remains.', icon: '🪂' },
  'moba': { title: 'Best MOBA Games', description: '5v5 tactical arena battlegrounds defining modern esports.', icon: '🏰' },
  'sandbox': { title: 'Best Sandbox Games', description: 'Unlimited player freedom to build, craft, and experiment.', icon: '🧱' },
  'platformer': { title: 'Best Platformers', description: 'Precision jumping and joyful 2D/3D platforming adventures.', icon: '🍄' },
  'indie': { title: 'Best Indie Games', description: 'Visionary gems crafted by passionate independent studios.', icon: '🎨' },
  'roguelike': { title: 'Best Roguelikes', description: 'Procedural runs where every death teaches a valuable lesson.', icon: '🎲' },
  'survival': { title: 'Best Survival Games', description: 'Scavenge, craft, and endure against hostile environments.', icon: '🏕️' },
  'simulation': { title: 'Best Simulation Games', description: 'Authentic life, farm, and engineering simulations.', icon: '🚜' },
  'story': { title: 'Best Story-Rich Games', description: 'Games with cinematic emotional narratives and indelible characters.', icon: '📖' },
}

interface PageProps {
  params: { category: string }
  searchParams: { page?: string; ordering?: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const meta = CATEGORY_META[params.category]
  if (!meta) return { title: 'Rankings | GameRank' }
  return {
    title: `${meta.title} | GameRank`,
    description: meta.description,
  }
}

export default async function RankingCategoryPage({ params, searchParams }: PageProps) {
  const { category } = params
  const meta = CATEGORY_META[category] || {
    title: `Best ${category.toUpperCase()} Games`,
    description: 'Ranked video games with authentic cover art and ratings.',
    icon: '🏆',
  }

  const page = parseInt(searchParams.page || '1', 10)
  const ordering = searchParams.ordering || '-gamerank'

  // Fetch games via scalable GameDataProvider
  const allRankedGames = await GameDataProvider.getRankingsByCategory(category)
  
  // Custom ordering if requested
  let games = [...allRankedGames]
  if (ordering === '-metacritic') games.sort((a, b) => b.criticScore - a.criticScore)
  else if (ordering === '-rating') games.sort((a, b) => b.playerScore - a.playerScore)
  else if (ordering === '-added') games.sort((a, b) => b.popularity - a.popularity)
  else if (ordering === '-released') games.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())

  const totalCount = games.length
  const pageSize = 20
  const totalPages = Math.ceil(totalCount / pageSize)
  const paginatedGames = games.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-[#00ff88] text-xs font-bold uppercase tracking-wider mb-3">
          <Trophy className="w-4 h-4" />
          <span>GameRank Worldwide Rankings</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-3">
              {meta.icon} {meta.title}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {meta.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[#00ff88] font-black text-lg">{totalCount} Games</div>
            <div className="text-gray-500 text-xs mt-0.5">Page {page} of {Math.max(totalPages, 1)}</div>
          </div>
        </div>
      </div>

      {/* Sorting Controls */}
      <RankingFilters currentOrdering={ordering} />

      {/* Game Posters Grid (Every Card Has An Official Poster!) */}
      {paginatedGames.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-2xl">
          <p className="text-gray-400">No games found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {paginatedGames.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              rank={(page - 1) * pageSize + index + 1}
              showRank={true}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-14">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
