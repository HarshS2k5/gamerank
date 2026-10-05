import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar as CalendarIcon, ArrowLeft, Clock, History } from 'lucide-react'
import { GameDataProvider } from '@/lib/provider'
import { ReleaseCalendarView } from '@/components/releases/ReleaseCalendarView'

export const metadata: Metadata = {
  title: 'Game Release Calendar - 2026 & Beyond | GameRank',
  description:
    'Track upcoming and recent video game launches across PC, PS5, Xbox Series X, Switch, and mobile with launch countdowns and release status updates.',
}

export default async function ReleasesPage() {
  const games = await GameDataProvider.getAllGames()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header and Quick Links */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00ff88] text-xs font-semibold uppercase tracking-wider transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#00ff88] text-xs font-bold uppercase tracking-wider bg-[#00ff88]/10 px-3 py-1.5 rounded-full mb-3">
              <CalendarIcon className="w-4 h-4" /> Global Launch Calendar
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              Game Release Calendar
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Verified release dates, launch countdowns, delay notices, and platform availability across 2026, 2027, and beyond.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/releases/upcoming"
              className="glass-card px-4 py-2 rounded-xl text-xs font-bold text-[#00d4ff] border border-[#00d4ff]/30 hover:bg-[#00d4ff]/10 transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" /> Upcoming Only
            </Link>
            <Link
              href="/releases/recent"
              className="glass-card px-4 py-2 rounded-xl text-xs font-bold text-gray-300 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" /> Recently Released
            </Link>
          </div>
        </div>
      </div>

      {/* Main Release Calendar View Component */}
      <ReleaseCalendarView initialGames={games} defaultTimeframe="all" />
    </div>
  )
}
