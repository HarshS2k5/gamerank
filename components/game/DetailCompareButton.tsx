'use client'

import { Scale, Check } from 'lucide-react'
import { useComparison } from '@/components/comparison/ComparisonContext'

interface DetailCompareButtonProps {
  slug: string
  gameName: string
}

export function DetailCompareButton({ slug, gameName }: DetailCompareButtonProps) {
  const { isSelected, toggleGame, selectedSlugs } = useComparison()
  const active = isSelected(slug)
  const isFull = selectedSlugs.length >= 4 && !active

  return (
    <button
      onClick={() => toggleGame(slug)}
      disabled={isFull}
      aria-label={active ? `Remove ${gameName} from compare` : `Add ${gameName} to compare`}
      className={`glass-card px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-semibold transition-all duration-300 active:scale-95 ${
        active
          ? 'bg-[#00ff88]/20 border-[#00ff88]/60 text-[#00ff88] shadow-lg shadow-[#00ff88]/20'
          : isFull
          ? 'opacity-50 cursor-not-allowed border-white/10 text-gray-500'
          : 'border-white/15 hover:border-[#00ff88]/40 text-gray-300 hover:text-white hover:bg-white/10'
      }`}
      title={isFull ? 'Comparison limit reached (max 4 games)' : undefined}
    >
      {active ? (
        <>
          <Check className="w-4 h-4 text-[#00ff88]" />
          <span>In Comparison ({selectedSlugs.length}/4)</span>
        </>
      ) : (
        <>
          <Scale className="w-4 h-4 text-gray-400" />
          <span>Add to Compare</span>
        </>
      )}
    </button>
  )
}
