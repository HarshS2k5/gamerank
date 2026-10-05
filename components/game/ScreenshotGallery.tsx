'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Maximize2, Camera } from 'lucide-react'

interface ScreenshotGalleryProps {
  screenshots: string[]
  gameName: string
}

export function ScreenshotGallery({ screenshots, gameName }: ScreenshotGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const isOpen = activeIndex !== null

  const handleClose = useCallback(() => {
    setActiveIndex(null)
  }, [])

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return
    setActiveIndex((prev) => (prev! > 0 ? prev! - 1 : screenshots.length - 1))
  }, [activeIndex, screenshots.length])

  const handleNext = useCallback(() => {
    if (activeIndex === null) return
    setActiveIndex((prev) => (prev! < screenshots.length - 1 ? prev! + 1 : 0))
  }, [activeIndex, screenshots.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, handleClose, handlePrev, handleNext])

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    touchStartX.current = null
  }

  if (!screenshots || screenshots.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#00ff88]" />
          Official Screenshots
          <span className="text-xs text-gray-500 font-normal">({screenshots.length})</span>
        </h2>
        <span className="text-xs text-gray-400 hidden sm:inline">Click image to enlarge</span>
      </div>

      {/* Grid of thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {screenshots.map((shot, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="group relative aspect-video rounded-xl overflow-hidden glass-card border border-white/10 hover:border-[#00ff88]/50 focus:outline-none focus:ring-2 focus:ring-[#00ff88] transition-all duration-300 text-left"
            aria-label={`Open screenshot ${idx + 1} of ${gameName}`}
          >
            <Image
              src={shot}
              alt={`${gameName} screenshot ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
                <Maximize2 className="w-4 h-4 text-[#00ff88]" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] text-gray-300 font-mono">
              {idx + 1} / {screenshots.length}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot lightbox"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-200"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white text-sm font-semibold truncate max-w-[60vw]">
              <span>{gameName}</span>
              <span className="text-gray-400 text-xs ml-3 font-normal">
                {activeIndex + 1} of {screenshots.length}
              </span>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close lightbox"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Screenshot Container */}
          <div className="relative w-full h-[75vh] max-w-6xl px-4 sm:px-16 flex items-center justify-center">
            <div className="relative w-full h-full max-h-[85vh]">
              <Image
                src={screenshots[activeIndex]}
                alt={`${gameName} screenshot ${activeIndex + 1}`}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              aria-label="Previous screenshot"
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/60 hover:bg-[#00ff88] text-white hover:text-black border border-white/10 hover:border-transparent transition-all shadow-xl backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              aria-label="Next screenshot"
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/60 hover:bg-[#00ff88] text-white hover:text-black border border-white/10 hover:border-transparent transition-all shadow-xl backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 overflow-x-auto px-4 py-2">
            {screenshots.map((shot, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex(idx)
                }}
                className={`relative w-16 h-10 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activeIndex
                    ? 'border-[#00ff88] scale-105'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
                aria-label={`Jump to screenshot ${idx + 1}`}
              >
                <Image src={shot} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
