// ─────────────────────────────────────────────────────────────────────────────
// GameRank – Scalable Game Data Provider Abstraction Layer
// ─────────────────────────────────────────────────────────────────────────────
// Supports both internal local high-fidelity Seed Database (guaranteeing 100%
// cover posters for all headline games) and dynamic RAWG / IGDB REST APIs.
// ─────────────────────────────────────────────────────────────────────────────

import { GameRecord, PlatformFilter, GenreFilter } from '@/types/database';
import { SEED_GAMES } from '@/lib/database';

export class GameDataProvider {
  /**
   * Retrieves all games from the database or provider
   */
  static async getAllGames(): Promise<GameRecord[]> {
    return [...SEED_GAMES];
  }

  /**
   * Get single game by slug
   */
  static async getGameBySlug(slug: string): Promise<GameRecord | null> {
    const local = SEED_GAMES.find((g) => g.slug.toLowerCase() === slug.toLowerCase());
    if (local) return local;

    // Optional dynamic fallback from RAWG if not in seed
    if (process.env.RAWG_API_KEY) {
      try {
        const res = await fetch(`https://api.rawg.io/api/games/${slug}?key=${process.env.RAWG_API_KEY}`, {
          next: { revalidate: 3600 * 24 }
        });
        if (res.ok) {
          const rawg = await res.json();
          return this.adaptRAWGToGameRecord(rawg);
        }
      } catch (e) {
        console.error('Error fetching dynamic game from RAWG:', e);
      }
    }

    return null;
  }

  /**
   * Search games by keyword and optional platform/genre filters
   */
  static async searchGames(
    query: string,
    filters?: {
      platform?: string;
      genre?: string;
      ordering?: string;
    }
  ): Promise<GameRecord[]> {
    let results = [...SEED_GAMES];

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters?.platform && filters.platform !== 'all') {
      const p = filters.platform.toLowerCase();
      results = results.filter((g) =>
        g.platforms.some((plat) => plat.toLowerCase().includes(p))
      );
    }

    if (filters?.genre && filters.genre !== 'all') {
      const gMatch = filters.genre.toLowerCase();
      results = results.filter((g) =>
        g.genres.some((genre) => genre.toLowerCase().includes(gMatch))
      );
    }

    // Sorting
    const ordering = filters?.ordering || '-gamerank';
    results = this.sortGames(results, ordering);

