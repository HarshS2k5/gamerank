import Link from 'next/link'
import { Gamepad2, Github, Twitter } from 'lucide-react'

const FOOTER_LINKS = {
  Rankings: [
    { href: '/rankings/all-time', label: 'Top 100 All Time' },
    { href: '/rankings/pc', label: 'Best PC Games' },
    { href: '/rankings/playstation', label: 'Best PlayStation' },
    { href: '/rankings/xbox', label: 'Best Xbox' },
    { href: '/rankings/nintendo', label: 'Best Nintendo' },
    { href: '/rankings/android', label: 'Best Android' },
    { href: '/rankings/ios', label: 'Best iOS' },
  ],
  Genres: [
    { href: '/rankings/rpg', label: 'Best RPG' },
    { href: '/rankings/action', label: 'Best Action' },
    { href: '/rankings/shooter', label: 'Best Shooter' },
    { href: '/rankings/horror', label: 'Best Horror' },
    { href: '/rankings/indie', label: 'Best Indie' },
    { href: '/rankings/strategy', label: 'Best Strategy' },
    { href: '/rankings/sports', label: 'Best Sports' },
  ],
  Discover: [
    { href: '/compare', label: 'Game Comparison' },
    { href: '/releases', label: 'Release Calendar' },
    { href: '/ai-game-finder', label: 'AI Game Finder' },
    { href: '/rankings/most-popular', label: 'Most Popular' },
    { href: '/rankings/best-of-year', label: 'Best of Year' },
    { href: '/rankings/upcoming', label: 'Upcoming Games' },
    { href: '/rankings/free-to-play', label: 'Free to Play' },
    { href: '/rankings/multiplayer', label: 'Best Multiplayer' },
    { href: '/search', label: 'Search Games' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-gradient">GameRank</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The world's most comprehensive gaming rankings platform. Powered by real game data from the RAWG database.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} GameRank. Game data provided by{' '}
            <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-[#00ff88] hover:underline">RAWG</a>.
          </p>
          <p className="text-gray-600 text-xs">
            Rankings are calculated using a transparent algorithm combining critic scores, community ratings, and popularity metrics.
          </p>
        </div>
      </div>
    </footer>
  )
}
