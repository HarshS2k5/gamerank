'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  List,
  Filter,
  Clock,
  AlertCircle,
  Sparkles,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Hourglass,
  Layers,
} from 'lucide-react'
import { GameImage } from '@/components/ui/GameImage'
import { GameRecord } from '@/types/database'

interface ReleaseCalendarViewProps {
  initialGames: GameRecord[]
  defaultTimeframe?: string
}

const TIMEFRAMES = [
  { id: 'all', label: 'All Releases' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'recent', label: 'Recently Released' },
  { id: 'this-month', label: 'This Month' },
  { id: 'next-month', label: 'Next Month' },
  { id: '2026', label: '2026' },
  { id: '2027', label: '2027' },
]

const PLATFORM_FILTERS = ['All', 'PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile']
const STATUS_FILTERS = ['All', 'Released', 'Coming Soon', 'Announced', 'TBA', 'Delayed']
const TYPE_FILTERS = ['All', 'AAA', 'Indie', 'Free to Play']

export function ReleaseCalendarView({
  initialGames,
  defaultTimeframe = 'all',
}: ReleaseCalendarViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [timeframe, setTimeframe] = useState<string>(defaultTimeframe)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2026, 9, 1)) // October 2026 as reference

  const now = useMemo(() => new Date('2026-10-01'), [])

  // Calculate days difference and countdown text
  const getCountdown = (dateString: string, status?: string) => {
    if (status === 'TBA') return 'TBA'
    if (status === 'Released') return 'Out Now'

    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Released'
    if (diffDays === 0) return 'Releases Today!'
    if (diffDays === 1) return 'Releases Tomorrow!'
    if (diffDays < 30) return `In ${diffDays} days`
    if (diffDays < 365) {
      const months = Math.round(diffDays / 30)
      return `In ${months} ${months === 1 ? 'month' : 'months'}`
    }
    const years = (diffDays / 365).toFixed(1)
    return `In ${years} years`
  }

  // Filter games based on selected controls
  const filteredGames = useMemo(() => {
    return initialGames.filter((game) => {
      // Platform filter
      if (selectedPlatform !== 'All') {
        const platMatch = game.platforms.some((p) =>
          p.toLowerCase().includes(selectedPlatform.toLowerCase())
        )
        if (!platMatch) return false
      }

      // Status filter
      if (selectedStatus !== 'All') {
        const status = game.releaseStatus || 'Released'
        if (status.toLowerCase() !== selectedStatus.toLowerCase()) return false
      }

      // Type filter
      if (selectedType === 'Free to Play' && !game.freeToPlay) return false
      if (selectedType === 'Indie' && !game.genres.includes('Indie') && !game.tags.includes('Indie')) {
        return false
      }
      if (
        selectedType === 'AAA' &&
        (game.genres.includes('Indie') || game.tags.includes('Indie') || game.freeToPlay)
      ) {
        return false
      }

      // Timeframe filter
      const gameDate = new Date(game.releaseDate)
      const isUpcoming =
        game.releaseStatus === 'Coming Soon' ||
        game.releaseStatus === 'Announced' ||
        game.releaseStatus === 'TBA' ||
        game.releaseStatus === 'Delayed' ||
        gameDate > now

      if (timeframe === 'upcoming') {
        return isUpcoming
      }
      if (timeframe === 'recent') {
        return !isUpcoming || game.releaseStatus === 'Released'
      }
      if (timeframe === 'this-month') {
        return (
          gameDate.getFullYear() === now.getFullYear() &&
          gameDate.getMonth() === now.getMonth()
        )
      }
      if (timeframe === 'next-month') {
        const nextMonthYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear()
        const nextMonthVal = (now.getMonth() + 1) % 12
        return (
          gameDate.getFullYear() === nextMonthYear &&
          gameDate.getMonth() === nextMonthVal
        )
      }
      if (timeframe === '2026') {
        return gameDate.getFullYear() === 2026
      }
      if (timeframe === '2027') {
        return gameDate.getFullYear() === 2027
      }

      return true
    })
  }, [initialGames, selectedPlatform, selectedStatus, selectedType, timeframe, now])

  // Group filtered games by Month & Year for List View
  const groupedByMonth = useMemo(() => {
    const groups: { [key: string]: GameRecord[] } = {}

    // Sort games chronologically
    const sorted = [...filteredGames].sort((a, b) => {
      if (a.releaseStatus === 'TBA') return 1
      if (b.releaseStatus === 'TBA') return -1
      return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
    })

    sorted.forEach((game) => {
      let key = 'To Be Announced'
      if (game.releaseStatus !== 'TBA' && game.releaseDate) {
        const d = new Date(game.releaseDate)
        if (!isNaN(d.getTime())) {
          key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
        }
      }

      if (!groups[key]) groups[key] = []
      groups[key].push(game)
    })

    return groups
  }, [filteredGames])

  // Helper for Status Badge styling
  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case 'Delayed':
        return (
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Delayed
          </span>
        )
      case 'Coming Soon':
        return (
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Coming Soon
          </span>
        )
      case 'Announced':
        return (
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Announced
          </span>
        )
      case 'TBA':
        return (
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30 flex items-center gap-1">
            <Hourglass className="w-3 h-3" /> TBA
          </span>
        )
      case 'Released':
      default:
        return (
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Released
          </span>
        )
    }
  }

  // Calendar View Days Matrix
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay() // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: { dayNumber: number | null; dateStr: string; games: GameRecord[] }[] = []

    // Padding before first day
    for (let i = 0; i < firstDay; i++) {
      days.push({ dayNumber: null, dateStr: '', games: [] })
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dayGames = filteredGames.filter((g) => g.releaseDate === dateStr)
      days.push({ dayNumber: d, dateStr, games: dayGames })
    }

    return days
  }, [calendarMonth, filteredGames])

  return (
    <div className="space-y-8">
      {/* 1. Control Bar: View Switcher & Timeframe Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 glass-card rounded-2xl border border-white/10">
        
        {/* Timeframe Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                timeframe === tf.id
                  ? 'bg-[#00ff88] text-black shadow-md shadow-[#00ff88]/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* View Toggle (List vs Calendar Grid) */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0 self-end md:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-[#00ff88] text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-[#00ff88] text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar View</span>
          </button>
        </div>

      </div>

      {/* 2. Secondary Filter Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#141416] rounded-xl border border-white/10">
        {/* Platform Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold shrink-0">Platform:</span>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg text-xs text-white p-2 focus:outline-none focus:border-[#00ff88]"
          >
            {PLATFORM_FILTERS.map((p) => (
              <option key={p} value={p} className="bg-[#18181c]">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold shrink-0">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg text-xs text-white p-2 focus:outline-none focus:border-[#00ff88]"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s} className="bg-[#18181c]">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold shrink-0">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg text-xs text-white p-2 focus:outline-none focus:border-[#00ff88]"
          >
            {TYPE_FILTERS.map((t) => (
              <option key={t} value={t} className="bg-[#18181c]">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-12">
          {Object.keys(groupedByMonth).length === 0 ? (
            <div className="p-12 text-center glass-card rounded-2xl border border-white/10">
              <Gamepad2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No releases match this filter</h3>
              <p className="text-xs text-gray-400 mt-1">Try resetting your filters or selecting another timeframe.</p>
            </div>
          ) : (
            Object.entries(groupedByMonth).map(([monthTitle, games]) => (
              <div key={monthTitle} className="space-y-4">
                
                {/* Month Group Header */}
                <div className="flex items-center gap-3 border-b border-white/15 pb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88]" />
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-wider">
                    {monthTitle}
                  </h2>
                  <span className="text-xs text-gray-400 font-semibold">
                    ({games.length} {games.length === 1 ? 'Title' : 'Titles'})
                  </span>
                </div>

                {/* Games in Month */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {games.map((game) => {
                    const countdown = getCountdown(game.releaseDate, game.releaseStatus)

                    return (
                      <div
                        key={game.id}
                        className="glass-card p-3.5 rounded-2xl border border-white/10 hover:border-[#00ff88]/40 transition-all duration-300 flex gap-4 group"
                      >
                        {/* 3:4 Game Poster */}
                        <div className="relative w-20 sm:w-24 shrink-0 rounded-xl overflow-hidden">
                          <GameImage
                            src={game.coverImage}
                            alt={game.name}
                            aspectRatio="poster"
                            className="rounded-xl w-full h-full shadow-md"
                          />
                        </div>

                        {/* Game Information */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            {/* Status & Countdown Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              {renderStatusBadge(game.releaseStatus)}
                              <span className="text-[11px] font-bold text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 rounded-full">
                                {countdown}
                              </span>
                            </div>

                            {/* Game Title */}
                            <Link href={`/games/${game.slug}`}>
                              <h3 className="text-base font-bold text-white group-hover:text-[#00ff88] transition-colors truncate">
                                {game.name}
                              </h3>
                            </Link>

                            {/* Release Date */}
                            <div className="text-xs text-gray-300 font-medium mt-1 flex items-center gap-1.5">
                              <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                              <span>{game.releaseDate}</span>
                            </div>

                            {/* Date Change / Delayed Notice */}
                            {game.previousReleaseDate && (
                              <div className="mt-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[11px] text-yellow-300">
                                <span className="font-bold">Previously:</span> {game.previousReleaseDate}
                                {game.dateChangeNote && (
                                  <span className="text-yellow-400 block mt-0.5 italic">
                                    "{game.dateChangeNote}"
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Platforms List */}
                            <div className="text-xs text-gray-400 mt-2 truncate">
                              {game.platforms.slice(0, 4).join(' • ')}
                            </div>
                          </div>

                          {/* Genres & Score */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                            <span className="text-[11px] text-gray-500 truncate max-w-[150px]">
                              {game.genres.slice(0, 2).join(', ')}
                            </span>
                            <span className="text-xs font-black text-[#00ff88]">
                              {game.gameRankScore} <span className="text-[10px] text-gray-400 font-normal">pts</span>
                            </span>
                          </div>

                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* 4. CALENDAR GRID VIEW */}
      {viewMode === 'calendar' && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white">
              {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
                  )
                }
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
                  )
                }
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cell, idx) => (
              <div
                key={idx}
                className={`min-h-[110px] p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                  cell.dayNumber
                    ? 'bg-white/5 border-white/10 hover:border-white/20'
                    : 'bg-transparent border-transparent'
                }`}
              >
                {cell.dayNumber && (
                  <>
                    <div className="text-right text-xs font-mono font-bold text-gray-400">
                      {cell.dayNumber}
                    </div>

                    <div className="space-y-1.5 my-1 overflow-y-auto max-h-[85px] scrollbar-none">
                      {cell.games.map((g) => (
                        <Link
                          key={g.id}
                          href={`/games/${g.slug}`}
                          className="block p-1 rounded bg-[#18181c] border border-white/10 hover:border-[#00ff88] transition-all group"
                          title={`${g.name} (${g.platforms.slice(0, 2).join(', ')})`}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="relative w-5 h-7 rounded overflow-hidden shrink-0">
                              <GameImage
                                src={g.coverImage}
                                alt={g.name}
                                aspectRatio="poster"
                              />
                            </div>
                            <span className="text-[11px] font-semibold text-white group-hover:text-[#00ff88] truncate">
                              {g.name}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {cell.games.length === 0 && <div className="flex-1" />}
                  </>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 text-center italic">
            Calendar view displays releases on their scheduled launch dates. Click on any game badge to open its full spec profile.
          </p>
        </div>
      )}

    </div>
  )
}
