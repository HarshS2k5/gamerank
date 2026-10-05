// ─────────────────────────────────────────────────────────────────────────────
// GameRank – Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RAWGGame, GameRankScore } from '@/types';

// ---------------------------------------------------------------------------
// Tailwind class helper
// ---------------------------------------------------------------------------

/**
 * Merges Tailwind CSS class names, resolving conflicts with tailwind-merge
 * and handling conditional classes with clsx.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Rating / score formatting
// ---------------------------------------------------------------------------

/**
 * Formats a numeric rating to one decimal place (e.g. 4.5 → "4.5").
 * Returns "N/A" if the value is falsy / NaN.
 */
export function formatRating(rating: number): string {
  if (!rating || isNaN(rating)) return 'N/A';
  return rating.toFixed(1);
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

/**
 * Parses a RAWG date string (YYYY-MM-DD) and returns a human-readable
 * representation like "October 26, 2023".
 * Returns "TBA" if the input is empty or invalid.
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'TBA';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'TBA';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------

/**
 * Converts arbitrary text into a URL-safe slug.
 * e.g. "The Witcher 3: Wild Hunt" → "the-witcher-3-wild-hunt"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove non-word chars (except hyphens)
    .replace(/[\s_]+/g, '-')    // spaces / underscores → hyphens
    .replace(/-+/g, '-')        // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');   // strip leading / trailing hyphens
}

// ---------------------------------------------------------------------------
// Metacritic colour coding
// ---------------------------------------------------------------------------

/**
 * Returns a Tailwind CSS text-colour class based on a Metacritic score.
 * ≥ 75 → green, ≥ 50 → yellow, < 50 → red, no score → grey.
 */
export function getMetacriticColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'text-gray-400';
  if (score >= 75) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * Returns a Tailwind CSS background-colour class for Metacritic badge rendering.
 */
export function getMetacriticBgColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'bg-gray-700';
  if (score >= 75) return 'bg-green-700';
  if (score >= 50) return 'bg-yellow-700';
  return 'bg-red-700';
}

// ---------------------------------------------------------------------------
// GameRank scoring algorithm
// ---------------------------------------------------------------------------

/**
 * Calculates the proprietary GameRank composite score for a single game.
 *
 * Score breakdown (100 points total):
 *  - criticScore     : up to 40 pts  (Metacritic / 100 × 40)
 *  - communityScore  : up to 30 pts  (RAWG rating / 5 × 30)
 *  - popularityScore : up to 20 pts  (ratings_count normalised to 50 000)
 *  - recencyBonus    : up to 10 pts  (games released in the last 3 years)
 */
export function calculateGameRankScore(game: RAWGGame): GameRankScore {
  // Critic score – 0-40 pts
  const criticScore =
    game.metacritic != null ? (game.metacritic / 100) * 40 : 0;

  // Community score – 0-30 pts (RAWG rating is 0-5)
  const communityScore = (game.rating / 5) * 30;

  // Popularity score – 0-20 pts (normalised against 50 000 ratings)
  const popularityScore = Math.min(game.ratings_count / 50_000, 1) * 20;

  // Recency bonus – 0-10 pts
  let recencyBonus = 0;
  if (game.released) {
    const releaseYear = new Date(game.released).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - releaseYear;

    if (age <= 0) {
      // Released this year or future
      recencyBonus = 10;
    } else if (age === 1) {
      recencyBonus = 8;
    } else if (age === 2) {
      recencyBonus = 5;
    } else if (age === 3) {
      recencyBonus = 2;
    }
    // Older than 3 years → 0 bonus
  }

  const rawScore = criticScore + communityScore + popularityScore + recencyBonus;
  const normalizedScore = Math.round(rawScore);

  return {
    rawScore,
    normalizedScore,
    components: {
      criticScore,
      communityScore,
      popularityScore,
      recencyBonus,
    },
  };
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

/**
 * Truncates text to `maxLength` characters, appending "…" when trimmed.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// ---------------------------------------------------------------------------
// Platform icons
// ---------------------------------------------------------------------------

const PLATFORM_ICON_MAP: Record<string, string> = {
  pc: '🖥️',
  windows: '🖥️',
  macos: '💻',
  mac: '💻',
  linux: '🐧',
  'playstation-5': '🎮',
  'playstation-4': '🎮',
  'playstation-3': '🎮',
  'playstation-2': '🎮',
  playstation: '🎮',
  'xbox-series-x': '🕹️',
  'xbox-one': '🕹️',
  'xbox-360': '🕹️',
  xbox: '🕹️',
  'nintendo-switch': '🕹️',
  'wii-u': '🕹️',
  wii: '🕹️',
  '3ds': '🕹️',
  android: '📱',
  ios: '📱',
  'apple-appstore': '📱',
  'google-play': '📱',
  web: '🌐',
  atari: '👾',
  'commodore-amiga': '👾',
  sega: '👾',
  neogeo: '👾',
};

/**
 * Returns an emoji icon for a given platform slug.
 * Falls back to 🎮 for unknown platforms.
 */
export function getPlatformIcon(platformSlug: string): string {
  const slug = platformSlug.toLowerCase();
  return PLATFORM_ICON_MAP[slug] ?? '🎮';
}

// ---------------------------------------------------------------------------
// Image URL helpers
// ---------------------------------------------------------------------------

/**
 * Returns a safe image URL, substituting a local fallback when the RAWG URL
 * is null / undefined.
 */
export function getImageUrl(
  url: string | null | undefined,
  fallback = '/images/placeholder-game.jpg',
): string {
  if (!url || url.trim() === '') return fallback;
  return url;
}

/**
 * Builds a RAWG image URL at a specific width via their crop API.
 * e.g. https://media.rawg.io/media/games/... → /resize/640/-/...
 */
export function getRawgCroppedImage(url: string | null | undefined, width = 640): string {
  if (!url) return '/images/placeholder-game.jpg';
  // RAWG supports /resize/<width>/ substitution in their media URLs
  return url.replace('/media/', `/media/resize/${width}/-/`);
}

// ---------------------------------------------------------------------------
// Number formatting
// ---------------------------------------------------------------------------

/**
 * Formats a large number with locale-appropriate thousands separators.
 * e.g. 1234567 → "1,234,567"
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Compact-formats large numbers for display in tight spaces.
 * e.g. 1500 → "1.5K", 2000000 → "2M"
 */
export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
