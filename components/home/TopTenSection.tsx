import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

async function getTopTenGames() {
  try {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) return []
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&ordering=-metacritic&page_size=10&metacritic=80,100`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

export async function TopTenSection() {
  const games = await getTopTenGames()

  if (games.length === 0) return null

  return (
    <section>
      <SectionHeader
        title="Top 10 Worldwide"
        subtitle="The highest-rated games of all time"
        viewAllHref="/rankings/all-time"
        viewAllLabel="Full Top 100"
        icon="🏆"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {games.map((game: any, index: number) => (
          <Link key={game.id} href={`/games/${game.slug}`}>
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group">
              {/* Rank */}
              <div
                className={`text-2xl font-black w-10 text-center shrink-0 ${
                  index === 0
                    ? 'text-yellow-400'
                    : index === 1
                    ? 'text-gray-300'
                    : index === 2
                    ? 'text-orange-400'
                    : 'text-gray-600'
                }`}
              >
                {index === 0
                  ? '🥇'
                  : index === 1
                  ? '🥈'
                  : index === 2
                  ? '🥉'
                  : `#${index + 1}`}
              </div>

              {/* Image */}
              <div className="relative w-20 h-12 rounded-lg overflow-hidden shrink-0">
                {game.background_image && (
                  <Image
                    src={game.background_image}
                    alt={game.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-[#00ff88] transition-colors">
                  {game.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {game.genres?.slice(0, 1).map((g: any) => (
                    <span key={g.id} className="text-xs text-gray-500">
                      {g.name}
                    </span>
                  ))}
                  {game.released && (
                    <span className="text-xs text-gray-600">
                      {new Date(game.released).getFullYear()}
                    </span>
                  )}
                </div>
              </div>

              {/* Scores */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                {game.metacritic && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      game.metacritic >= 90
                        ? 'bg-green-500 text-white'
                        : game.metacritic >= 75
                        ? 'bg-green-700 text-white'
                        : 'bg-yellow-500 text-black'
                    }`}
                  >
                    {game.metacritic}
                  </span>
                )}
                {game.rating > 0 && (
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-400">
                      {game.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
