import Link from 'next/link'

const GENRES = [
  { slug: 'action', name: 'Action', icon: '💥', color: 'hover:border-red-500/40' },
  { slug: 'rpg', name: 'RPG', icon: '⚔️', color: 'hover:border-purple-500/40' },
  { slug: 'shooter', name: 'Shooter', icon: '🔫', color: 'hover:border-orange-500/40' },
  { slug: 'strategy', name: 'Strategy', icon: '♟️', color: 'hover:border-blue-500/40' },
  { slug: 'horror', name: 'Horror', icon: '👻', color: 'hover:border-purple-800/40' },
  { slug: 'sports', name: 'Sports', icon: '⚽', color: 'hover:border-green-500/40' },
  { slug: 'racing', name: 'Racing', icon: '🏎️', color: 'hover:border-yellow-500/40' },
  { slug: 'indie', name: 'Indie', icon: '🎨', color: 'hover:border-pink-500/40' },
  { slug: 'open-world', name: 'Open World', icon: '🌍', color: 'hover:border-teal-500/40' },
  { slug: 'multiplayer', name: 'Multiplayer', icon: '👥', color: 'hover:border-cyan-500/40' },
  { slug: 'story', name: 'Story Rich', icon: '📖', color: 'hover:border-amber-500/40' },
  { slug: 'free-to-play', name: 'Free to Play', icon: '🆓', color: 'hover:border-green-400/40' },
]

export function GenreGrid() {
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="section-heading">🎭 Explore by Genre</h2>
          <p className="section-subtitle">Find your favorite type of game</p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {GENRES.map((genre) => (
          <Link key={genre.slug} href={`/rankings/${genre.slug}`}>
            <div className={`glass-card p-3 text-center hover:scale-105 transition-all duration-300 cursor-pointer border border-white/10 ${genre.color}`}>
              <div className="text-2xl mb-2">{genre.icon}</div>
              <h3 className="text-white font-medium text-xs">{genre.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
