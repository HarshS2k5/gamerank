import Link from 'next/link'
import { Star, Trophy } from 'lucide-react'
import { GameImage } from '@/components/ui/GameImage'
import { GameRecord } from '@/types/database'

interface GameCardProps {
  game: GameRecord
  rank?: number
  showRank?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function GameCard({ game, rank, showRank = false, size = 'md' }: GameCardProps) {
  const isLarge = size === 'lg'
  const isSmall = size === 'sm'

  // Map platform badges
  const platformAbbr: Record<string, string> = {
    'PC': 'PC',
    'PlayStation': 'PS',
    'PlayStation 5': 'PS5',
    'PlayStation 4': 'PS4',
    'Xbox': 'Xbox',
    'Xbox Series X': 'XSX',
    'Nintendo Switch': 'Switch',
    'Android': 'Android',
    'iOS': 'iOS',
  }

  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <div className="glass-card overflow-hidden h-full flex flex-col border border-white/10 hover:border-[#00ff88]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#00ff88]/10 hover:-translate-y-1.5">
        {/* DOMINANT POSTER ARTWORK (3:4 ratio for authentic game covers) */}
        <div className="relative overflow-hidden w-full aspect-[3/4]">
          <GameImage
            src={game.coverImage}
            alt={game.name}
            aspectRatio="poster"
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />

          {/* Ranking Badge Top-Left */}
          {showRank && rank && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <div
                className={`px-2 py-0.5 rounded-md text-xs font-black shadow-lg ${
                  rank === 1
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                    : rank === 2
                    ? 'bg-gradient-to-r from-slate-200 to-gray-400 text-black'
                    : rank === 3
                    ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white'
                    : 'bg-black/80 backdrop-blur-md text-[#00ff88] border border-[#00ff88]/30'
                }`}
              >
                #{rank < 10 ? `0${rank}` : rank}
              </div>
            </div>
          )}

          {/* GameRank Score Top-Right */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <div className="flex items-center gap-1 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20 text-white shadow-md">
              <Star className="w-3 h-3 text-[#00ff88] fill-[#00ff88]" />
              <span className="text-xs font-black text-[#00ff88]">{game.gameRankScore}</span>
              <span className="text-[10px] text-gray-400">/100</span>
            </div>
          </div>

          {/* Free To Play Ribbon if applicable */}
          {game.freeToPlay && (
            <div className="absolute bottom-2 left-2 z-10">
              <span className="bg-[#00d4ff]/90 backdrop-blur-sm text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                Free to Play
              </span>
            </div>
          )}

          {/* Gradient Overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Card Info Section */}
        <div className="p-3.5 flex-1 flex flex-col justify-between bg-[#141416]">
          <div>
            <h3
              className={`font-bold text-white line-clamp-1 group-hover:text-[#00ff88] transition-colors ${
                isLarge ? 'text-base' : isSmall ? 'text-xs' : 'text-sm'
              }`}
              title={game.name}
            >
              {game.name}
            </h3>

            {/* Genres */}
            <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-xs">
              <span className="line-clamp-1">
                {game.genres.slice(0, 2).join(' • ')}
              </span>
            </div>
          </div>

          {/* Platforms Footer */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px] text-gray-400">
            <div className="flex items-center gap-1 truncate max-w-[130px]" title={game.platforms.join(', ')}>
              {game.platforms.slice(0, 3).map((p) => (
                <span key={p} className="bg-white/5 px-1.5 py-0.5 rounded text-[10px] text-gray-300 font-medium">
                  {platformAbbr[p] || p}
                </span>
              ))}
              {game.platforms.length > 3 && (
                <span className="text-gray-500 text-[10px]">+{game.platforms.length - 3}</span>
              )}
            </div>

            {/* Critic Score if available */}
            {game.criticScore > 0 && (
              <span
                className={`font-bold text-[11px] px-1.5 py-0.2 rounded ${
                  game.criticScore >= 90
                    ? 'text-green-400'
                    : game.criticScore >= 75
                    ? 'text-yellow-400'
                    : 'text-gray-400'
                }`}
                title="Metacritic Score"
              >
                MC {game.criticScore}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function GameCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-[3/4] loading-skeleton" />
      <div className="p-3.5 space-y-2">
        <div className="h-4 loading-skeleton rounded w-3/4" />
        <div className="h-3 loading-skeleton rounded w-1/2" />
        <div className="h-3 loading-skeleton rounded w-full pt-2" />
      </div>
    </div>
  )
}
