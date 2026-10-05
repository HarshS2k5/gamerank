// ─────────────────────────────────────────────────────────────────────────────
// GameRank – RAWG API Client  (SERVER SIDE ONLY)
// ─────────────────────────────────────────────────────────────────────────────
// This module MUST only be imported from API routes, Server Components, or
// server actions.  The RAWG_API_KEY environment variable is never sent to the
// browser.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  RAWGGame,
  RAWGGamesResponse,
  RAWGScreenshot,
  RAWGMovie,
  SearchFilters,
} from '@/types';
import { RAWG_BASE_URL, CACHE_TTL } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Reads the RAWG API key from the server environment.
 * Throws a descriptive error if it is missing so developers get immediate
 * feedback rather than a cryptic 401 from RAWG.
 */
function getApiKey(): string {
  const key = process.env.RAWG_API_KEY;
  if (!key || key.trim() === '') {
    throw new Error(
      '[GameRank] RAWG_API_KEY is not set in environment variables.\n' +
        'Add it to your .env.local file:\n\n' +
        '  RAWG_API_KEY=your_key_here\n\n' +
        'Get a free key at https://rawg.io/apidocs',
    );
  }
  return key;
}

/**
 * Core fetch wrapper for the RAWG REST API.
 *
 * Features:
 *  - Automatically injects the API key
 *  - Serialises arbitrary query params
 *  - 10-second AbortController timeout
 *  - Next.js `revalidate` cache tag via `fetch` options
 *  - Throws a typed error on non-2xx responses
 */
