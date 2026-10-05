import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  Star,
  Calendar,
  Globe,
  Monitor,
  Trophy,
  ArrowLeft,
  Users,
  Play,
  Share2,
} from 'lucide-react'
import { GameImage } from '@/components/ui/GameImage'
import { GameCard } from '@/components/ui/GameCard'
import { GameDataProvider } from '@/lib/provider'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const game = await GameDataProvider.getGameBySlug(params.slug)
  if (!game) return { title: 'Game Not Found | GameRank' }

  return {
    title: `${game.name} - Rankings, Reviews & Platforms | GameRank`,
    description: game.description.slice(0, 160),
    openGraph: {
      title: `${game.name} | GameRank`,
      description: game.description.slice(0, 160),
      images: [{ url: game.coverImage }],
    },
  }
}

export default async function GameDetailPage({ params }: PageProps) {
  const game = await GameDataProvider.getGameBySlug(params.slug)
  if (!game) {
    notFound()
  }

  // Get similar games (matching genres)
  const allGames = await GameDataProvider.getAllGames()
  const similarGames = allGames
    .filter((g) => g.id !== game.id && g.genres.some((genre) => game.genres.includes(genre)))
    .slice(0, 4)

  return (
    <div className="min-h-screen pb-24">
      {/* 1. Cinematic Hero Section with Wallpaper Backdrop */}
      <div className="relative min-h-[550px] w-full flex items-end overflow-hidden">
        {/* Background Wallpaper */}
        <div className="absolute inset-0 z-0">
          <Image
            src={game.backgroundImage}
            alt={game.name}
            fill
            priority
            className="object-cover object-top opacity-35 filter blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
        </div>

        {/* Hero Overlay Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full pt-10">
          <Link
            href="/rankings/all-time"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00ff88] mb-8 text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Rankings
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            {/* DOMINANT GAME POSTER (3:4 ratio) */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="glass-card overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-[#141416] p-1.5 max-w-[280px] mx-auto md:mx-0">
                <GameImage
                  src={game.coverImage}
                  alt={game.name}
                  aspectRatio="poster"
                  priority
                  className="rounded-xl w-full h-full shadow-lg"
                />
              </div>
            </div>

            {/* Game Overview Info */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div className="flex flex-wrap gap-2">
                {game.genres.map((g) => (
                  <span
                    key={g}
                    className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-gray-200 border border-white/10 backdrop-blur-md"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                {game.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 pt-1">
                <div>
                  <span className="text-gray-500 block text-xs">Developer</span>
                  <span className="font-semibold text-white">{game.developer}</span>
                </div>
                <div className="h-6 w-px bg-white/15" />
                <div>
                  <span className="text-gray-500 block text-xs">Publisher</span>
                  <span className="font-semibold text-white">{game.publisher}</span>
                </div>
                <div className="h-6 w-px bg-white/15" />
                <div>
                  <span className="text-gray-500 block text-xs">Release Date</span>
                  <span className="font-semibold text-white">{game.releaseDate}</span>
                </div>
              </div>

              {/* Score Badges Bar */}
              <div className="glass-card p-4 rounded-xl flex flex-wrap items-center gap-6 sm:gap-10 border border-white/15 bg-white/5 backdrop-blur-md max-w-xl">
                <div>
                  <div className="text-[10px] text-[#00ff88] uppercase font-black tracking-widest">
                    GameRank Score
                  </div>
                  <div className="text-3xl font-black text-[#00ff88]">
                    {game.gameRankScore}
                    <span className="text-xs text-gray-400 font-normal">/100</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/15" />

                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Critic Score
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {game.criticScore > 0 ? `${game.criticScore}/100` : 'N/A'}
                  </div>
                </div>

                <div className="h-8 w-px bg-white/15" />

                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Community Rating
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {game.playerScore.toFixed(1)}
                    <span className="text-xs text-gray-400 font-normal">/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Layout (Specs, About, Screenshots, Similar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Main Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Description */}
            <section className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">About the Game</h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {game.description}
              </p>

              {/* Tags Cloud */}
              {game.tags && game.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Game Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Screenshots Gallery */}
            {game.screenshots && game.screenshots.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-white">Official Screenshots</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {game.screenshots.map((shot, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-xl overflow-hidden glass-card border border-white/10"
                    >
                      <Image
                        src={shot}
                        alt={`${game.name} Screenshot ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Video Trailer if available */}
            {game.trailer && (
              <section className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-[#00ff88]" /> Official Trailer & Video
                </h2>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
                  <a
                    href={game.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-black" /> Watch on Official Channel
                  </a>
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Platforms & Specs Card */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                Supported Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.platforms.map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-200"
                  >
                    {p}
                  </span>
                ))}
              </div>

              {/* Game Modes */}
              <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Single Player</span>
                  <span className={game.singlePlayer ? 'text-[#00ff88]' : 'text-gray-500'}>
                    {game.singlePlayer ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Multiplayer</span>
                  <span className={game.multiplayer ? 'text-[#00ff88]' : 'text-gray-500'}>
                    {game.multiplayer ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Co-Op Mode</span>
                  <span className={game.coOp ? 'text-[#00ff88]' : 'text-gray-500'}>
                    {game.coOp ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Cross-Play</span>
                  <span className={game.crossPlay ? 'text-[#00ff88]' : 'text-gray-500'}>
                    {game.crossPlay ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Free to Play</span>
                  <span className={game.freeToPlay ? 'text-[#00d4ff]' : 'text-gray-300'}>
                    {game.freeToPlay ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* External Link */}
              {game.officialWebsite && (
                <div className="pt-4 border-t border-white/10">
                  <a
                    href={game.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00ff88] hover:underline flex items-center gap-1.5"
                  >
                    <Globe className="w-4 h-4" /> Official Website
                  </a>
                </div>
              )}
            </div>

            {/* Similar Games (With Posters!) */}
            {similarGames.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">More Games Like This</h3>
                <div className="grid grid-cols-2 gap-3">
                  {similarGames.map((sim) => (
                    <GameCard key={sim.id} game={sim} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
