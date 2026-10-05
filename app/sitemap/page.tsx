import { Metadata } from 'next'
import Link from 'next/link'
import {
  Map,
  Gamepad2,
  Trophy,
  Sparkles,
  Scale,
  Calendar,
  Search,
  Info,
  Layers,
  ArrowRight,
  Monitor,
  Flame,
  FileCode,
  CheckCircle,
} from 'lucide-react'
import { SEED_GAMES } from '@/lib/database'
import { RANKING_CATEGORIES, PLATFORM_DISPLAY, GENRE_DISPLAY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Sitemap - Complete Directory of Games, Platforms & Rankings | GameRank',
  description:
    'Explore the complete directory of GameRank pages, platform rankings, genre hubs, comparison tools, release calendars, and individual game reviews.',
  openGraph: {
    title: 'GameRank Sitemap - Worldwide Gaming Ranking Platform',
    description:
      'Complete navigation index and sitemap for all games, platform categories, genre lists, and gaming comparison tools.',
  },
}

export default function SitemapPage() {
  const sortedGames = [...SEED_GAMES].sort((a, b) => a.name.localeCompare(b.name))

  const corePages = [
    {
      title: 'Home',
      description: 'Main landing page featuring top games, trending releases, and curated carousels.',
      href: '/',
      icon: Gamepad2,
      badge: 'Main',
    },
    {
      title: 'Rankings Hub',
      description: 'Comprehensive leaderboard covering all-time best games, platform ratings, and genres.',
      href: '/rankings',
      icon: Trophy,
      badge: 'Core',
    },
    {
      title: 'AI Game Finder',
      description: 'Smart discovery engine delivering tailored game recommendations with natural language filtering.',
      href: '/ai-game-finder',
      icon: Sparkles,
      badge: 'AI Powered',
    },
    {
      title: 'Game Comparison Tool',
      description: 'Side-by-side comparison matrix for technical specs, modes, ratings, and gameplay hours.',
      href: '/compare',
      icon: Scale,
      badge: 'Tool',
    },
    {
      title: 'Release Radar & Calendar',
      description: 'Upcoming launches, recent releases, countdowns, and historical release tracking.',
      href: '/releases',
      icon: Calendar,
      badge: 'Calendar',
    },
    {
      title: 'Recent Game Releases',
      description: 'Recently published titles across platforms with updated critic and player scores.',
      href: '/releases/recent',
      icon: Flame,
      badge: 'Live',
    },
    {
      title: 'Upcoming Anticipated Games',
      description: 'Track upcoming video games planned for 2026, 2027, and beyond.',
      href: '/releases/upcoming',
      icon: Calendar,
      badge: 'Anticipated',
    },
    {
      title: 'Game Search',
      description: 'Search across 500,000+ titles with instant filtering by genre, platform, and score.',
      href: '/search',
      icon: Search,
      badge: 'Search',
    },
    {
      title: 'About GameRank',
      description: 'Our founder story, mission statement, ranking methodology, and platform architecture.',
      href: '/about',
      icon: Info,
      badge: 'Info',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 pb-24">
      {/* Hero Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-[#111118] via-[#0d0d14] to-[#0a0a0f] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,255,136,0.12),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00ff88] text-xs font-semibold uppercase tracking-wider mb-6">
            <Map className="w-4 h-4" />
            Website Index & Directory
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            GameRank <span className="text-gradient">Sitemap</span>
          </h1>

          <p className="max-w-3xl text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
            Navigate through our entire website architecture. Discover dedicated platform rankings, 
            genre leaderboards, interactive comparison tools, release calendars, and comprehensive game pages.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="text-2xl font-bold text-[#00ff88]">{sortedGames.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Catalog Game Profiles</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="text-2xl font-bold text-[#00d4ff]">{RANKING_CATEGORIES.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Ranking Categories</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="text-2xl font-bold text-emerald-400">{PLATFORM_DISPLAY.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Gaming Platforms</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="text-2xl font-bold text-purple-400">{GENRE_DISPLAY.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Genre Classifications</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* 1. Core Pages & Tools */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#00ff88]/10 text-[#00ff88]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Core Hubs & Discovery Tools</h2>
              <p className="text-sm text-gray-400">Primary navigational routes, exploration engines, and platform tools</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {corePages.map((page) => {
              const Icon = page.icon
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#00ff88]/40 hover:bg-white/[0.04] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-white/5 text-[#00ff88] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                        {page.badge}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-[#00ff88] transition-colors flex items-center gap-1.5">
                      {page.title}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#00ff88]" />
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                      {page.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-gray-500">
                    {page.href}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 2. Platform Rankings */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff]">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Platform Hubs & Leaderboards</h2>
              <p className="text-sm text-gray-400">Curated rankings filtered specifically by console and ecosystem</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PLATFORM_DISPLAY.map((plat) => (
              <Link
                key={plat.slug}
                href={`/rankings/${plat.slug}`}
                className="group p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#00d4ff]/40 hover:bg-white/[0.04] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{plat.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-[#00d4ff] transition-colors">
                      {plat.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-mono">/rankings/{plat.slug}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#00d4ff] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Ranking Categories & Genres */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Genre & Specialty Rankings</h2>
              <p className="text-sm text-gray-400">All thematic lists, curated scoreboards, and genre breakdowns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RANKING_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/rankings/${cat.id}`}
                className="group p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-semibold text-white text-sm group-hover:text-purple-400 transition-colors">
                    {cat.label}
                  </h3>
                  <span className="text-[10px] font-mono text-gray-500">
                    /rankings/{cat.id}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Complete Games Directory */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-[#00ff88]">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Full Game Profiles Index (A-Z)</h2>
                <p className="text-sm text-gray-400">
                  Direct links to all {sortedGames.length} in-depth game review profiles and technical specifications
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortedGames.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="group p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#00ff88]/40 hover:bg-white/[0.04] transition-all flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-medium text-sm text-white group-hover:text-[#00ff88] transition-colors truncate">
                    {game.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                    <span>{game.releaseDate ? game.releaseDate.substring(0, 4) : 'TBA'}</span>
                    <span>•</span>
                    <span className="truncate">{game.genres[0] || 'Game'}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                  <span className="text-[11px] font-semibold text-[#00ff88]">
                    {game.criticScore || Math.round(game.playerScore * 10)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Machine-Readable Sitemaps & Search Engine Endpoints */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-3 rounded-xl bg-white/5 text-[#00d4ff]">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Search Engine & Machine-Readable Feeds</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xl">
                  GameRank automatically exposes automated sitemap and crawler instructions compliant with 
                  Google, Bing, and Open Search protocol standards.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
              >
                <span>XML Sitemap</span>
                <span className="text-[10px] text-emerald-400 font-mono">.xml</span>
              </a>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
              >
                <span>Robots.txt</span>
                <span className="text-[10px] text-[#00d4ff] font-mono">.txt</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
