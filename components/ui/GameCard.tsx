import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, Gamepad2 } from 'lucide-react'
import { RAWGGame } from '@/types'
import { formatDate, getMetacriticBgColor, truncateText, getImageUrl } from '@/lib/utils'

interface GameCardProps {
  game: RAWGGame
  rank?: number
  showRank?: boolean
  size?: 'sm' | 'md' | 'lg'
}

function MetacriticBadge({ score }: { score: number | null }) {
  if (!score) return null
  const bg = score >= 75 ? 'bg-green-600' : score >= 50 ? 'bg-yellow-500' : 'bg-red-600'
  const textColor = score >= 50 ? 'text-white' : 'text-white'
  return (
    <span className={`${bg} ${textColor} text-xs font-bold px-1.5 py-0.5 rounded`}>
      {score}
    </span>
  )
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      <span className="text-xs text-gray-300">{rating.toFixed(1)}</span>
    </div>
  )
}

function PlatformIcons({ platforms }: { platforms: RAWGGame['parent_platforms'] }) {
  if (!platforms || platforms.length === 0) return null
  const icons: Record<string, string> = {
    pc: '🖥️', playstation: '🎮', xbox: '🎮', nintendo: '🕹️',
    android: '📱', ios: '📱', 'apple-macintosh': '🍎', linux: '🐧',
  }
  return (
    <div className="flex items-center gap-1">
      {platforms.slice(0, 4).map(({ platform }) => (
        <span key={platform.id} className="text-xs" title={platform.name}>
          {icons[platform.slug] || '🎮'}
        </span>
      ))}
    </div>
  )
}

export function GameCard({ game, rank, showRank = false, size = 'md' }: GameCardProps) {
  const imageUrl = getImageUrl(game.background_image)
  const isLarge = size === 'lg'
  const isSmall = size === 'sm'

  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <div className="game-card overflow-hidden h-full">
        {/* Cover Image */}
        <div className={`relative overflow-hidden ${isLarge ? 'aspect-video' : isSmall ? 'aspect-[3/2]' : 'aspect-video'}`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={game.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
            />
          ) : (
            <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
              <Gamepad2 className="w-12 h-12 text-gray-600" />
            </div>
          )}

          {/* Rank Badge */}
          {showRank && rank && (
            <div className="absolute top-2 left-2">
              <div className={`rank-badge text-xs font-bold ${
                rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' :
                rank <= 10 ? 'bg-[#00ff88] text-black' :
                'bg-black/80 text-white border border-white/20'
              }`}>
                #{rank}
              </div>
            </div>
          )}

          {/* Metacritic Badge */}
          {game.metacritic && (
            <div className="absolute top-2 right-2">
              <MetacriticBadge score={game.metacritic} />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className={`p-3 ${isLarge ? 'p-4' : ''}`}>
          <h3 className={`font-semibold text-white mb-1 line-clamp-2 group-hover:text-[#00ff88] transition-colors ${
            isLarge ? 'text-lg' : isSmall ? 'text-sm' : 'text-base'
          }`}>
            {game.name}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {game.rating > 0 && <RatingStars rating={game.rating} />}
              {game.metacritic && <MetacriticBadge score={game.metacritic} />}
            </div>
            {game.released && (
              <span className="text-xs text-gray-500">
                {new Date(game.released).getFullYear()}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <PlatformIcons platforms={game.parent_platforms} />
            {game.genres && game.genres.length > 0 && (
              <span className="text-xs text-gray-500 truncate max-w-[80px]">
                {game.genres[0].name}
              </span>
            )}
          </div>

          {game.playtime > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">{game.playtime}h avg</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export function GameCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-video loading-skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 loading-skeleton rounded w-3/4" />
        <div className="h-3 loading-skeleton rounded w-1/2" />
        <div className="h-3 loading-skeleton rounded w-1/3" />
      </div>
    </div>
  )
}
