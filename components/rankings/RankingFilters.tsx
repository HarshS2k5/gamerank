'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Grid, List } from 'lucide-react'

const ORDERING_OPTIONS = [
  { value: '-metacritic', label: 'Critic Score' },
  { value: '-rating', label: 'User Rating' },
  { value: '-added', label: 'Popularity' },
  { value: '-released', label: 'Release Date' },
  { value: '-name', label: 'Name (Z-A)' },
  { value: 'name', label: 'Name (A-Z)' },
]

interface RankingFiltersProps {
  currentOrdering?: string
  currentView?: string
}

export function RankingFilters({ currentOrdering, currentView = 'grid' }: RankingFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    if (key !== 'page') params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 glass-card">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm font-medium">Sort by:</span>
        <div className="flex flex-wrap gap-2">
          {ORDERING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('ordering', opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentOrdering === opt.value
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">View:</span>
        <button
          onClick={() => updateParam('view', 'grid')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'grid' ? 'bg-[#00ff88] text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
          title="Grid view"
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => updateParam('view', 'list')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'list' ? 'bg-[#00ff88] text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
          title="List view"
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
