'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GameCard } from '@/components/ui/GameCard'
import { GameRecord } from '@/types/database'

interface GameCarouselProps {
  title: string
  subtitle?: string
  games: GameRecord[]
  icon?: string
  showRank?: boolean
}

export function GameCarousel({
  title,
  subtitle,
  games,
  icon,
  showRank = false,
}: GameCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current
      const scrollAmount = clientWidth * 0.75
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (!games || games.length === 0) return null

  return (
    <section className="relative group/carousel">
      {/* Header with Navigation Controls */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          {subtitle && <p className="text-gray-400 text-xs md:text-sm mt-0.5">{subtitle}</p>}
        </div>

        {/* Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg bg-white/5 hover:bg-[#00ff88] hover:text-black text-gray-300 transition-colors border border-white/10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg bg-white/5 hover:bg-[#00ff88] hover:text-black text-gray-300 transition-colors border border-white/10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth no-scrollbar select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game, index) => (
          <div
            key={game.id}
            className="w-[180px] sm:w-[200px] md:w-[220px] shrink-0"
          >
            <GameCard game={game} rank={index + 1} showRank={showRank} />
          </div>
        ))}
      </div>
    </section>
  )
}
