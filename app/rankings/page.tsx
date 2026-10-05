import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Game Rankings',
  description: 'Browse all game rankings by platform, genre, and category on GameRank.',
}

const RANKING_GROUPS = [
  {
    title: '🏆 Overall Rankings',
    description: 'The definitive lists of the best games',
    rankings: [
      { href: '/rankings/all-time', label: 'Top 100 Games of All Time', icon: '🥇', desc: 'The highest-rated games ever made' },
      { href: '/rankings/most-popular', label: 'Most Popular Right Now', icon: '🔥', desc: 'Games trending worldwide' },
      { href: '/rankings/best-of-year', label: 'Best Games of the Year', icon: '📅', desc: 'Top-rated releases this year' },
      { href: '/rankings/upcoming', label: 'Most Anticipated Upcoming', icon: '⏳', desc: 'Most wanted upcoming releases' },
    ]
  },
  {
    title: '🖥️ By Platform',
    description: 'Best games for each gaming platform',
    rankings: [
      { href: '/rankings/pc', label: 'Best PC Games', icon: '🖥️', desc: 'Top Steam and PC titles' },
      { href: '/rankings/playstation', label: 'Best PlayStation Games', icon: '🎮', desc: 'PS4 and PS5 exclusives and more' },
      { href: '/rankings/xbox', label: 'Best Xbox Games', icon: '🟩', desc: 'Xbox One and Series X|S games' },
      { href: '/rankings/nintendo', label: 'Best Nintendo Games', icon: '🕹️', desc: 'Switch and Nintendo titles' },
      { href: '/rankings/android', label: 'Best Android Games', icon: '📱', desc: 'Top Android mobile games' },
      { href: '/rankings/ios', label: 'Best iOS Games', icon: '🍎', desc: 'Top iPhone and iPad games' },
      { href: '/rankings/cross-platform', label: 'Best Cross-Platform', icon: '🌐', desc: 'Games on multiple platforms' },
    ]
  },
  {
    title: '🎭 By Genre',
    description: 'Rankings within each game genre',
    rankings: [
      { href: '/rankings/action', label: 'Best Action Games', icon: '💥', desc: 'Fast-paced action titles' },
      { href: '/rankings/rpg', label: 'Best RPG Games', icon: '⚔️', desc: 'Role-playing adventures' },
      { href: '/rankings/shooter', label: 'Best Shooter Games', icon: '🔫', desc: 'FPS and TPS titles' },
      { href: '/rankings/strategy', label: 'Best Strategy Games', icon: '♟️', desc: 'Turn-based and real-time strategy' },
      { href: '/rankings/horror', label: 'Best Horror Games', icon: '👻', desc: 'Scariest and best horror titles' },
      { href: '/rankings/sports', label: 'Best Sports Games', icon: '⚽', desc: 'Football, basketball, and more' },
      { href: '/rankings/racing', label: 'Best Racing Games', icon: '🏎️', desc: 'Fastest racing games' },
      { href: '/rankings/indie', label: 'Best Indie Games', icon: '🎨', desc: 'Top indie developer titles' },
    ]
  },
  {
    title: '🎯 By Feature',
    description: 'Rankings for specific game features',
    rankings: [
      { href: '/rankings/multiplayer', label: 'Best Multiplayer Games', icon: '👥', desc: 'Play with friends online' },
      { href: '/rankings/open-world', label: 'Best Open-World Games', icon: '🌍', desc: 'Explore vast open worlds' },
      { href: '/rankings/story', label: 'Best Story Games', icon: '📖', desc: 'Games with gripping narratives' },
      { href: '/rankings/free-to-play', label: 'Best Free-to-Play Games', icon: '🆓', desc: 'Top quality, zero cost' },
    ]
  },
]

export default function RankingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 text-[#00ff88] text-sm font-medium px-4 py-2 rounded-full mb-6">
          <Trophy className="w-4 h-4" />
          Worldwide Rankings
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          All Game Rankings
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore comprehensive rankings across platforms, genres, and categories — all powered by real game data.
        </p>
      </div>

      <div className="space-y-16">
        {RANKING_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">{group.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{group.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group.rankings.map((ranking) => (
                <Link key={ranking.href} href={ranking.href}>
                  <div className="glass-card p-5 hover:border-[#00ff88]/30 transition-all duration-300 group cursor-pointer h-full">
                    <div className="text-2xl mb-3">{ranking.icon}</div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-[#00ff88] transition-colors">
                      {ranking.label}
                    </h3>
                    <p className="text-gray-500 text-sm">{ranking.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
