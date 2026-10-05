import { Metadata } from 'next'
import Link from 'next/link'
import { History, ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { GameDataProvider } from '@/lib/provider'
import { ReleaseCalendarView } from '@/components/releases/ReleaseCalendarView'

export const metadata: Metadata = {
  title: 'Recently Released Games - New Launches | GameRank',
  description:
    'Browse the newest game launches across all platforms. Check GameRank scores, critic reviews, and platforms for recently released games.',
}

export default async function RecentReleasesPage() {
  const games = await GameDataProvider.getAllGames()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header and Quick Links */}
      <div className="mb-8">
        <Link
          href="/releases"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00ff88] text-xs font-semibold uppercase tracking-wider transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> All Releases
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#00ff88] text-xs font-bold uppercase tracking-wider bg-[#00ff88]/10 px-3 py-1.5 rounded-full mb-3">
              <History className="w-4 h-4" /> Fresh Drops
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              Recently Released Games
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Latest video games launched worldwide. Explore critic impressions, player reception, and GameRank quality scores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/releases"
              className="glass-card px-4 py-2 rounded-xl text-xs font-bold text-gray-300 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Full Calendar
            </Link>
            <Link
              href="/releases/upcoming"
              className="glass-card px-4 py-2 rounded-xl text-xs font-bold text-[#00d4ff] border border-[#00d4ff]/30 hover:bg-[#00d4ff]/10 transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" /> Upcoming Releases
            </Link>
          </div>
        </div>
      </div>

      {/* Main Release Calendar View Component configured for recently released */}
      <ReleaseCalendarView initialGames={games} defaultTimeframe="recent" />
    </div>
  )
}
