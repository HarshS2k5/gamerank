import { Suspense } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { TopTenSection } from '@/components/home/TopTenSection'
import { PlatformGrid } from '@/components/home/PlatformGrid'
import { GenreGrid } from '@/components/home/GenreGrid'
import { TrendingSection } from '@/components/home/TrendingSection'
import { NewReleasesSection } from '@/components/home/NewReleasesSection'
import { UpcomingSection } from '@/components/home/UpcomingSection'
import { FreeGamesSection } from '@/components/home/FreeGamesSection'
import { GameCardSkeleton } from '@/components/ui/GameCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GameRank - Worldwide Gaming Rankings & Discovery',
  description: 'Discover the best video games worldwide. Explore rankings by platform, genre, and popularity with real data from the RAWG database.',
}

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero - Featured Game */}
      <Suspense fallback={
        <div className="w-full h-[85vh] bg-[#1a1a1a] animate-pulse" />
      }>
        <HeroSection />
      </Suspense>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Top 10 Worldwide */}
        <Suspense fallback={
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 loading-skeleton rounded-xl" />
            ))}
          </div>
        }>
          <TopTenSection />
        </Suspense>
        
        {/* Explore by Platform */}
        <PlatformGrid />
        
        {/* Explore by Genre */}
        <GenreGrid />
        
        {/* Trending Worldwide */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <GameCardSkeleton key={i} />)}
          </div>
        }>
          <TrendingSection />
        </Suspense>
        
        {/* New Releases */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <GameCardSkeleton key={i} />)}
          </div>
        }>
          <NewReleasesSection />
        </Suspense>
        
        {/* Upcoming Games */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <GameCardSkeleton key={i} />)}
          </div>
        }>
          <UpcomingSection />
        </Suspense>
        
        {/* Free to Play */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <GameCardSkeleton key={i} />)}
          </div>
        }>
          <FreeGamesSection />
        </Suspense>
        
        {/* Ranking Methodology */}
        <RankingMethodologySection />
      </div>
    </div>
  )
}

function RankingMethodologySection() {
  return (
    <section className="glass-card p-8 md:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          How We Rank Games
        </h2>
        <p className="text-gray-400 mb-8">
          GameRank uses a transparent, multi-factor algorithm combining real data sources.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🎯', label: 'Critic Score', weight: '40%', desc: 'Metacritic aggregate score' },
            { icon: '⭐', label: 'Community Rating', weight: '30%', desc: 'User ratings from RAWG' },
            { icon: '🔥', label: 'Popularity', weight: '20%', desc: 'Based on ratings count' },
            { icon: '📅', label: 'Recency Bonus', weight: '10%', desc: 'Recent releases rewarded' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-[#00ff88] font-bold text-lg mb-1">{item.weight}</div>
              <div className="text-white font-medium text-sm mb-1">{item.label}</div>
              <div className="text-gray-500 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-8">
          Data sourced from <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-[#00ff88] hover:underline">RAWG Video Games Database</a>.
          Rankings are recalculated hourly. Scores are normalized for fair comparison.
        </p>
      </div>
    </section>
  )
}
