// ─────────────────────────────────────────────────────────────────────────────
// GameRank – Ranking System Logic
// ─────────────────────────────────────────────────────────────────────────────

import type { RankingCategory, RAWGGame, GameRankScore } from '@/types';
import { calculateGameRankScore } from '@/lib/utils';

// ---------------------------------------------------------------------------
// RAWG API parameter factories
// ---------------------------------------------------------------------------

/**
 * Returns the RAWG API query parameters appropriate for each ranking category.
 * These params are forwarded directly to the /games endpoint.
 */
export function getRankingParams(
  category: RankingCategory,
): Record<string, string | number | boolean> {
  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split('T')[0];

  // Two years ahead for upcoming
  const twoYearsAhead = new Date();
  twoYearsAhead.setFullYear(twoYearsAhead.getFullYear() + 2);
  const futureDate = twoYearsAhead.toISOString().split('T')[0];

  switch (category) {
    // ── Global ──────────────────────────────────────────────────────────────
    case 'all-time':
      return {
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '70,100',
      };

    case 'most-popular':
      return {
        ordering: '-added',
        page_size: 40,
      };

    case 'best-of-year':
      return {
        dates: `${currentYear}-01-01,${currentYear}-12-31`,
        ordering: '-metacritic',
        page_size: 40,
      };

    case 'upcoming':
      return {
        dates: `${today},${futureDate}`,
        ordering: '-added',
        page_size: 40,
      };

    // ── Platforms ────────────────────────────────────────────────────────────
    case 'pc':
      return {
        platforms: '4',
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '60,100',
      };

    case 'playstation':
      return {
        platforms: '187,18',
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '60,100',
      };

    case 'xbox':
      return {
        platforms: '186,1',
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '60,100',
      };

    case 'nintendo':
      return {
        platforms: '7',
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '60,100',
      };

    case 'android':
      return {
        platforms: '21',
        ordering: '-added',
        page_size: 40,
      };

    case 'ios':
      return {
        platforms: '3',
        ordering: '-added',
        page_size: 40,
      };

    case 'cross-platform':
      // Games with a high count of parent platforms indicate wide availability
      return {
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '70,100',
        // RAWG filter: parent_platforms covers major platform families
        parent_platforms: '1,2,3,4,5,6,7,8',
      };

    // ── Tags ─────────────────────────────────────────────────────────────────
    case 'free-to-play':
      return {
        tags: 'free-to-play',
        ordering: '-added',
        page_size: 40,
      };

    case 'multiplayer':
      return {
        tags: 'multiplayer',
        ordering: '-rating',
        page_size: 40,
      };

    case 'open-world':
      return {
        tags: 'open-world',
        ordering: '-rating',
        page_size: 40,
      };

    case 'story':
      return {
        tags: 'story-rich',
        ordering: '-rating',
        page_size: 40,
      };

    // ── Genres ───────────────────────────────────────────────────────────────
    case 'rpg':
      // RAWG genre ID 5 = Role Playing Games
      return {
        genres: '5',
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '60,100',
      };

    case 'action':
      // RAWG genre ID 4 = Action
      return {
        genres: '4',
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '60,100',
      };

    case 'shooter':
      // RAWG genre ID 2 = Shooter
      return {
        genres: '2',
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '60,100',
      };

    case 'racing':
      // RAWG genre ID 1 = Racing
      return {
        genres: '1',
        ordering: '-metacritic',
        page_size: 40,
      };

    case 'horror':
      // RAWG genre ID 19 = Family (Horror maps to this on RAWG; supplement with tag)
      return {
        genres: '19',
        tags: 'horror',
        ordering: '-metacritic',
        page_size: 40,
      };

    case 'strategy':
      // RAWG genre ID 10 = Strategy
      return {
        genres: '10',
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '60,100',
      };

    case 'sports':
      // RAWG genre ID 15 = Sports
      return {
        genres: '15',
        ordering: '-metacritic',
        page_size: 40,
      };

    case 'indie':
      // RAWG genre ID 51 = Indie
      return {
        genres: '51',
        ordering: '-rating',
        page_size: 40,
      };

    default:
      // Safe exhaustive fallback
      return {
        ordering: '-metacritic',
        page_size: 40,
        metacritic: '70,100',
      };
  }
}

