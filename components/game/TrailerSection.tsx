'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Film } from 'lucide-react'

interface TrailerSectionProps {
  trailerUrl?: string
  thumbnailUrl: string
  gameName: string
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null

  // Check standard youtube.com/watch?v=ID
  const watchMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=1&rel=0`
  }

  return null
}

export function TrailerSection({ trailerUrl, thumbnailUrl, gameName }: TrailerSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Critical requirement: If no trailer is available, hide the section. Do not show an empty player.
  if (!trailerUrl || trailerUrl.trim() === '') {
    return null
  }

  const embedUrl = getYouTubeEmbedUrl(trailerUrl)

  return (
    <section className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-[#00ff88]" />
          Official Gameplay Trailer
        </h2>
        <span className="text-xs text-[#00ff88] uppercase tracking-wider font-bold">
          High Definition
        </span>
      </div>

      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60 border border-white/10 shadow-2xl">
        {!isPlaying ? (
          <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
            <Image
              src={thumbnailUrl}
              alt={`${gameName} trailer preview`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
            {/* Dark gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:opacity-75 transition-opacity" />

            {/* Glowing Play Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <button
                type="button"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#00ff88] text-black flex items-center justify-center shadow-xl shadow-[#00ff88]/30 group-hover:scale-110 group-hover:bg-[#00ff9d] transition-all duration-300"
                aria-label={`Play trailer for ${gameName}`}
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-black translate-x-0.5" />
              </button>
              <span className="text-white text-xs sm:text-sm font-semibold tracking-wide drop-shadow-md">
                Watch Official Trailer
              </span>
            </div>
          </div>
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${gameName} Official Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <video
            src={trailerUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </section>
  )
}