    return results;
  }

  /**
   * Get curated rankings list by category
   */
  static async getRankingsByCategory(category: string): Promise<GameRecord[]> {
    let list = [...SEED_GAMES];

    switch (category) {
      case 'all-time':
      case 'top-rated':
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
        break;

      case 'most-popular':
      case 'trending':
        list.sort((a, b) => b.popularity - a.popularity);
        break;

      case 'upcoming':
        list = list.filter((g) => new Date(g.releaseDate) > new Date('2024-01-01'));
        list.sort((a, b) => b.trendingScore - a.trendingScore);
        break;

      case 'best-of-year':
        list = list.filter((g) => new Date(g.releaseDate).getFullYear() >= 2023);
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
        break;

      case 'free-to-play':
        list = list.filter((g) => g.freeToPlay);
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
        break;

      case 'multiplayer':
        list = list.filter((g) => g.multiplayer);
        list.sort((a, b) => b.popularity - a.popularity);
        break;

      case 'co-op':
        list = list.filter((g) => g.coOp);
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
        break;

      case 'cross-platform':
      case 'crossplay':
        list = list.filter((g) => g.crossPlay || g.platforms.length >= 3);
        list.sort((a, b) => b.popularity - a.popularity);
        break;

      // Platform specific
      case 'pc':
        list = list.filter((g) => g.platforms.some((p) => p.includes('PC')));
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
        break;

      case 'playstation':
      case 'ps5':
      case 'ps4':
        list = list.filter((g) => g.platforms.some((p) => p.includes('PlayStation')));
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
        break;

      case 'xbox':
      case 'xbox-series':
      case 'xbox-one':
        list = list.filter((g) => g.platforms.some((p) => p.includes('Xbox')));
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
        break;

      case 'nintendo':
      case 'nintendo-switch':
        list = list.filter((g) => g.platforms.some((p) => p.includes('Nintendo')));
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
        break;

      case 'mobile':
      case 'android':
      case 'ios':
        list = list.filter((g) =>
          g.platforms.some((p) => p.includes('Android') || p.includes('iOS'))
        );
        list.sort((a, b) => b.popularity - a.popularity);
        break;

      // Genre specific
      case 'action':
      case 'rpg':
      case 'action-rpg':
      case 'shooter':
      case 'fps':
      case 'strategy':
      case 'horror':
      case 'sports':
      case 'racing':
      case 'indie':
      case 'platformer':
      case 'sandbox':
      case 'moba':
      case 'battle-royale':
      case 'roguelike':
      case 'open-world':
      case 'story':
      case 'puzzle':
      case 'simulation':
      case 'survival':
      case 'fighting':
      case 'party':
        list = list.filter((g) =>
          g.genres.some((genre) =>
            genre.toLowerCase().replace(/[\s-]/g, '').includes(category.replace(/[\s-]/g, ''))
          )
        );
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
        break;

      default:
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
    }

    return list;
  }

  /**
   * Sort helper
   */
  private static sortGames(games: GameRecord[], ordering: string): GameRecord[] {
    const list = [...games];
    switch (ordering) {
      case '-metacritic':
      case '-critic':
        return list.sort((a, b) => b.criticScore - a.criticScore);
      case '-rating':
      case '-player':
        return list.sort((a, b) => b.playerScore - a.playerScore);
      case '-added':
      case '-popularity':
        return list.sort((a, b) => b.popularity - a.popularity);
      case '-released':
      case '-newest':
        return list.sort(
          (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      case 'released':
      case 'oldest':
        return list.sort(
          (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
        );
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case '-name':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case '-gamerank':
      default:
        return list.sort((a, b) => b.gameRankScore - a.gameRankScore);
    }
  }

  /**
   * Adapter for converting RAWG schema to unified GameRecord
   */
  private static adaptRAWGToGameRecord(rawg: any): GameRecord {
    return {
      id: rawg.id,
      name: rawg.name,
      slug: rawg.slug,
      coverImage: rawg.background_image || '/images/placeholder-game.jpg',
      backgroundImage: rawg.background_image_additional || rawg.background_image || '/images/placeholder-game.jpg',
      description: rawg.description_raw || rawg.description || '',
      releaseDate: rawg.released || '2023-01-01',
      developer: rawg.developers?.[0]?.name || 'Various Developers',
      publisher: rawg.publishers?.[0]?.name || 'Various Publishers',
      platforms: rawg.platforms?.map((p: any) => p.platform?.name) || ['PC'],
      genres: rawg.genres?.map((g: any) => g.name) || ['Action'],
      tags: rawg.tags?.slice(0, 5).map((t: any) => t.name) || [],
      criticScore: rawg.metacritic || 80,
      playerScore: Number((rawg.rating * 2).toFixed(1)) || 8.0,
      gameRankScore: Math.round(((rawg.metacritic || 80) * 0.4) + ((rawg.rating || 4) * 6) + 20),
      popularity: Math.min(Math.round((rawg.ratings_count || 500) / 100), 99),
      trendingScore: 85,
      singlePlayer: true,
      multiplayer: Boolean(rawg.tags?.some((t: any) => t.slug?.includes('multiplayer'))),
      coOp: Boolean(rawg.tags?.some((t: any) => t.slug?.includes('co-op'))),
      crossPlay: false,
      freeToPlay: Boolean(rawg.tags?.some((t: any) => t.slug?.includes('free-to-play'))),
      officialWebsite: rawg.website,
      screenshots: rawg.short_screenshots?.map((s: any) => s.image) || []
    };
  }
}