// ---------------------------------------------------------------------------
// Human-readable labels & descriptions
// ---------------------------------------------------------------------------

const RANKING_META: Record<RankingCategory, { label: string; description: string }> = {
  'all-time': {
    label: 'All-Time Best',
    description: 'The highest-rated games ever made, across every platform and era',
  },
  'most-popular': {
    label: 'Most Popular',
    description: 'Games added by the most players — the pulse of the gaming community',
  },
  'best-of-year': {
    label: 'Best of the Year',
    description: `The highest-rated games released in ${new Date().getFullYear()}`,
  },
  upcoming: {
    label: 'Upcoming',
    description: 'Highly anticipated games arriving on the horizon',
  },
  pc: {
    label: 'Best on PC',
    description: 'Top-rated PC games ranked by critic and community scores',
  },
  playstation: {
    label: 'Best on PlayStation',
    description: 'The finest games available on PlayStation 4 and PlayStation 5',
  },
  xbox: {
    label: 'Best on Xbox',
    description: 'Top-rated titles across Xbox One and Xbox Series X/S',
  },
  nintendo: {
    label: 'Best on Nintendo Switch',
    description: 'The must-play games on Nintendo Switch',
  },
  android: {
    label: 'Best on Android',
    description: 'Top-rated games available on Android devices',
  },
  ios: {
    label: 'Best on iOS',
    description: 'Top-rated games for iPhone and iPad',
  },
  'cross-platform': {
    label: 'Cross-Platform',
    description: 'Outstanding games playable across multiple platforms',
  },
  'free-to-play': {
    label: 'Free to Play',
    description: 'The best free-to-play games — no upfront cost required',
  },
  multiplayer: {
    label: 'Multiplayer',
    description: 'Top-rated games built around multiplayer experiences',
  },
  'open-world': {
    label: 'Open World',
    description: 'The greatest open-world games for endless exploration',
  },
  story: {
    label: 'Story-Rich',
    description: 'Games celebrated for their unforgettable narratives',
  },
  rpg: {
    label: 'RPG',
    description: 'The deepest and most acclaimed role-playing games',
  },
  action: {
    label: 'Action',
    description: 'The finest action games ranked by critics and players',
  },
  shooter: {
    label: 'Shooters',
    description: 'Top-ranked first- and third-person shooters',
  },
  racing: {
    label: 'Racing',
    description: 'The fastest and most acclaimed racing games on any track',
  },
  horror: {
    label: 'Horror',
    description: 'The scariest and most acclaimed horror games',
  },
  strategy: {
    label: 'Strategy',
    description: 'Top strategy games that reward thinking over reflexes',
  },
  sports: {
    label: 'Sports',
    description: 'The best sports games from simulation to arcade',
  },
  indie: {
    label: 'Indie',
    description: 'Exceptional independent games loved by the community',
  },
};

/**
 * Returns the human-readable display label for a ranking category.
 */
export function getRankingLabel(category: RankingCategory): string {
  return RANKING_META[category]?.label ?? category;
}

/**
 * Returns the short description for a ranking category, used in meta tags
 * and page headers.
 */
export function getRankingDescription(category: RankingCategory): string {
  return RANKING_META[category]?.description ?? '';
}

// ---------------------------------------------------------------------------
// Sorting with GameRank algorithm
// ---------------------------------------------------------------------------

export type RankedGame = RAWGGame & { gameRankScore: GameRankScore };

/**
 * Applies the GameRank composite scoring algorithm to an array of games and
 * returns them sorted from highest to lowest score.
 *
 * The original game objects are not mutated; a new array of augmented objects
 * (with an additional `gameRankScore` property) is returned.
 */
export function sortGamesByGameRankScore(games: RAWGGame[]): RankedGame[] {
  return games
    .map((game) => ({
      ...game,
      gameRankScore: calculateGameRankScore(game),
    }))
    .sort((a, b) => b.gameRankScore.rawScore - a.gameRankScore.rawScore);
}
