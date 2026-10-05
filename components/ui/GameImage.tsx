'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Gamepad2 } from 'lucide-react'

interface GameImageProps {
  src: string | null | undefined
  alt: string
  aspectRatio?: 'poster' | 'landscape' | 'square' | 'video'
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  showBadgeFallback?: boolean
}

export function GameImage({
  src,
  alt,
  aspectRatio = 'poster',
  className = '',
  priority = false,
  sizes,
  fill = true,
  showBadgeFallback = true,
}: GameImageProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Map aspect ratio presets
  const ratioClasses = {
    poster: 'aspect-[3/4]',       // Vertical Game Poster / Cover Box-Art
    landscape: 'aspect-[16/9]',   // Landscape Wallpaper / Banner
    video: 'aspect-video',        // 16:9 Video / Screenshot
    square: 'aspect-square',      // 1:1 Icon
  }[aspectRatio]

  const hasValidSrc = Boolean(src && src.trim() !== '')

  if (!hasValidSrc || error) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16161a] to-[#0f0f0f] border border-white/10 flex flex-col items-center justify-center p-4 text-center select-none ${ratioClasses} ${className}`}
      >
        {/* Subtle patterned neon gaming backdrop */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00ff88_1px,transparent_1px)] [background-size:12px_12px]" />
        
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00ff88]">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-200 line-clamp-2 px-1">
            {alt}
          </span>
          {showBadgeFallback && (
            <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
              GameRank Official
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-[#16161a] ${ratioClasses} ${className}`}>
      {/* Loading Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse z-0" />
      )}

      <Image
        src={src!}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes || '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'}
        className={`object-cover transition-all duration-500 ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}
