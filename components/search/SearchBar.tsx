'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, RotateCcw } from 'lucide-react'
import { GENRE_DISPLAY, PLATFORM_DISPLAY } from '@/lib/constants'

interface SearchBarProps {
  initialQuery?: string
  initialGenre?: string
  initialPlatform?: string
  initialOrdering?: string
}

export function SearchBar({
  initialQuery = '',
  initialGenre = '',
  initialPlatform = '',
  initialOrdering = '-rating'
}: SearchBarProps) {
  const [q, setQ] = useState(initialQuery)
  const [genre, setGenre] = useState(initialGenre)
  const [platform, setPlatform] = useState(initialPlatform)
  const [ordering, setOrdering] = useState(initialOrdering)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (genre) params.set('genres', genre)
    if (platform) params.set('platforms', platform)
    if (ordering) params.set('ordering', ordering)
    router.push(`/search?${params.toString()}`)
  }

  const resetFilters = () => {
    setQ('')
    setGenre('')
    setPlatform('')
    setOrdering('-rating')
    router.push('/search')
  }

  return (
    <div className="glass-card p-6 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by game title, e.g. Elden Ring, Zelda, Cyberpunk..."
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50 focus:bg-white/10 transition-all text-sm"
          />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2 text-sm">
          <Search className="w-4 h-4" /> Search
        </button>
      </form>

      {/* Filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value)
            const params = new URLSearchParams(window.location.search)
            if (e.target.value) params.set('genres', e.target.value)
            else params.delete('genres')
            router.push(`/search?${params.toString()}`)
          }}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#00ff88]"
        >
          <option value="" className="bg-[#1a1a1a]">All Genres</option>
          {GENRE_DISPLAY.map((g) => (
            <option key={g.slug} value={g.slug} className="bg-[#1a1a1a]">
              {g.icon} {g.name}
            </option>
          ))}
        </select>

        <select
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value)
            const params = new URLSearchParams(window.location.search)
            if (e.target.value) params.set('platforms', e.target.value)
            else params.delete('platforms')
            router.push(`/search?${params.toString()}`)
          }}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#00ff88]"
        >
          <option value="" className="bg-[#1a1a1a]">All Platforms</option>
          <option value="4" className="bg-[#1a1a1a]">🖥️ PC</option>
          <option value="187,18" className="bg-[#1a1a1a]">🎮 PlayStation (PS4/PS5)</option>
          <option value="186,1" className="bg-[#1a1a1a]">🟩 Xbox (One/Series)</option>
          <option value="7" className="bg-[#1a1a1a]">🕹️ Nintendo Switch</option>
          <option value="21" className="bg-[#1a1a1a]">📱 Android</option>
          <option value="3" className="bg-[#1a1a1a]">🍎 iOS</option>
        </select>

        <select
          value={ordering}
          onChange={(e) => {
            setOrdering(e.target.value)
            const params = new URLSearchParams(window.location.search)
            params.set('ordering', e.target.value)
            router.push(`/search?${params.toString()}`)
          }}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#00ff88]"
        >
          <option value="-rating" className="bg-[#1a1a1a]">Highest User Rating</option>
          <option value="-metacritic" className="bg-[#1a1a1a]">Highest Critic Score</option>
          <option value="-added" className="bg-[#1a1a1a]">Most Popular</option>
          <option value="-released" className="bg-[#1a1a1a]">Newest Release Date</option>
        </select>
      </div>
    </div>
  )
}
