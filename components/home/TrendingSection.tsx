import { SectionHeader } from '@/components/ui/SectionHeader'
import { GameCard } from '@/components/ui/GameCard'

async function getTrendingGames() {
  try {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) return []
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const dateStr = `${thirtyDaysAgo.toISOString().split('T')[0]},${now.toISOString().split('T')[0]}`
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&ordering=-added&dates=${dateStr}&page_size=8`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

export async function TrendingSection() {
  const games = await getTrendingGames()
  if (games.length === 0) return null
  return (
    <section>
      <SectionHeader
        title="Trending Worldwide"
        subtitle="Most added games in the last 30 days"
        viewAllHref="/rankings/most-popular"
        icon="🔥"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {games.map((game: any) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}
