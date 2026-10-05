'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Trash2, X, Scale } from 'lucide-react'
import { useComparison } from './ComparisonContext'

export function ComparisonBar() {
  const { selectedSlugs, removeGame, clearComparison } = useComparison()
  const pathname = usePathname()

  // Hide bar on the compare page itself to prevent duplicate UI
  if (selectedSlugs.length === 0 || pathname.startsWith('/compare')) {
    return null
  }

  const compareUrl = `/compare?games=${selectedSlugs.join(',')}`

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-in slide-in-from-bottom duration-300">
      <div className="glass-card bg-[#141416]/95 backdrop-blur-xl border border-[#00ff88]/30 shadow-2xl shadow-black/80 p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-4">
        
        {/* Left Info & Chips */}
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#00ff88] shrink-0">
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
            <span className="bg-[#00ff88]/20 px-1.5 py-0.5 rounded text-[11px]">
              {selectedSlugs.length}/4
            </span>
          </div>

          {/* Selected Slugs Badges */}
          <div className="flex items-center gap-1.5 shrink-0">
            {selectedSlugs.map((slug) => (
              <span
                key={slug}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg text-xs text-white border border-white/10 transition-colors"
              >
                <span className="capitalize max-w-[100px] truncate">{slug.replace(/-/g, ' ')}</span>
                <button
                  onClick={() => removeGame(slug)}
                  className="hover:text-red-400 p-0.5"
                  title="Remove from comparison"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearComparison}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors text-xs flex items-center gap-1"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Clear</span>
          </button>

          <Link
            href={compareUrl}
            className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm px-4 py-2 font-bold whitespace-nowrap"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  )
}
