import { SectionHeader } from '@/components/ui/SectionHeader'
import { GameCard } from '@/components/ui/GameCard'

async function getFreeGames() {
  try {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) return []
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&tags=35078&ordering=-rating&page_size=8`,
      { next: { revalidate: 3600 * 3 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

export async function FreeGamesSection() {
  const games = await getFreeGames()
  if (games.length === 0) return null
  return (
    <section>
      <SectionHeader
        title="Popular Free Games"
        subtitle="Top-rated free-to-play games worldwide"
        viewAllHref="/rankings/free-to-play"
        icon="🆓"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {games.map((game: any) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}
