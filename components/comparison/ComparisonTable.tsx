'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Trophy,
  Star,
  Scale,
  Check,
  X,
  Plus,
  Share2,
  Trash2,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { GameImage } from '@/components/ui/GameImage'
import { GameRecord } from '@/types/database'
import { useComparison } from './ComparisonContext'

interface ComparisonTableProps {
  initialGames: GameRecord[]
  availableGames: GameRecord[]
}

export function ComparisonTable({ initialGames, availableGames }: ComparisonTableProps) {
  const { selectedSlugs, addGame, removeGame, clearComparison } = useComparison()
  const [copied, setCopied] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  // Use initialGames passed from server/URL or fall back to client state
  const games = initialGames

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const slugs = games.map((g) => g.slug).join(',')
      const url = `${window.location.origin}/compare?games=${slugs}`
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Find max values for numeric comparison highlights
  const maxGameRank = Math.max(...games.map((g) => g.gameRankScore), 0)
  const maxCritic = Math.max(...games.map((g) => g.criticScore), 0)
  const maxPlayer = Math.max(...games.map((g) => g.playerScore), 0)
  const maxPopularity = Math.max(...games.map((g) => g.popularity), 0)

  // Generate factual, hallucination-free "Which one should you play?" summary
  const generateComparisonVerdict = () => {
    if (games.length < 2) return null

    const verdicts = games.map((g) => {
      const strengths: string[] = []
      if (g.gameRankScore === maxGameRank) strengths.push(`top GameRank score (${g.gameRankScore}/100)`)
      if (g.criticScore === maxCritic && g.criticScore > 0) strengths.push(`standout critic score (${g.criticScore})`)
      if (g.playerScore === maxPlayer) strengths.push(`highest player sentiment (${g.playerScore.toFixed(1)}/10)`)
      if (g.freeToPlay) strengths.push('100% free-to-play')
      if (g.crossPlay) strengths.push('full cross-play support')
      if (g.openWorld) strengths.push('expansive open world exploration')
      if (g.coOp) strengths.push('dedicated cooperative gameplay')

      const primaryGenre = g.genres[0] || 'Gaming'
      const keySummary = strengths.length > 0 ? strengths.slice(0, 2).join(' and ') : `solid ${primaryGenre} gameplay`

      return {
        name: g.name,
        genre: primaryGenre,
        verdict: `Choose **${g.name}** if you want ${keySummary} with ${g.platforms.slice(0, 2).join('/')} availability.`,
      }
    })

    return verdicts
  }

  const verdicts = generateComparisonVerdict()

  // Games that can still be added
  const unselectedGames = availableGames.filter(
    (g) => !games.some((selected) => selected.slug.toLowerCase() === g.slug.toLowerCase())
  )

  return (
    <div className="space-y-10">
      
      {/* Top Header Bar & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-card rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00ff88]/15 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Comparing {games.length} {games.length === 1 ? 'Game' : 'Games'}
              <span className="text-xs text-gray-400 font-normal">({games.length}/4 Maximum)</span>
            </h2>
            <p className="text-xs text-gray-400">
              Side-by-side spec comparison based on official metadata
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Add Game Picker Button */}
          {games.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setPickerOpen(!pickerOpen)}
                className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#00ff88]" />
                <span>Add Game</span>
              </button>

              {/* Game Picker Dropdown */}
              {pickerOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#18181c] border border-white/15 rounded-xl shadow-2xl z-50 p-2 max-h-80 overflow-y-auto">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 mb-1">
                    Select a game to compare
                  </div>
                  {unselectedGames.slice(0, 15).map((ug) => (
                    <button
                      key={ug.slug}
                      onClick={() => {
                        addGame(ug.slug)
                        setPickerOpen(false)
                        const slugs = [...games.map((g) => g.slug), ug.slug]
                        window.location.href = `/compare?games=${slugs.join(',')}`
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-gray-200 hover:text-white hover:bg-white/10 flex items-center justify-between transition-colors"
                    >
                      <span className="font-semibold truncate">{ug.name}</span>
                      <span className="text-[10px] text-[#00ff88] font-bold shrink-0 ml-2">
                        {ug.gameRankScore} pts
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3.5"
            title="Share this comparison URL"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share URL'}</span>
          </button>

          {/* Clear Comparison */}
          {games.length > 0 && (
            <button
              onClick={() => {
                clearComparison()
                window.location.href = '/compare'
              }}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors text-xs"
              title="Clear all games"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Side-by-Side Comparison Table */}
      {games.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00ff88] mx-auto text-2xl">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No games selected for comparison</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Choose 2 to 4 games to compare their GameRank scores, platforms, specs, and gameplay characteristics side-by-side.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/compare?games=minecraft,terraria"
              className="btn-secondary text-xs"
            >
              Compare Minecraft vs Terraria
            </Link>
            <Link
              href="/compare?games=elden-ring,baldurs-gate-3"
              className="btn-secondary text-xs"
            >
              Compare Elden Ring vs Baldur&apos;s Gate 3
            </Link>
            <Link
              href="/compare?games=grand-theft-auto-v,red-dead-redemption-2"
              className="btn-secondary text-xs"
            >
              Compare GTA V vs Red Dead 2
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 glass-card">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <tbody>
              
              {/* Row 1: Posters and Titles */}
              <tr className="border-b border-white/10 bg-black/30">
                <td className="p-4 w-48 text-xs font-bold text-gray-400 uppercase tracking-wider align-top">
                  Game
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4 align-top w-64">
                    <div className="space-y-3">
                      {/* 3:4 Poster */}
                      <div className="relative aspect-[3/4] w-40 rounded-xl overflow-hidden shadow-xl border border-white/15 mx-auto sm:mx-0">
                        <GameImage src={g.coverImage} alt={g.name} aspectRatio="poster" />
                        <button
                          onClick={() => {
                            removeGame(g.slug)
                            const remaining = games.filter((item) => item.slug !== g.slug).map((item) => item.slug)
                            window.location.href = `/compare?games=${remaining.join(',')}`
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-red-500 text-white transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <Link
                          href={`/games/${g.slug}`}
                          className="font-black text-white hover:text-[#00ff88] transition-colors text-base line-clamp-1"
                        >
                          {g.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {g.developer}
                        </p>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 2: GameRank Score */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  GameRank Score
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-black ${
                          g.gameRankScore === maxGameRank ? 'text-[#00ff88]' : 'text-white'
                        }`}
                      >
                        {g.gameRankScore}
                        <span className="text-xs text-gray-500 font-normal">/100</span>
                      </span>
                      {g.gameRankScore === maxGameRank && games.length > 1 && (
                        <span className="text-[10px] font-bold uppercase bg-[#00ff88]/20 text-[#00ff88] px-2 py-0.5 rounded border border-[#00ff88]/30">
                          Highest
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 3: Critic Score */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Critic Score (Metacritic)
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4">
                    <span
                      className={`text-sm font-bold ${
                        g.criticScore === maxCritic && g.criticScore > 0 ? 'text-green-400 font-black' : 'text-gray-300'
                      }`}
                    >
                      {g.criticScore > 0 ? `${g.criticScore} / 100` : 'N/A'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: Community Player Score */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Player Score
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4">
                    <span
                      className={`text-sm font-bold flex items-center gap-1 ${
                        g.playerScore === maxPlayer ? 'text-yellow-400 font-black' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {g.playerScore.toFixed(1)} / 10
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 5: Popularity Score */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Popularity Index
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4">
                    <span className="text-sm font-semibold text-gray-200">
                      {g.popularity} / 100
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 6: Release Date */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Release Date
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4 text-xs text-gray-300 font-medium">
                    {g.releaseDate}
                    {g.releaseStatus && g.releaseStatus !== 'Released' && (
                      <span className="ml-2 text-[10px] uppercase font-bold text-[#00d4ff] bg-[#00d4ff]/10 px-2 py-0.5 rounded">
                        {g.releaseStatus}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 7: Genres */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Genres
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {g.genres.map((genre) => (
                        <span key={genre} className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 8: Supported Platforms */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Platforms
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {g.platforms.map((plat) => (
                        <span key={plat} className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                          {plat}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 9: Single-Player */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Single Player
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4 text-xs font-semibold">
                    {g.singlePlayer ? (
                      <span className="text-[#00ff88] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 10: Multiplayer */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Multiplayer
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4 text-xs font-semibold">
                    {g.multiplayer ? (
                      <span className="text-[#00ff88] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 11: Co-Op */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Co-op Mode
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4 text-xs font-semibold">
                    {g.coOp ? (
                      <span className="text-[#00ff88] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 12: Crossplay */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Crossplay
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4 text-xs font-semibold">
                    {g.crossPlay ? (
                      <span className="text-[#00ff88] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 13: Free-to-Play */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Pricing
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4 text-xs font-bold">
                    {g.freeToPlay ? (
                      <span className="text-[#00d4ff]">Free to Play</span>
                    ) : (
                      <span className="text-gray-300">Paid Title</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 14: Open World */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Open World
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4 text-xs font-semibold">
                    {g.openWorld ? (
                      <span className="text-[#00ff88] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 15: Estimated Playtime */}
              <tr className="border-b border-white/10 hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Estimated Playtime
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4 text-xs text-gray-300 font-medium">
                    {g.playtimeHours ? `~${g.playtimeHours} hours` : 'Information unavailable'}
                  </td>
                ))}
              </tr>

              {/* Row 16: PC System Requirements */}
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider align-top">
                  PC System Requirements
                </td>
                {games.map((g) => (
                  <td key={g.slug} className="p-4 text-xs text-gray-300 align-top">
                    {g.systemRequirements?.minimum ? (
                      <div className="space-y-1.5 text-[11px] leading-relaxed">
                        <div className="font-bold text-white uppercase text-[10px] text-gray-400">Minimum:</div>
                        <div>CPU: {g.systemRequirements.minimum.cpu || 'N/A'}</div>
                        <div>GPU: {g.systemRequirements.minimum.gpu || 'N/A'}</div>
                        <div>RAM: {g.systemRequirements.minimum.ram || 'N/A'}</div>
                        <div>Storage: {g.systemRequirements.minimum.storage || 'N/A'}</div>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">System requirements unavailable.</span>
                    )}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}

      {/* "Which one should you play?" Section */}
      {verdicts && verdicts.length > 0 && (
        <section className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-[#00ff88]">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-lg font-black text-white">Which one should you play?</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Based on data from verified critic ratings, community engagement, and available gameplay features:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {verdicts.map((v, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5"
              >
                <div className="text-xs font-black text-white uppercase tracking-wider text-[#00ff88]">
                  {v.name}
                </div>
                <div
                  className="text-xs text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: v.verdict.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
