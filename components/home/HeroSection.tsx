import Image from 'next/image'
import Link from 'next/link'
import { Trophy, Star, Sparkles, Flame, Gamepad2 } from 'lucide-react'
import { GameImage } from '@/components/ui/GameImage'
import { GameRecord } from '@/types/database'

interface HeroProps {
  featuredGames: GameRecord[]
}

export function HeroSection({ featuredGames }: HeroProps) {
  // Use the top game (e.g. Elden Ring or GTA V) for hero background
  const main = featuredGames[0] || {
    name: 'Elden Ring',
    slug: 'elden-ring',
    description: 'A fantasy action-RPG adventure set within a world created by Hidetaka Miyazaki and George R. R. Martin. Journey through the Lands Between to claim the power of the Elden Ring.',
    coverImage: 'https://media.rawg.io/media/games/b29/b2960ad9f49d581d8249646e48a240f7.jpg',
    backgroundImage: 'https://media.rawg.io/media/games/b29/b2960ad9f49d581d8249646e48a240f7.jpg',
    gameRankScore: 98,
    genres: ['Action RPG', 'Open World'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
  }

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden pt-12 pb-20">
      {/* Cinematic Ambient Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={main.backgroundImage}
          alt={main.name}
          fill
          className="object-cover object-top opacity-35 filter blur-[1px] scale-105 transition-transform duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Branding, Title, and Direct Exploration Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#00ff88]/15 border border-[#00ff88]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#00ff88] shadow-lg shadow-[#00ff88]/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE WORLDWIDE GAMING AUTHORITY</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-[0.95]">
              GAMERANK
              <span className="block text-gradient text-3xl sm:text-5xl md:text-6xl mt-2 font-extrabold normal-case">
                Discover the World&apos;s Best Games
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              Explore thousands of games across PC, PlayStation, Xbox, Nintendo Switch, and mobile with verified official cover artwork and transparent algorithmic rankings.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/rankings/all-time"
                className="btn-primary flex items-center gap-2 text-sm sm:text-base px-7 py-3"
              >
                <Trophy className="w-5 h-5" />
                Top 100 Rankings
              </Link>
              <Link
                href="/search"
                className="btn-secondary flex items-center gap-2 text-sm sm:text-base px-7 py-3"
              >
                <Gamepad2 className="w-5 h-5" />
                Explore Games
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
                <span>100% Official Cover Posters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00d4ff]" />
                <span>Real Community & Critic Ratings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6b35]" />
                <span>Cross-Platform Coverage</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Game Showcase Poster Card */}
          <div className="lg:col-span-5 flex justify-center">
            <Link href={`/games/${main.slug}`} className="group relative block w-full max-w-[320px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />
              
              <div className="relative glass-card overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-[#141416]">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <GameImage
                    src={main.coverImage}
                    alt={main.name}
                    aspectRatio="poster"
                    priority
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Spotlight Pill */}
                  <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-black uppercase text-[#00ff88] border border-[#00ff88]/40 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span>#1 GAME WORLDWIDE</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-black text-white border border-white/20 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{main.gameRankScore}</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-black text-white group-hover:text-[#00ff88] transition-colors leading-tight">
                      {main.name}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                      {main.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] uppercase font-bold text-[#00ff88] bg-[#00ff88]/15 px-2 py-0.5 rounded border border-[#00ff88]/30">
                        {main.genres[0]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {main.platforms.slice(0, 3).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
