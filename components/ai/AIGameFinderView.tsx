'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Search,
  Check,
  Scale,
  Heart,
  Sliders,
  Send,
  Trophy,
  Star,
  ExternalLink,
  HelpCircle,
  Gamepad2,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { GameImage } from '@/components/ui/GameImage'
import { AIMatchCriteria, AIMatchResult } from '@/lib/provider'
import { useComparison } from '@/components/comparison/ComparisonContext'
import { FavoriteButton } from '@/components/game/FavoriteButton'

interface AIGameFinderViewProps {
  initialResults: AIMatchResult[]
}

const POPULAR_PROMPTS = [
  'Find me a game like Skyrim but with modern graphics and co-op',
  'I want a relaxing space exploration game',
  'Best competitive shooter for casual players',
  'Story-rich game under 20 hours',
  'Challenging open-world RPG with deep combat',
  'Free multiplayer game to play with friends this weekend',
]

const QUICK_PLATFORMS = ['Any', 'PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile']
const QUICK_GENRES = [
  'Any',
  'RPG',
  'Action',
  'Open World',
  'Shooter',
  'Horror',
  'Strategy',
  'Indie',
  'Racing',
  'Sandbox',
]
const QUICK_MODES = ['Any', 'Single Player', 'Multiplayer', 'Co-op', 'Competitive']
const QUICK_MOODS = [
  'Any',
  'Story-focused',
  'Exploration',
  'Action-packed',
  'Challenging',
  'Relaxing',
  'Casual',
]
const QUICK_PRICES = ['Any', 'Free', 'Paid']

