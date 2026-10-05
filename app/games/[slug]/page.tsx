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
  Sparkles,
  Flame,
  Check,
  X,
  ExternalLink,
  ShieldAlert,
  Cpu,
  Layers,
} from 'lucide-react'
import { GameImage } from '@/components/ui/GameImage'
import { GameCard } from '@/components/ui/GameCard'
import { GameDataProvider } from '@/lib/provider'
import { FavoriteButton } from '@/components/game/FavoriteButton'
import { DetailCompareButton } from '@/components/game/DetailCompareButton'
import { ScreenshotGallery } from '@/components/game/ScreenshotGallery'
import { TrailerSection } from '@/components/game/TrailerSection'

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

  // Fetch verified similar games and complementary "more like this" games
  const [similarGames, moreLikeThis] = await Promise.all([
    GameDataProvider.getSimilarGames(game.slug, 4),
    GameDataProvider.getMoreLikeThis(game.slug, 4),
  ])

  // Map known platforms to clean badge presentation
  const platformCategories = [
    { name: 'PC', match: (p: string) => p.includes('PC') || p.includes('Windows'), icon: '🖥️' },
    { name: 'PlayStation', match: (p: string) => p.includes('PlayStation') || p.includes('PS5') || p.includes('PS4'), icon: '🎮' },
    { name: 'Xbox', match: (p: string) => p.includes('Xbox'), icon: '🟩' },
    { name: 'Nintendo', match: (p: string) => p.includes('Nintendo') || p.includes('Switch'), icon: '🕹️' },
    { name: 'Android', match: (p: string) => p.includes('Android'), icon: '📱' },
    { name: 'iOS', match: (p: string) => p.includes('iOS') || p.includes('iPhone'), icon: '🍎' },
  ]

  const activePlatforms = platformCategories.filter((cat) =>
    game.platforms.some((plat) => cat.match(plat))
  )

  const isTrending = game.trendingScore >= 75 || game.popularity >= 85

  return (
    <div className="min-h-screen pb-24">
      {/* 1. CINEMATIC HERO SECTION */}
      <div className="relative min-h-[600px] w-full flex items-end overflow-hidden">
        {/* Full-width Game Background Wallpaper */}
        <div className="absolute inset-0 z-0">
          <Image
            src={game.backgroundImage}
            alt={game.name}
            fill
            priority
            quality={90}
            className="object-cover object-top opacity-30 filter blur-[1px] scale-105"
          />
          {/* Dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/60 to-[#0f0f0f]/30" />
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
            {/* DOMINANT GAME POSTER (3:4 portrait) */}
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
              <div className="flex flex-wrap items-center gap-2">
                {isTrending && (
                  <span className="flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
                    <Flame className="w-3.5 h-3.5 fill-orange-400" /> TRENDING NOW
                  </span>
                )}
                {game.genres.map((g) => (
                  <span
                    key={g}
                    className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-gray-200 border border-white/10 backdrop-blur-md"
                  >
                    {g}
                  </span>
                ))}
                {game.ageRating && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                    {game.ageRating}
                  </span>
                )}
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
                {game.playtimeHours && (
                  <>
                    <div className="h-6 w-px bg-white/15" />
                    <div>
                      <span className="text-gray-500 block text-xs">Est. Playtime</span>
                      <span className="font-semibold text-white">{game.playtimeHours} hrs</span>
                    </div>
                  </>
                )}
              </div>

              {/* Score Badges Bar with clear distinction between calculated vs sourced ratings */}
              <div className="glass-card p-4 rounded-xl flex flex-wrap items-center gap-6 sm:gap-8 border border-white/15 bg-white/5 backdrop-blur-md max-w-2xl">
                <div>
                  <div className="text-[10px] text-[#00ff88] uppercase font-black tracking-widest flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> GameRank Score
                  </div>
                  <div className="text-3xl font-black text-[#00ff88]">
                    {game.gameRankScore}
                    <span className="text-xs text-gray-400 font-normal">/100</span>
                  </div>
                  <div className="text-[10px] text-gray-400">Algorithmic Index</div>
                </div>

                <div className="h-8 w-px bg-white/15" />

                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Critic Score
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {game.criticScore > 0 ? `${game.criticScore}/100` : 'N/A'}
                  </div>
                  <div className="text-[10px] text-gray-500">Verified Press</div>
                </div>

                <div className="h-8 w-px bg-white/15" />

                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Player Score
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {game.playerScore.toFixed(1)}
                    <span className="text-xs text-gray-400 font-normal">/10</span>
                  </div>
                  <div className="text-[10px] text-gray-500">Community</div>
                </div>

                <div className="h-8 w-px bg-white/15" />

                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Popularity
                  </div>
                  <div className="text-2xl font-bold text-[#00d4ff]">
                    {game.popularity}%
                  </div>
                  <div className="text-[10px] text-gray-500">Global Playerbase</div>
                </div>
              </div>

              {/* Action Buttons: Add to Favorites + Add to Compare */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <FavoriteButton slug={game.slug} gameName={game.name} />
                <DetailCompareButton slug={game.slug} gameName={game.name} />
                {game.officialWebsite && (
                  <a
                    href={game.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-gray-300 hover:text-white flex items-center gap-2 text-sm font-semibold transition-all duration-300"
                  >
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>Official Site</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500 ml-0.5" />
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* About the Game */}
            <section className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00ff88]" /> About {game.name}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {game.description}
              </p>

              {/* Tags Cloud */}
              {game.tags && game.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Game Tags & Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Screenshots Gallery with Lightbox */}
            {game.screenshots && game.screenshots.length > 0 && (
              <ScreenshotGallery screenshots={game.screenshots} gameName={game.name} />
            )}

            {/* Video Trailer Section (Hidden if no trailer available) */}
            <TrailerSection
              trailerUrl={game.trailer}
              thumbnailUrl={game.screenshots?.[0] || game.backgroundImage}
              gameName={game.name}
            />

            {/* PC System Requirements */}
            <section className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#00ff88]" /> PC System Requirements
                </h2>
                <span className="text-xs text-gray-400">Windows PC Specifications</span>
              </div>

              {game.systemRequirements?.minimum ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Minimum Requirements */}
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="text-xs font-black uppercase tracking-wider text-[#00d4ff] flex items-center gap-1.5">
                      <span>Minimum Requirements</span>
                    </div>
                    <dl className="space-y-2 text-xs">
                      <div>
                        <dt className="text-gray-400">OS:</dt>
                        <dd className="text-white font-medium">{game.systemRequirements.minimum.os}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Processor (CPU):</dt>
                        <dd className="text-white font-medium">{game.systemRequirements.minimum.cpu}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Memory (RAM):</dt>
                        <dd className="text-white font-medium">{game.systemRequirements.minimum.ram}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Graphics (GPU):</dt>
                        <dd className="text-white font-medium">{game.systemRequirements.minimum.gpu}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Storage:</dt>
                        <dd className="text-white font-medium">{game.systemRequirements.minimum.storage}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Recommended Requirements */}
                  {game.systemRequirements.recommended ? (
                    <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="text-xs font-black uppercase tracking-wider text-[#00ff88] flex items-center gap-1.5">
                        <span>Recommended Requirements</span>
                      </div>
                      <dl className="space-y-2 text-xs">
                        <div>
                          <dt className="text-gray-400">OS:</dt>
                          <dd className="text-white font-medium">{game.systemRequirements.recommended.os}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-400">Processor (CPU):</dt>
                          <dd className="text-white font-medium">{game.systemRequirements.recommended.cpu}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-400">Memory (RAM):</dt>
                          <dd className="text-white font-medium">{game.systemRequirements.recommended.ram}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-400">Graphics (GPU):</dt>
                          <dd className="text-white font-medium">{game.systemRequirements.recommended.gpu}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-400">Storage:</dt>
                          <dd className="text-white font-medium">{game.systemRequirements.recommended.storage}</dd>
                        </div>
                      </dl>
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <p className="text-gray-500 text-xs italic">Recommended requirements not specified.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-gray-400 text-sm italic">System requirements unavailable.</p>
                </div>
              )}
            </section>

            {/* Similar Games Section */}
            {similarGames.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#00ff88]" /> Similar Games
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Matched by shared tags, gameplay mechanics, and genres
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similarGames.map((sim) => (
                    <GameCard key={sim.id} game={sim} size="sm" />
                  ))}
                </div>
              </section>
            )}

            {/* More Like This Section (Complementary) */}
            {moreLikeThis.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#00d4ff]" /> More Like This
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Platform favorites sharing similar player experiences and community sentiment
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {moreLikeThis.map((item) => (
                    <GameCard key={item.id} game={item} size="sm" />
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Key Information & Platform Availability */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                Key Information
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Developer</span>
                  <span className="font-semibold text-white text-right">{game.developer}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Publisher</span>
                  <span className="font-semibold text-white text-right">{game.publisher}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Release Date</span>
                  <span className="font-semibold text-white">{game.releaseDate}</span>
                </div>
                {game.ageRating && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Age Rating</span>
                    <span className="font-semibold text-white">{game.ageRating}</span>
                  </div>
                )}
                {game.playtimeHours && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Estimated Playtime</span>
                    <span className="font-semibold text-white">{game.playtimeHours} Hours</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Release Status</span>
                  <span className="font-semibold text-[#00ff88]">{game.releaseStatus || 'Released'}</span>
                </div>
              </div>

              {/* Supported Platforms Cards */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Available Platforms
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {activePlatforms.map((plat) => (
                    <div
                      key={plat.name}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-semibold text-white"
                    >
                      <span className="text-lg">{plat.icon}</span>
                      <span>{plat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Features Badges */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Game Features
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-300">Single Player</span>
                    {game.singlePlayer ? (
                      <span className="text-[#00ff88] flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Supported
                      </span>
                    ) : (
                      <span className="text-gray-600 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-300">Multiplayer</span>
                    {game.multiplayer ? (
                      <span className="text-[#00ff88] flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Supported
                      </span>
                    ) : (
                      <span className="text-gray-600 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-300">Co-Op Mode</span>
                    {game.coOp ? (
                      <span className="text-[#00ff88] flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Supported
                      </span>
                    ) : (
                      <span className="text-gray-600 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-300">Cross-Play</span>
                    {game.crossPlay ? (
                      <span className="text-[#00ff88] flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Supported
                      </span>
                    ) : (
                      <span className="text-gray-600 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-300">Open World</span>
                    {game.openWorld ? (
                      <span className="text-[#00ff88] flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-600 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-300">Controller Support</span>
                    {game.controllerSupport ? (
                      <span className="text-[#00ff88] flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Full
                      </span>
                    ) : (
                      <span className="text-gray-500">Partial/KB</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-300">Free to Play</span>
                    {game.freeToPlay ? (
                      <span className="text-[#00d4ff] flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> 100% Free
                      </span>
                    ) : (
                      <span className="text-gray-400">Paid Title</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Official Links */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Official Links
                </h4>
                {game.officialWebsite && (
                  <a
                    href={game.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs text-gray-300 hover:text-[#00ff88] py-1 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-gray-400" /> Official Website
                    </span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400 py-1">
                  <span>Publisher: {game.publisher}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 py-1">
                  <span>Developer: {game.developer}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
