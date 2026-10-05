import { Suspense } from 'react'
import { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { GameCarousel } from '@/components/ui/GameCarousel'
import { PlatformGrid } from '@/components/home/PlatformGrid'
import { GenreGrid } from '@/components/home/GenreGrid'
import { GameDataProvider } from '@/lib/provider'

export const metadata: Metadata = {
  title: 'GameRank - Worldwide Video Game Database & Rankings',
  description: 'Discover and rank the greatest video games across PC, PlayStation, Xbox, Nintendo, and mobile with genuine cover artwork, critic scores, and player reviews.',
}

export default async function HomePage() {
  const allGames = await GameDataProvider.getAllGames()

  // Slices for each horizontal carousel
  const trendingGames = [...allGames].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 15)
  const topRatedGames = [...allGames].sort((a, b) => b.gameRankScore - a.gameRankScore).slice(0, 15)
  const popularGames = [...allGames].sort((a, b) => b.popularity - a.popularity).slice(0, 15)
  
  const pcGames = allGames.filter((g) => g.platforms.some((p) => p.includes('PC'))).slice(0, 15)
  const consoleGames = allGames.filter((g) => g.platforms.some((p) => p.includes('PlayStation') || p.includes('Xbox') || p.includes('Nintendo'))).slice(0, 15)
  const mobileGames = allGames.filter((g) => g.platforms.some((p) => p.includes('Android') || p.includes('iOS'))).slice(0, 15)
  const classicGames = allGames.filter((g) => new Date(g.releaseDate).getFullYear() <= 2017).slice(0, 15)

  return (
    <div className="min-h-screen pb-24">
      {/* 1. Hero Section with GameRank Identity */}
      <HeroSection featuredGames={topRatedGames} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 2. 🔥 Trending Now Carousel */}
        <GameCarousel
          title="Trending Now"
          subtitle="Games gaining the most momentum across the gaming community right now"
          icon="🔥"
          games={trendingGames}
          showRank={true}
        />

        {/* 3. 🏆 Top Rated Worldwide Carousel */}
        <GameCarousel
          title="Top Rated Worldwide"
          subtitle="The highest scoring video games of all time according to GameRank"
          icon="🏆"
          games={topRatedGames}
          showRank={true}
        />

        {/* 4. Explore by Platform Navigation Grid */}
        <PlatformGrid />

        {/* 5. 💻 Best PC Games Carousel */}
        <GameCarousel
          title="Best PC Games"
          subtitle="Definitive titles available on PC, Steam, and Epic Games"
          icon="💻"
          games={pcGames}
          showRank={true}
        />

        {/* 6. 🎮 Popular Console Games Carousel */}
        <GameCarousel
          title="Best Console Games"
          subtitle="Blockbusters on PlayStation 5, Xbox Series X|S, and Nintendo Switch"
          icon="🎮"
          games={consoleGames}
          showRank={true}
        />

        {/* 7. Explore by Genre Navigation Grid */}
        <GenreGrid />

        {/* 8. 📱 Best Mobile Games Carousel */}
        <GameCarousel
          title="Best Mobile Games"
          subtitle="High-caliber titles available on Android, iPhone, and iPad"
          icon="📱"
          games={mobileGames}
          showRank={true}
        />

        {/* 9. ⭐ All-Time Classics Carousel */}
        <GameCarousel
          title="All-Time Classics"
          subtitle="Genre-defining games that helped shape the modern industry"
          icon="⭐"
          games={classicGames}
          showRank={true}
        />

        {/* 10. Transparent GameRank Methodology Card */}
        <section className="glass-card p-8 md:p-12 border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="text-[#00ff88] text-xs font-black uppercase tracking-widest bg-[#00ff88]/10 px-3 py-1 rounded-full border border-[#00ff88]/20">
              Transparent Scoring
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white mt-4 mb-3">
              How the GameRank Score Works
            </h2>
            <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed">
              Every score on GameRank is dynamically computed using a balanced formula that combines critic assessments, community sentiment, real player counts, and release timing.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { weight: '40%', label: 'Critic Score', desc: 'Normalized Metacritic reviews' },
                { weight: '30%', label: 'Community Rating', desc: 'Verified player feedback' },
                { weight: '20%', label: 'Popularity', desc: 'Global player engagement' },
                { weight: '10%', label: 'Recency Curve', desc: 'Rewarding recent excellence' },
              ].map((factor) => (
                <div key={factor.label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl font-black text-[#00ff88]">{factor.weight}</div>
                  <div className="text-sm font-bold text-white mt-1">{factor.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{factor.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