export function AIGameFinderView({ initialResults }: AIGameFinderViewProps) {
  const [mode, setMode] = useState<'quick' | 'prompt'>('prompt')
  const [naturalQuery, setNaturalQuery] = useState('')
  const [platform, setPlatform] = useState('Any')
  const [genre, setGenre] = useState('Any')
  const [gameMode, setGameMode] = useState('Any')
  const [mood, setMood] = useState('Any')
  const [price, setPrice] = useState('Any')

  // Refinement filter flags
  const [refinements, setRefinements] = useState<{
    coOpOnly: boolean
    indieOnly: boolean
    highScoreOnly: boolean
    controllerOnly: boolean
    pcOnly: boolean
  }>({
    coOpOnly: false,
    indieOnly: false,
    highScoreOnly: false,
    controllerOnly: false,
    pcOnly: false,
  })

  const [results, setResults] = useState<AIMatchResult[]>(initialResults)
  const [isPending, startTransition] = useTransition()
  const { isSelected, toggleGame, selectedSlugs } = useComparison()

  // Execute matching algorithm via client-side fetch or local provider action
  const handleSearch = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt !== undefined ? overridePrompt : naturalQuery

    const criteria: AIMatchCriteria = {
      naturalQuery: mode === 'prompt' || overridePrompt !== undefined ? promptToUse : '',
      platform: platform !== 'Any' ? platform : undefined,
      genre: genre !== 'Any' ? genre : undefined,
      gameMode: gameMode !== 'Any' ? gameMode : undefined,
      experience: mood !== 'Any' ? mood : undefined,
      price: price !== 'Any' ? price : undefined,
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/ai-finder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(criteria),
        })
        if (res.ok) {
          const data = await res.json()
          setResults(data.results || [])
        }
      } catch (err) {
        console.error('Failed to match games:', err)
      }
    })
  }

  // Apply quick refinement filters
  const displayedResults = results.filter((res) => {
    const g = res.game
    if (refinements.coOpOnly && !g.coOp) return false
    if (refinements.indieOnly && !g.genres.includes('Indie') && !g.tags.includes('Indie')) {
      return false
    }
    if (refinements.highScoreOnly && g.gameRankScore < 90) return false
    if (refinements.controllerOnly && !g.controllerSupport) return false
    if (refinements.pcOnly && !g.platforms.some((p) => p.includes('PC'))) return false
    return true
  })

  return (
    <div className="space-y-10">
      
      {/* 1. INTERACTIVE INPUT PANEL */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        
        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('prompt')}
              className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                mode === 'prompt'
                  ? 'bg-[#00ff88] text-black shadow-lg shadow-[#00ff88]/20'
                  : 'bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Natural Language Mode</span>
            </button>
            <button
              onClick={() => setMode('quick')}
              className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                mode === 'quick'
                  ? 'bg-[#00ff88] text-black shadow-lg shadow-[#00ff88]/20'
                  : 'bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Quick Mode (Pick Criteria)</span>
            </button>
          </div>
          <span className="text-[11px] text-gray-500 hidden md:inline">
            Zero-Hallucination Verified Match Engine
          </span>
        </div>

        {/* MODE 1: NATURAL LANGUAGE INPUT */}
        {mode === 'prompt' ? (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                placeholder="Describe your ideal game in plain English... e.g. 'I want a relaxing space exploration game with great music' or 'Find me a game like Skyrim but with modern graphics and co-op'"
                rows={3}
                className="w-full bg-[#141416] border border-white/15 rounded-2xl p-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors resize-none shadow-inner"
              />
              <button
                onClick={() => handleSearch()}
                disabled={isPending}
                className="absolute right-3 bottom-3 btn-primary text-xs sm:text-sm font-bold px-5 py-2 flex items-center gap-1.5"
              >
                {isPending ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <span>Find Games</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Popular Example Prompts */}
            <div className="space-y-2">
              <span className="text-xs text-gray-400 font-semibold">Try these prompts:</span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setNaturalQuery(p)
                      handleSearch(p)
                    }}
                    className="text-[11px] bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors text-left"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MODE 2: QUICK CRITERIA SELECTORS */
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Platform */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-[#141416] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00ff88]"
                >
                  {QUICK_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Preferred Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-[#141416] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00ff88]"
                >
                  {QUICK_GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Play Style */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Play Style</label>
                <select
                  value={gameMode}
                  onChange={(e) => setGameMode(e.target.value)}
                  className="w-full bg-[#141416] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00ff88]"
                >
                  {QUICK_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience / Mood */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Experience / Mood</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-[#141416] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00ff88]"
                >
                  {QUICK_MOODS.map((mo) => (
                    <option key={mo} value={mo}>
                      {mo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Price Model</label>
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#141416] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00ff88]"
                >
                  {QUICK_PRICES.map((pr) => (
                    <option key={pr} value={pr}>
                      {pr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSearch()}
                disabled={isPending}
                className="btn-primary text-xs sm:text-sm font-bold px-8 py-2.5 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find Matching Games</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 2. FOLLOW-UP REFINEMENT CHIPS */}
      <div className="flex flex-wrap items-center gap-2.5 p-4 bg-[#141416] rounded-2xl border border-white/10">
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-2">
          <Zap className="w-3.5 h-3.5 text-[#00ff88]" /> Refine Results:
        </span>

        <button
          onClick={() =>
            setRefinements((prev) => ({ ...prev, coOpOnly: !prev.coOpOnly }))
          }
          className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
            refinements.coOpOnly
              ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] font-bold'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
          }`}
        >
          {refinements.coOpOnly ? '✓ Co-Op Required' : '+ Make it co-op'}
        </button>

        <button
          onClick={() =>
            setRefinements((prev) => ({ ...prev, indieOnly: !prev.indieOnly }))
          }
          className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
            refinements.indieOnly
              ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] font-bold'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
          }`}
        >
          {refinements.indieOnly ? '✓ Indie Only' : '+ Make it indie'}
        </button>

        <button
          onClick={() =>
            setRefinements((prev) => ({ ...prev, highScoreOnly: !prev.highScoreOnly }))
          }
          className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
            refinements.highScoreOnly
              ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] font-bold'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
          }`}
        >
          {refinements.highScoreOnly ? '✓ 90+ GameRank' : '+ Show only 90+ GameRank'}
        </button>

        <button
          onClick={() =>
            setRefinements((prev) => ({ ...prev, controllerOnly: !prev.controllerOnly }))
          }
          className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
            refinements.controllerOnly
              ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] font-bold'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
          }`}
        >
          {refinements.controllerOnly ? '✓ Full Controller' : '+ Must support controller'}
        </button>

        <button
          onClick={() =>
            setRefinements((prev) => ({ ...prev, pcOnly: !prev.pcOnly }))
          }
          className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
            refinements.pcOnly
              ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] font-bold'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
          }`}
        >
          {refinements.pcOnly ? '✓ PC Only' : '+ PC only'}
        </button>

        {(refinements.coOpOnly ||
          refinements.indieOnly ||
          refinements.highScoreOnly ||
          refinements.controllerOnly ||
          refinements.pcOnly) && (
          <button
            onClick={() =>
              setRefinements({
                coOpOnly: false,
                indieOnly: false,
                highScoreOnly: false,
                controllerOnly: false,
                pcOnly: false,
              })
            }
            className="text-xs text-red-400 hover:underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 3. RANKED MATCH RESULTS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#00ff88]" />
            Ranked Recommendations ({displayedResults.length})
          </h2>
          <span className="text-xs text-gray-400">
            Ranked by multi-factor compatibility score
          </span>
        </div>

        {displayedResults.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border border-white/10">
            <Gamepad2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No exact matches found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              Try adjusting your query or resetting refinement chips to broaden the criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {displayedResults.map((result, idx) => {
              const game = result.game
              const isCompared = isSelected(game.slug)

              return (
                <div
                  key={game.id}
                  className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-[#00ff88]/40 transition-all duration-300 flex flex-col md:flex-row gap-6 group"
                >
                  {/* Dominant 3:4 Game Poster */}
                  <div className="w-36 sm:w-44 shrink-0 mx-auto md:mx-0">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15">
                      <GameImage
                        src={game.coverImage}
                        alt={game.name}
                        aspectRatio="poster"
                        className="rounded-2xl"
                      />
                      {/* Rank tag */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-xs font-mono font-bold text-[#00ff88]">
                        #{idx + 1}
                      </div>
                    </div>
                  </div>

                  {/* Information & Match Breakdown */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Top Bar: Title & Match Score Badge */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400 font-semibold">
                              {game.developer}
                            </span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-400">
                              {new Date(game.releaseDate).getFullYear()}
                            </span>
                          </div>
                          <Link href={`/games/${game.slug}`}>
                            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#00ff88] transition-colors">
                              {game.name}
                            </h3>
                          </Link>
                        </div>

                        {/* Match Score Gauge */}
                        <div className="flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/30 px-3.5 py-1.5 rounded-2xl">
                          <div className="text-right">
                            <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                              Match Score
                            </div>
                            <div className="text-lg font-black text-[#00ff88]">
                              {result.matchScore}%
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Genres & Platforms */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {game.genres.slice(0, 3).map((g) => (
                          <span
                            key={g}
                            className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300"
                          >
                            {g}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          {game.platforms.slice(0, 3).join(' • ')}
                        </span>
                      </div>

                      {/* "Why It Matches" Section (Bullet points, zero hallucinations) */}
                      <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <div className="text-xs font-black uppercase tracking-wider text-[#00ff88] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" />
                          <span>Why it matches your criteria:</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-gray-300">
                          {result.reasons.map((reason, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2">
                              <span className="text-[#00ff88] mt-0.5">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Action Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>
                          GameRank: <strong className="text-white">{game.gameRankScore}</strong>
                        </span>
                        <span>
                          Metacritic: <strong className="text-white">{game.criticScore || 'N/A'}</strong>
                        </span>
                        <span>
                          Community: <strong className="text-yellow-400">{game.playerScore.toFixed(1)}/10</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Compare toggle */}
                        <button
                          onClick={() => toggleGame(game.slug)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isCompared
                              ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>{isCompared ? 'Compared' : 'Compare'}</span>
                        </button>

                        {/* Favorite button */}
                        <FavoriteButton slug={game.slug} gameName={game.name} />

                        {/* View game button */}
                        <Link
                          href={`/games/${game.slug}`}
                          className="btn-primary text-xs font-bold px-4 py-2 flex items-center gap-1.5"
                        >
                          <span>View Game</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
