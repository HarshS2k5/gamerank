import Image from 'next/image'
import Link from 'next/link'
import { Star, TrendingUp } from 'lucide-react'
import { RAWGGame } from '@/types'
import { getImageUrl } from '@/lib/utils'
import { GameImage } from '@/components/ui/GameImage'

interface RankingCardProps {
  game: RAWGGame
  rank: number
}

export function RankingCard({ game, rank }: RankingCardProps) {
  const imageUrl = getImageUrl((game as any).coverImage || (game as any).thumbnailImage || game.background_image)

  const rankStyle = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-orange-400' : 'text-gray-500'
  const rankBg = rank <= 3 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : ''

  return (
    <Link href={`/games/${game.slug}`}>
      <div className={`flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group ${rankBg}`}>
        {/* Rank Number */}
        <div className={`text-2xl font-black w-10 text-center shrink-0 ${rankStyle}`}>
          {rank <= 3 ? (['🥇', '🥈', '🥉'][rank - 1]) : rank}
        </div>

        {/* Game Image */}
        <div className="relative w-14 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
          <GameImage src={imageUrl} alt={game.name} aspectRatio="poster" />
        </div>

        {/* Game Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-[#00ff88] transition-colors">
            {game.name}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            {game.genres && game.genres.length > 0 && (
              <span className="text-xs text-gray-500">{game.genres.slice(0, 2).map(g => g.name).join(', ')}</span>
            )}
          </div>
        </div>

        {/* Scores */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {game.metacritic && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              game.metacritic >= 75 ? 'bg-green-600 text-white' :
              game.metacritic >= 50 ? 'bg-yellow-500 text-black' :
              'bg-red-600 text-white'
            }`}>
              {game.metacritic}
            </span>
          )}
          {game.rating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-400">{game.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
