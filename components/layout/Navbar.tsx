'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, Gamepad2, TrendingUp, Trophy, Star, Scale, Calendar, Sparkles, Info, Cpu } from 'lucide-react'

const NAV_LINKS = [
  { href: '/pc-builder', label: 'PC Builder', icon: Cpu },
  { href: '/rankings/all-time', label: 'Top 100', icon: Trophy },
  { href: '/rankings/most-popular', label: 'Trending', icon: TrendingUp },
  { href: '/compare', label: 'Compare', icon: Scale },
  { href: '/releases', label: 'Release Calendar', icon: Calendar },
  { href: '/ai-game-finder', label: 'AI Finder', icon: Sparkles },
  { href: '/about', label: 'About', icon: Info },
  { href: '/search', label: 'Search', icon: Search },
]

const QUICK_RANKINGS = [
  { href: '/rankings/pc', label: '🖥️ PC Games' },
  { href: '/rankings/playstation', label: '🎮 PlayStation' },
  { href: '/rankings/xbox', label: '🎮 Xbox' },
  { href: '/rankings/nintendo', label: '🕹️ Nintendo' },
  { href: '/rankings/android', label: '📱 Android' },
  { href: '/rankings/ios', label: '📱 iOS' },
  { href: '/rankings/rpg', label: '⚔️ RPG' },
  { href: '/rankings/action', label: '💥 Action' },
  { href: '/rankings/indie', label: '🎨 Indie' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-gradient">GameRank</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {/* Rankings Dropdown */}
            <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
                <Star className="w-4 h-4" />
                Rankings
                <span className="text-xs">▾</span>
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2">
                  {QUICK_RANKINGS.map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {r.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <Link href="/rankings" className="block px-4 py-2 text-sm text-[#00ff88] hover:text-[#00e87a] transition-colors font-medium">
                      All Rankings →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff88]/50 focus:bg-white/15 transition-all w-48 focus:w-64"
              />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-white/10">
          <div className="px-4 py-4 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games..."
                  className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff88]/50"
                />
              </div>
            </form>
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm">
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-3">Quick Rankings</p>
              <div className="grid grid-cols-2 gap-1">
                {QUICK_RANKINGS.map((r) => (
                  <Link key={r.href} href={r.href} onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