async function fetchRAWG<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
  revalidate: number = CACHE_TTL.rankingList,
): Promise<T> {
  const apiKey = getApiKey();

  const url = new URL(`${RAWG_BASE_URL}${endpoint}`);
  url.searchParams.set('key', apiKey);

  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `[GameRank] RAWG API error ${response.status} ${response.statusText} ` +
          `for ${endpoint}: ${body}`,
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`[GameRank] RAWG request timed out: ${endpoint}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---------------------------------------------------------------------------
// Public API helpers
// ---------------------------------------------------------------------------

/**
 * Fetches a paginated list of games with arbitrary RAWG query params.
 */
export async function getGames(
  params: Record<string, string | number | boolean> = {},
): Promise<RAWGGamesResponse> {
  return fetchRAWG<RAWGGamesResponse>('/games', params, CACHE_TTL.rankingList);
}

/**
 * Fetches the full detail object for a single game by its RAWG slug.
 */
export async function getGame(slug: string): Promise<RAWGGame> {
  return fetchRAWG<RAWGGame>(`/games/${slug}`, {}, CACHE_TTL.gameDetail);
}

/**
 * Fetches all screenshots for a given game slug.
 */
export async function getGameScreenshots(
  slug: string,
): Promise<{ results: RAWGScreenshot[] }> {
  return fetchRAWG<{ results: RAWGScreenshot[] }>(
    `/games/${slug}/screenshots`,
    {},
    CACHE_TTL.media,
  );
}

/**
 * Fetches all trailer / clip movies for a given game slug.
 */
export async function getGameMovies(
  slug: string,
): Promise<{ results: RAWGMovie[] }> {
  return fetchRAWG<{ results: RAWGMovie[] }>(
    `/games/${slug}/movies`,
    {},
    CACHE_TTL.media,
  );
}

/**
 * Fetches games that are similar to the given slug (RAWG "suggested" endpoint).
 */
export async function getSimilarGames(slug: string): Promise<RAWGGamesResponse> {
  return fetchRAWG<RAWGGamesResponse>(
    `/games/${slug}/suggested`,
    { page_size: 12 },
    CACHE_TTL.gameDetail,
  );
}

/**
 * Full-text game search with optional filters.
 */
export async function searchGames(
  query: string,
  filters: SearchFilters = {},
): Promise<RAWGGamesResponse> {
  const params: Record<string, string | number | boolean> = {
    search: query,
    page_size: filters.page_size ?? 20,
    search_precise: filters.search_precise ?? true,
    ...((filters.platforms !== undefined) && { platforms: filters.platforms }),
    ...((filters.genres !== undefined) && { genres: filters.genres }),
    ...((filters.tags !== undefined) && { tags: filters.tags }),
    ...((filters.ordering !== undefined) && { ordering: filters.ordering }),
    ...((filters.metacritic !== undefined) && { metacritic: filters.metacritic }),
    ...((filters.dates !== undefined) && { dates: filters.dates }),
    ...((filters.page !== undefined) && { page: filters.page }),
    ...((filters.exclude_additions !== undefined) && {
      exclude_additions: filters.exclude_additions,
    }),
  };

  return fetchRAWG<RAWGGamesResponse>('/games', params, CACHE_TTL.search);
}

/**
 * Returns the highest-rated games sorted by Metacritic score descending.
 */
export async function getTopGames(
  params: Record<string, string | number | boolean> = {},
): Promise<RAWGGamesResponse> {
  return fetchRAWG<RAWGGamesResponse>(
    '/games',
    {
      ordering: '-metacritic',
      page_size: 40,
      metacritic: '70,100',
      ...params,
    },
    CACHE_TTL.rankingList,
  );
}

/**
 * Returns games filtered to a specific RAWG platform ID.
 */
export async function getGamesByPlatform(
  platformId: number | string,
  params: Record<string, string | number | boolean> = {},
): Promise<RAWGGamesResponse> {
  return fetchRAWG<RAWGGamesResponse>(
    '/games',
    {
      platforms: String(platformId),
      ordering: '-metacritic',
      page_size: 40,
      metacritic: '60,100',
      ...params,
    },
    CACHE_TTL.rankingList,
  );
}

/**
 * Returns games filtered to a specific RAWG genre ID.
 */
export async function getGamesByGenre(
  genreId: number | string,
  params: Record<string, string | number | boolean> = {},
): Promise<RAWGGamesResponse> {
  return fetchRAWG<RAWGGamesResponse>(
    '/games',
    {
      genres: String(genreId),
      ordering: '-metacritic',
      page_size: 40,
      ...params,
    },
    CACHE_TTL.rankingList,
  );
}

/**
 * Returns games released within the last 90 days, newest first.
 */
export async function getNewReleases(): Promise<RAWGGamesResponse> {
  const today = new Date();
  const past = new Date();
  past.setDate(past.getDate() - 90);

  const dateRange = `${past.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`;

  return fetchRAWG<RAWGGamesResponse>(
    '/games',
    {
      dates: dateRange,
      ordering: '-released',
      page_size: 40,
    },
    CACHE_TTL.upcoming,
  );
}

/**
 * Returns games with a future release date, sorted by anticipated release.
 */
export async function getUpcomingGames(): Promise<RAWGGamesResponse> {
  const today = new Date();
  const future = new Date();
  future.setFullYear(future.getFullYear() + 2);

  const dateRange = `${today.toISOString().split('T')[0]},${future.toISOString().split('T')[0]}`;

  return fetchRAWG<RAWGGamesResponse>(
    '/games',
    {
      dates: dateRange,
      ordering: '-added',
      page_size: 40,
    },
    CACHE_TTL.upcoming,
  );
}

/**
 * Returns games that are currently trending – added by the most users recently.
 */
export async function getTrendingGames(): Promise<RAWGGamesResponse> {
  const today = new Date();
  const past = new Date();
  past.setDate(past.getDate() - 30);

  const dateRange = `${past.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`;

  return fetchRAWG<RAWGGamesResponse>(
    '/games',
    {
      dates: dateRange,
      ordering: '-added',
      page_size: 40,
    },
    CACHE_TTL.home,
  );
}

/**
 * Returns free-to-play games with a high community rating.
 */
export async function getFreeToPlayGames(): Promise<RAWGGamesResponse> {
  return fetchRAWG<RAWGGamesResponse>(
    '/games',
    {
      tags: 'free-to-play',
      ordering: '-rating',
      page_size: 40,
    },
    CACHE_TTL.rankingList,
  );
}
