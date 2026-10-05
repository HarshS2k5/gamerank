import { SectionHeader } from '@/components/ui/SectionHeader'
import { GameCard } from '@/components/ui/GameCard'

async function getUpcomingGames() {
  try {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) return []
    const now = new Date()
    const nextYear = new Date(now.getFullYear() + 2, 0, 1)
    const dateStr = `${now.toISOString().split('T')[0]},${nextYear.toISOString().split('T')[0]}`
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&ordering=-added&dates=${dateStr}&page_size=6`,
      { next: { revalidate: 3600 * 3 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

export async function UpcomingSection() {
  const games = await getUpcomingGames()
  if (games.length === 0) return null
  return (
    <section>
      <SectionHeader
        title="Most Anticipated"
        subtitle="Upcoming games generating the most buzz"
        viewAllHref="/rankings/upcoming"
        icon="📅"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {games.map((game: any) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}
