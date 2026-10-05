import { Metadata } from 'next'
import Link from 'next/link'
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Scale,
  Calendar,
  Layers,
  Heart,
  Instagram,
  ExternalLink,
  ArrowRight,
  Code2,
  Compass,
  CheckCircle2,
  Flame,
  Shield,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About GameRank - Built by a Gamer, for Gamers',
  description:
    'Learn about Harsh Sisodia, the founder and creator of GameRank, and our mission to help gamers worldwide discover, rank, compare, and explore video games.',
  openGraph: {
    title: 'About GameRank - Founded by Harsh Sisodia',
    description:
      'GameRank was built by a gamer, for gamers. Discover the story, mission, and technology powering the platform.',
    url: 'https://gamerank.app/about',
  },
}

const MISSION_PILLARS = [
  {
    icon: Compass,
    title: 'Worldwide Discovery',
    description:
      'Discover thousands of video games across PC, PlayStation, Xbox, Nintendo, and mobile in one unified catalog.',
  },
  {
    icon: Layers,
    title: 'Platform & Genre Hubs',
    description:
      'Explore dedicated sections for every major gaming ecosystem, from RPGs and tactical shooters to open-world adventures.',
  },
  {
    icon: Trophy,
    title: 'Transparent Rankings',
    description:
      'Check transparent GameRank quality scores combining verified critic reviews, community sentiment, and popularity curves.',
  },
  {
    icon: Scale,
    title: 'Side-by-Side Comparison',
    description:
      'Compare 2 to 4 games simultaneously with hardware specs, gameplay modes, cross-play support, and playtime estimates.',
  },
  {
    icon: Calendar,
    title: 'Release Radar & Calendar',
    description:
      'Track upcoming video game launches across 2026 and 2027 with live countdowns, delay notices, and history records.',
  },
  {
    icon: Flame,
    title: 'Fresh Releases',
    description:
      'Find the newest drops and trending worldwide releases with immediate community feedback and verified information.',
  },
  {
    icon: Sparkles,
    title: 'AI Game Finder',
    description:
      'Receive personalized game recommendations through natural language queries and tailored playstyle filters without hallucinations.',
  },
  {
    icon: Gamepad2,
    title: '100% Authentic Cover Art',
    description:
      'Enjoy beautiful official 3:4 portrait posters, cinematic wallpapers, and high-definition screenshot photo galleries for every game.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-white/10">
        {/* Subtle Gaming Ambient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00ff88]/15 via-[#00d4ff]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#b347ff]/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-[#00ff88]/10 animate-in fade-in slide-in-from-top duration-500">
            <Gamepad2 className="w-4 h-4" />
            <span>About GameRank</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
            Built by a gamer, <br className="hidden sm:inline" />
            <span className="text-gradient">for gamers.</span>
          </h1>

          {/* Subtitle / Intro */}
          <p className="text-gray-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            GameRank is a modern gaming discovery and ranking platform created by{' '}
            <strong className="text-white font-semibold">Harsh Sisodia</strong> to give gamers everywhere a clean, beautiful, and data-driven home for exploring video games.
          </p>

          {/* Professional Avatar / Profile Crest Placeholder */}
          <div className="pt-8 flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#141418] border border-white/20 flex flex-col items-center justify-center shadow-2xl p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center text-black font-black text-xl shadow-md">
                  HS
                </div>
                <span className="mt-2 text-xs font-black text-white tracking-wider">
                  Harsh Sisodia
                </span>
                <span className="text-[10px] text-[#00ff88] font-bold uppercase tracking-wider">
                  Founder & Creator
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-mono">
              Gamer • Tech Enthusiast • Creator of GameRank
            </p>
          </div>
        </div>
      </section>

      {/* 2. MY STORY SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00d4ff] bg-[#00d4ff]/10 px-3 py-1 rounded-full border border-[#00d4ff]/20">
            <Code2 className="w-3.5 h-3.5" />
            <span>Behind the Project</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            My Story
          </h2>
          <p className="text-gray-400 text-sm">
            How a passion for gaming transformed into an interactive platform
          </p>
        </div>

        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff88]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Exact Story Quotation Requested */}
          <div className="relative z-10 space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
            <p className="font-medium text-white text-lg sm:text-xl border-l-4 border-[#00ff88] pl-4 italic">
              "I’m Harsh Sisodia, the creator of GameRank. I built GameRank because I wanted a simple and exciting place where gamers could discover games, explore their details, compare them, and find something new to play."
            </p>

            <p>
              "GameRank is a project built from my passion for gaming, technology, and creativity. I’m continuously improving it and adding new features to make it better for gamers everywhere."
            </p>
          </div>

          {/* Founder Highlights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Gamer at Heart</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                As a young gamer, Harsh has explored countless genres, systems, and game worlds, inspiring a deep understanding of what players value.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Technology & Building</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Passionate about web technologies, fast user interfaces, and designing tools that simplify complex data into enjoyable experiences.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#b347ff]/20 text-[#b347ff] flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Continuous Innovation</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Actively developing new features — from AI recommendation algorithms to release tracking and deep comparison metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR MISSION SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00ff88] bg-[#00ff88]/10 px-3 py-1 rounded-full border border-[#00ff88]/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Our Purpose</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Our Mission
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-[#00ff88] italic">
            "Make discovering your next favorite game easier."
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed pt-2">
            GameRank aims to bring useful game information, discovery tools, rankings, comparisons, recommendations, and release information together in one simple, beautiful place.
          </p>
        </div>

        {/* 8 Core Capabilities Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MISSION_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.title}
              className="glass-card p-6 rounded-2xl border border-white/10 hover:border-[#00ff88]/40 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00ff88] group-hover:scale-110 group-hover:bg-[#00ff88]/20 transition-all">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#00ff88] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="text-[10px] font-mono text-gray-600 font-bold">
                0{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SOCIAL & FOLLOW ME SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/15 bg-gradient-to-br from-[#141418] via-[#1a1a24] to-[#141418] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                <Heart className="w-3.5 h-3.5 fill-pink-400" />
                <span>Stay Connected</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Follow Me
              </h2>
              <p className="text-gray-300 text-sm sm:text-base max-w-lg leading-relaxed">
                Follow Harsh Sisodia to see development updates, upcoming features, new ranking drops, and behind-the-scenes milestones for GameRank.
              </p>
            </div>

            {/* Verified Instagram Social Card */}
            <div className="w-full sm:w-auto shrink-0">
              <a
                href="https://www.instagram.com/hxrsh_s2k14"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Harsh Sisodia on Instagram @hxrsh_s2k14"
                className="group block p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-pink-500/50 shadow-xl transition-all duration-300 hover:scale-[1.02] text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
                    <Instagram className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <span>Instagram</span>
                      <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-lg font-black text-white group-hover:text-pink-400 transition-colors">
                      @hxrsh_s2k14
                    </div>
                    <div className="text-xs text-[#00ff88] font-bold mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Founder & Creator</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300 font-bold group-hover:text-white transition-colors">
                  <span>Open Instagram Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXPLORE GAMERANK CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Ready to explore?
          </h3>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Dive into the worldwide rankings, test the side-by-side comparison engine, or let our AI finder match your next obsession.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/rankings" className="btn-primary text-xs sm:text-sm font-bold px-6 py-3">
              Explore Rankings
            </Link>
            <Link href="/compare" className="btn-secondary text-xs sm:text-sm font-bold px-6 py-3">
              Compare Games
            </Link>
            <Link href="/ai-game-finder" className="btn-secondary text-xs sm:text-sm font-bold px-6 py-3">
              AI Game Finder
            </Link>
            <Link href="/releases" className="btn-secondary text-xs sm:text-sm font-bold px-6 py-3">
              Release Calendar
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
