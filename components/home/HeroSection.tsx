import Image from 'next/image'
import Link from 'next/link'
import { Star, Calendar, ChevronRight, Trophy } from 'lucide-react'

async function getFeaturedGame() {
  try {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) return null

    // Get a highly rated, visually impressive game for hero
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&page_size=10&metacritic=85,100`,
      { next: { revalidate: 3600 * 6 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    // Return the first game that has a good background image
    const game =
      data.results?.find(
        (g: any) => g.background_image && g.background_image_additional
      ) || data.results?.[0]
    return game || null
  } catch {
    return null
  }
}

export async function HeroSection() {
  const game = await getFeaturedGame()

  if (!game) {
    // Fallback when no API key configured
    return (
      <div className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f]" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#00ff88]/20 text-[#00ff88] text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Trophy className="w-4 h-4" />
            Worldwide Gaming Rankings
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Discover the
            <span className="text-gradient block">World&apos;s Best</span>
            Games
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Data-driven rankings across PC, PlayStation, Xbox, Nintendo, and mobile — powered by real game data.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/rankings/all-time"
              className="btn-primary text-base px-8 py-3 flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Explore Rankings
            </Link>
            <Link href="/search" className="btn-secondary text-base px-8 py-3">
              Search Games
            </Link>
          </div>
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-400 max-w-md mx-auto">
            ⚠️ Add your RAWG_API_KEY to .env.local to see real game data.
            <a
              href="https://rawg.io/apidocs"
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              Get free key →
            </a>
          </div>
        </div>
      </div>
    )
  }

  const platforms = game.parent_platforms?.slice(0, 4) || []
  const platformIcons: Record<string, string> = {
    pc: '🖥️',
    playstation: '🎮',
    xbox: '🎮',
    nintendo: '🕹️',
    android: '📱',
    ios: '📱',
  }

  return (
    <div className="relative h-[85vh] min-h-[600px] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={game.background_image_additional || game.background_image}
          alt={game.name}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
      </div>

      {/* Featured Badge */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-2 bg-[#00ff88]/20 backdrop-blur-sm text-[#00ff88] text-xs font-bold px-3 py-1.5 rounded-full border border-[#00ff88]/30">
          <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
          FEATURED GAME
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="max-w-2xl">
          {/* Platform Icons */}
          {platforms.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {platforms.map(({ platform }: any) => (
                <span key={platform.id} className="text-xl" title={platform.name}>
                  {platformIcons[platform.slug] || '🎮'}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight">
            {game.name}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-4">
            {game.rating > 0 && (
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold text-lg">
                  {game.rating.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm">/ 5</span>
              </div>
            )}
            {game.metacritic && (
              <span
                className={`text-sm font-bold px-3 py-1 rounded ${
                  game.metacritic >= 75
                    ? 'bg-green-600'
                    : game.metacritic >= 50
                    ? 'bg-yellow-500 text-black'
                    : 'bg-red-600'
                } text-white`}
              >
                MC: {game.metacritic}
              </span>
            )}
            {game.released && (
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(game.released).getFullYear()}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {game.description_raw && (
            <p className="text-gray-300 text-base leading-relaxed mb-6 line-clamp-3">
              {game.description_raw.replace(/<[^>]*>/g, '').slice(0, 200)}...
            </p>
          )}

          {/* Genre Tags */}
          {game.genres && game.genres.length > 0 && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {game.genres.slice(0, 3).map((g: any) => (
                <Link
                  key={g.id}
                  href={`/rankings/${g.slug}`}
                  className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full text-gray-300 transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href={`/games/${game.slug}`}
              className="btn-primary flex items-center gap-2 text-base px-8 py-3"
            >
              View Game
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/rankings/all-time"
              className="btn-secondary flex items-center gap-2 text-base px-6 py-3"
            >
              <Trophy className="w-5 h-5" />
              Top Rankings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
