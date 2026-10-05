import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { Star, Calendar, Globe, Monitor, Users, ExternalLink, Trophy, Gamepad2, ArrowLeft } from 'lucide-react'
import { GameCard } from '@/components/ui/GameCard'
import { calculateGameRankScore, formatDate, getImageUrl } from '@/lib/utils'

interface PageProps {
  params: { slug: string }
}

async function getGameDetails(slug: string) {
  try {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) return null
    const res = await fetch(`https://api.rawg.io/api/games/${slug}?key=${apiKey}`, {
      next: { revalidate: 3600 * 24 }
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function getScreenshots(slug: string) {
  try {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) return []
    const res = await fetch(`https://api.rawg.io/api/games/${slug}/screenshots?key=${apiKey}&page_size=8`, {
      next: { revalidate: 3600 * 24 }
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

async function getSimilarGames(slug: string) {
  try {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) return []
    const res = await fetch(`https://api.rawg.io/api/games/${slug}/game-series?key=${apiKey}&page_size=4`, {
      next: { revalidate: 3600 * 12 }
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const game = await getGameDetails(params.slug)
  if (!game) return { title: 'Game Not Found' }
  return {
    title: `${game.name} - Rankings, Reviews & Platforms`,
    description: game.description_raw?.slice(0, 160) || `Overview, score, and platforms for ${game.name} on GameRank.`,
    openGraph: {
      title: `${game.name} | GameRank`,
      description: game.description_raw?.slice(0, 160),
      images: game.background_image ? [{ url: game.background_image }] : [],
    }
  }
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = params
  const game = await getGameDetails(slug)

  if (!game) {
    notFound()
  }

  const [screenshots, similarGames] = await Promise.all([
    getScreenshots(slug),
    getSimilarGames(slug)
  ])

  const calculatedScore = calculateGameRankScore(game)
  const pcRequirements = game.platforms?.find((p: any) => p.platform?.slug === 'pc')?.requirements

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header with Background */}
      <div className="relative h-[60vh] min-h-[400px] w-full flex items-end">
        <div className="absolute inset-0">
          {game.background_image && (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <Link href="/rankings/all-time" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Rankings
          </Link>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {game.genres?.map((g: any) => (
                  <span key={g.id} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-gray-300 backdrop-blur-sm border border-white/10">
                    {g.name}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white">{game.name}</h1>
              {game.released && (
                <p className="text-gray-400 mt-2 flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" /> Released {formatDate(game.released)}
                </p>
              )}
            </div>

            {/* Scores Pill Card */}
            <div className="glass-card p-4 flex items-center gap-6 shrink-0 border-[#00ff88]/30">
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase font-semibold mb-1">GameRank</div>
                <div className="text-3xl font-black text-[#00ff88]">{calculatedScore.normalizedScore}</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Critic Score</div>
                <div className="text-2xl font-bold text-white">{game.metacritic || 'N/A'}</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Community</div>
                <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {game.rating ? game.rating.toFixed(1) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column (Details, Screenshots, About) */}
          <div className="lg:col-span-2 space-y-10">
            {/* About Section */}
            <section className="glass-card p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4">About the Game</h2>
              <div className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line space-y-4">
                {game.description_raw || 'No description available for this title.'}
              </div>
            </section>

            {/* Screenshots Gallery */}
            {screenshots.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-white">Screenshots</h2>
                <div className="grid grid-cols-2 gap-4">
                  {screenshots.map((s: any) => (
                    <div key={s.id} className="relative aspect-video rounded-xl overflow-hidden glass-card">
                      <Image src={s.image} alt="Screenshot" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PC Requirements if available */}
            {pcRequirements && (pcRequirements.minimum || pcRequirements.recommended) && (
              <section className="glass-card p-6 md:p-8 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-[#00ff88]" /> PC System Requirements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300">
                  {pcRequirements.minimum && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                      <h3 className="font-semibold text-white mb-2 uppercase tracking-wider text-xs">Minimum</h3>
                      <div className="whitespace-pre-line leading-relaxed">{pcRequirements.minimum}</div>
                    </div>
                  )}
                  {pcRequirements.recommended && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                      <h3 className="font-semibold text-white mb-2 uppercase tracking-wider text-xs">Recommended</h3>
                      <div className="whitespace-pre-line leading-relaxed">{pcRequirements.recommended}</div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column (Sidebar details, Platforms, Developer, Similar) */}
          <div className="space-y-6">
            {/* Metadata Card */}
            <div className="glass-card p-6 space-y-4 text-sm">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">Game Specifications</h3>
              
              <div>
                <span className="text-gray-400 block text-xs uppercase mb-1">Platforms</span>
                <div className="flex flex-wrap gap-1.5">
                  {game.platforms?.map((p: any) => (
                    <span key={p.platform?.id} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                      {p.platform?.name}
                    </span>
                  ))}
                </div>
              </div>

              {game.developers && game.developers.length > 0 && (
                <div>
                  <span className="text-gray-400 block text-xs uppercase mb-1">Developer</span>
                  <div className="text-white font-medium">
                    {game.developers.map((d: any) => d.name).join(', ')}
                  </div>
                </div>
              )}

              {game.publishers && game.publishers.length > 0 && (
                <div>
                  <span className="text-gray-400 block text-xs uppercase mb-1">Publisher</span>
                  <div className="text-white font-medium">
                    {game.publishers.map((p: any) => p.name).join(', ')}
                  </div>
                </div>
              )}

              {game.website && (
                <div>
                  <span className="text-gray-400 block text-xs uppercase mb-1">Official Website</span>
                  <a href={game.website} target="_blank" rel="noopener noreferrer" className="text-[#00ff88] hover:underline flex items-center gap-1 text-xs break-all">
                    <Globe className="w-3.5 h-3.5 shrink-0" /> {game.website}
                  </a>
                </div>
              )}

              <div>
                <span className="text-gray-400 block text-xs uppercase mb-1">Data Source</span>
                <span className="text-xs text-gray-400">
                  Verified via <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-[#00ff88] hover:underline">RAWG Database</a>
                </span>
              </div>
            </div>

            {/* Similar Games */}
            {similarGames.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">More in the Series</h3>
                <div className="space-y-3">
                  {similarGames.map((sim: any) => (
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
