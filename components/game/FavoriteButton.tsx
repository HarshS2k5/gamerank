'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  slug: string
  gameName: string
}

export function FavoriteButton({ slug, gameName }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('gamerank_favorites')
      if (stored) {
        const favs: string[] = JSON.parse(stored)
        setIsFavorite(favs.includes(slug))
      }
    } catch {
      // ignore localStorage errors
    }
  }, [slug])

  const toggleFavorite = () => {
    try {
      const stored = localStorage.getItem('gamerank_favorites')
      let favs: string[] = stored ? JSON.parse(stored) : []
      if (favs.includes(slug)) {
        favs = favs.filter((s) => s !== slug)
        setIsFavorite(false)
      } else {
        favs.push(slug)
        setIsFavorite(true)
      }
      localStorage.setItem('gamerank_favorites', JSON.stringify(favs))
    } catch {
      setIsFavorite(!isFavorite)
    }
  }

  if (!mounted) {
    return (
      <button
        aria-label="Add to Favorites"
        className="glass-card px-4 py-2.5 rounded-xl border border-white/10 hover:border-red-500/50 flex items-center gap-2 text-sm font-semibold text-gray-300 transition-all duration-300"
      >
        <Heart className="w-4 h-4 text-gray-400" />
        <span>Favorite</span>
      </button>
    )
  }

  return (
    <button
      onClick={toggleFavorite}
      aria-label={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      className={`glass-card px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-semibold transition-all duration-300 active:scale-95 ${
        isFavorite
          ? 'bg-red-500/20 border-red-500/60 text-red-400 shadow-lg shadow-red-500/20'
          : 'border-white/15 hover:border-red-500/40 text-gray-300 hover:text-white hover:bg-white/10'
      }`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-200 ${
          isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400'
        }`}
      />
      <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
    </button>
  )
}
