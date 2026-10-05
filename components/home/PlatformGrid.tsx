import Link from 'next/link'

const PLATFORMS = [
  { slug: 'pc', name: 'PC Games', icon: '🖥️', color: 'from-blue-600/30 to-blue-900/20', borderColor: 'border-blue-500/30', count: '10,000+' },
  { slug: 'playstation', name: 'PlayStation', icon: '🎮', color: 'from-blue-700/30 to-indigo-900/20', borderColor: 'border-indigo-500/30', count: '5,000+' },
  { slug: 'xbox', name: 'Xbox', icon: '🟩', color: 'from-green-600/30 to-green-900/20', borderColor: 'border-green-500/30', count: '4,000+' },
  { slug: 'nintendo', name: 'Nintendo', icon: '🕹️', color: 'from-red-600/30 to-red-900/20', borderColor: 'border-red-500/30', count: '3,000+' },
  { slug: 'android', name: 'Android', icon: '📱', color: 'from-green-500/30 to-teal-900/20', borderColor: 'border-green-400/30', count: '8,000+' },
  { slug: 'ios', name: 'iOS', icon: '🍎', color: 'from-gray-600/30 to-gray-900/20', borderColor: 'border-gray-500/30', count: '6,000+' },
]

export function PlatformGrid() {
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="section-heading">🖥️ Explore by Platform</h2>
          <p className="section-subtitle">Rankings for every gaming platform</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PLATFORMS.map((platform) => (
          <Link key={platform.slug} href={`/rankings/${platform.slug}`}>
            <div className={`glass-card p-4 text-center hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-b ${platform.color} border ${platform.borderColor} hover:border-opacity-60`}>
              <div className="text-4xl mb-3">{platform.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">{platform.name}</h3>
              <p className="text-gray-500 text-xs">{platform.count} games</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
