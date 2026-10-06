import { Metadata } from 'next'
import Link from 'next/link'
import {
  Gamepad2,
  Clock,
  Sparkles,
  Cpu,
  Globe,
  Bot,
  Code2,
  Rocket,
  Heart,
  Instagram,
  ExternalLink,
  ArrowRight,
  Monitor,
  Infinity as InfinityIcon,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About the Creator | Harsh Sisodia | GameRank',
  description:
    'Hi! I’m Harsh Sisodia, a 12-year-old creator who enjoys technology, gaming, AI, and building interactive websites and digital projects including GameRank and Internet Time Machine.',
  openGraph: {
    title: 'About the Creator | Harsh Sisodia',
    description:
      'Meet Harsh Sisodia, a 12-year-old creator and developer passionate about gaming, technology, AI, and building interactive web projects.',
    url: 'https://gamerank-one.vercel.app/about',
  },
}

const INTERESTS = [
  {
    icon: Gamepad2,
    label: 'Gaming',
    color: '#00ff88',
    description: 'Playing and analyzing modern games across PC, console, and mobile platforms.',
  },
  {
    icon: Monitor,
    label: 'Technology',
    color: '#00d4ff',
    description: 'Exploring how modern software, systems, and devices work together.',
  },
  {
    icon: Bot,
    label: 'AI',
    color: '#b347ff',
    description: 'Learning about machine learning, generative models, and smart assistants.',
  },
  {
    icon: Globe,
    label: 'Web Development',
    color: '#ff6b35',
    description: 'Crafting responsive, fast, and interactive experiences using modern web tools.',
  },
  {
    icon: Cpu,
    label: 'PC Hardware',
    color: '#00ff88',
    description: 'Understanding CPUs, GPUs, architectures, power limits, and compatibility.',
  },
  {
    icon: Rocket,
    label: 'Building Projects',
    color: '#00d4ff',
    description: 'Turning creative ideas into working digital projects from start to finish.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-24 text-white">
      {/* 1. HERO SECTION — ABOUT THE CREATOR */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-white/10">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00ff88]/15 via-[#00d4ff]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#b347ff]/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-[#00ff88]/10">
            <Sparkles className="w-4 h-4" />
            <span>Developer Profile</span>
          </div>

          {/* Section Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight">
            About the Creator
          </h1>

          {/* Prominent Name & Title */}
          <div className="space-y-1">
            <div className="text-4xl sm:text-6xl font-black tracking-tight text-gradient">
              Harsh Sisodia
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-200">
              Creator &amp; Developer
            </div>
          </div>

          {/* Authentic Young Creator Introduction */}
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl">
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed font-medium">
              "Hi! I'm Harsh Sisodia, a 12-year-old creator who enjoys technology, gaming, AI, and building interactive websites and digital projects."
            </p>
          </div>
        </div>
      </section>

      {/* 2. CREATOR CARD & VERIFIED STATS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Creator Profile Card (7 cols) */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-10 rounded-3xl border border-white/10 relative overflow-hidden space-y-6">
            <div className="flex items-center gap-5">
              {/* HS Monogram Avatar with ambient ring */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-2xl blur-sm opacity-50" />
                <div className="relative w-20 h-20 rounded-2xl bg-[#141418] border border-white/20 flex items-center justify-center text-black font-black text-2xl shadow-xl bg-gradient-to-br from-[#00ff88] to-[#00d4ff]">
                  HS
                </div>
              </div>

              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#00ff88]/15 border border-[#00ff88]/40 text-[#00ff88] mb-1 font-mono">
                  12 Years Old
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Harsh Sisodia
                </h2>
                <span className="text-sm font-semibold text-gray-300">
                  Creator &amp; Developer
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              I love discovering how technology works and turning fun ideas into real, working websites. Whether it's building interactive gaming tools, exploring computer hardware, or coding user interfaces, building projects is how I learn and grow every day.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs text-gray-400 font-mono">
              <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/10">🎮 Gamer</span>
              <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/10">💻 Web Creator</span>
              <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/10">🤖 AI Curious</span>
              <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/10">🖥️ PC Hardware</span>
            </div>
          </div>

          {/* Creator Verified Stats (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {/* Stat 1: Age */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#00ff88]/30 transition-all flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
                  Age
                </span>
                <span className="text-sm font-bold text-gray-300 mt-0.5 block">
                  Years Old
                </span>
              </div>
              <div className="text-4xl font-black font-mono text-[#00ff88]">
                12
              </div>
            </div>

            {/* Stat 2: Featured Projects */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#00d4ff]/30 transition-all flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
                  Portfolio
                </span>
                <span className="text-sm font-bold text-gray-300 mt-0.5 block">
                  Featured Projects
                </span>
              </div>
              <div className="text-4xl font-black font-mono text-[#00d4ff]">
                2
              </div>
            </div>

            {/* Stat 3: Ideas to Build */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#b347ff]/30 transition-all flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
                  Future Roadmap
                </span>
                <span className="text-sm font-bold text-gray-300 mt-0.5 block">
                  Ideas to Build
                </span>
              </div>
              <div className="text-4xl font-black font-mono text-[#b347ff]">
                ∞
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MY PROJECTS — PROJECTS I'VE CREATED */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00ff88] bg-[#00ff88]/10 px-3.5 py-1 rounded-full border border-[#00ff88]/20">
            <Rocket className="w-3.5 h-3.5" />
            <span>Interactive Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Projects I've Created
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            I enjoy turning ideas into interactive websites and experimenting with technology. Here are some of the projects I've created.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project 1: GameRank */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-[#00ff88]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] group-hover:scale-105 transition-transform">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-1 rounded-full border border-[#00ff88]/20">
                  Live Project
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-[#00ff88] transition-colors">
                  GameRank
                </h3>
                <span className="text-xs text-gray-500 font-mono">
                  Worldwide Gaming Ranking &amp; Discovery Platform
                </span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                GameRank is one of my gaming-focused web projects, created to explore games and gaming-related content through an interactive website experience.
              </p>
            </div>

            <div>
              <a
                href="https://gamerank-one.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary text-xs sm:text-sm font-bold py-3 px-6 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[#00ff88]/25"
              >
                <span>VISIT GAMERANK</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <span className="text-[10px] text-gray-500 text-center block mt-2 font-mono">
                gamerank-one.vercel.app
              </span>
            </div>
          </div>

          {/* Project 2: Internet Time Machine */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-[#00d4ff]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-[#00d4ff] group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#00d4ff] bg-[#00d4ff]/10 px-2.5 py-1 rounded-full border border-[#00d4ff]/20">
                  Live Project
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-[#00d4ff] transition-colors">
                  Internet Time Machine
                </h3>
                <span className="text-xs text-gray-500 font-mono">
                  Web History &amp; Technology Evolution
                </span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                Internet Time Machine is an interactive project focused on exploring the history and evolution of the internet, technology, websites, gaming, and the digital world.
              </p>
            </div>

            <div>
              <a
                href="https://internet-time-machine-six.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-secondary text-xs sm:text-sm font-bold py-3 px-6 flex items-center justify-center gap-2 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30"
              >
                <span>VISIT INTERNET TIME MACHINE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <span className="text-[10px] text-gray-500 text-center block mt-2 font-mono">
                internet-time-machine-six.vercel.app
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY I BUILD */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/10 relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff88]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#00ff88] font-mono">
              Personal Motivation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Why I Build
            </h2>
          </div>

          <div className="space-y-4 text-gray-200 text-base sm:text-lg leading-relaxed font-normal">
            <p>
              I enjoy learning by building things. Creating websites gives me a way to experiment with technology, turn ideas into real projects, and keep improving with every project I make.
            </p>
            <p>
              My goal is to continue learning, experimenting, and creating projects that people can actually enjoy and find useful.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WHAT I'M INTERESTED IN — VISUAL GRID */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00d4ff] bg-[#00d4ff]/10 px-3.5 py-1 rounded-full border border-[#00d4ff]/20">
            <Code2 className="w-3.5 h-3.5" />
            <span>Passions &amp; Curiosity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            What I'm Interested In
          </h2>
          <p className="text-gray-400 text-sm">
            Technologies, digital fields, and hobbies I enjoy exploring
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTERESTS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/25 transition-all space-y-3 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#00ff88] transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 6. SOCIAL & CONNECT */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#141418] via-[#1a1a24] to-[#141418] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-wider text-pink-400 flex items-center justify-center md:justify-start gap-1.5 font-bold">
              <Heart className="w-3.5 h-3.5 fill-pink-400" /> Connect
            </span>
            <h3 className="text-2xl font-black text-white">
              Follow Harsh Sisodia
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md">
              Follow along on Instagram to see project progress, new experiments, and milestones.
            </p>
          </div>

          <a
            href="https://www.instagram.com/hxrsh_s2k14"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Harsh Sisodia on Instagram @hxrsh_s2k14"
            className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white font-bold text-xs rounded-2xl shadow-xl shadow-pink-500/20 hover:scale-105 transition-all shrink-0"
          >
            <Instagram className="w-4 h-4" />
            <span>@hxrsh_s2k14 on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </section>

      {/* 7. BOTTOM NAVIGATION CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center space-y-4">
          <h4 className="text-lg font-bold text-white">Explore My Projects</h4>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/rankings" className="btn-primary text-xs font-bold px-6 py-2.5">
              Explore Rankings
            </Link>
            <Link href="/" className="btn-secondary text-xs font-bold px-6 py-2.5">
              Back to GameRank
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
