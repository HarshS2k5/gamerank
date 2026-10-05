// ─────────────────────────────────────────────────────────────────────────────
// GameRank – Application-wide Constants
// ─────────────────────────────────────────────────────────────────────────────

import type { PlatformInfo, RankingCategory } from '@/types';

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export const RAWG_BASE_URL = 'https://api.rawg.io/api';

// ---------------------------------------------------------------------------
// Site metadata
// ---------------------------------------------------------------------------

export const SITE_NAME = 'GameRank';

export const SITE_DESCRIPTION =
  'Discover, rank, and explore the best video games across every platform and genre. GameRank combines critic scores, community ratings, and popularity data to surface the games worth your time.';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gamerank-one.vercel.app';

// ---------------------------------------------------------------------------
// RAWG platform IDs
// ---------------------------------------------------------------------------

export const PLATFORM_IDS: Record<string, number> = {
  pc: 4,
  android: 21,
  ios: 3,
  'playstation-4': 18,
  'playstation-5': 187,
  'xbox-one': 1,
  'xbox-series': 186,
  'nintendo-switch': 7,
  macos: 5,
  linux: 6,
  'web': 171,
};

// ---------------------------------------------------------------------------
// RAWG genre IDs (as returned by /genres endpoint)
// ---------------------------------------------------------------------------

export const GENRE_IDS: Record<string, number> = {
  action: 4,
  indie: 51,
  adventure: 3,
  rpg: 5,
  strategy: 10,
  shooter: 2,
  casual: 40,
  simulation: 14,
  puzzle: 7,
  arcade: 11,
  platformer: 83,
  racing: 1,
  'massively-multiplayer': 59,
  sports: 15,
  fighting: 6,
  family: 19,
  'board-games': 28,
  educational: 34,
  card: 17,
};

// ---------------------------------------------------------------------------
// Platform display info (shown in UI)
// ---------------------------------------------------------------------------

export const PLATFORM_DISPLAY: PlatformInfo[] = [
  { id: 4,   name: 'PC',              slug: 'pc',            icon: '🖥️'  },
  { id: 18,  name: 'PlayStation 4',   slug: 'playstation-4', icon: '🎮'  },
  { id: 187, name: 'PlayStation 5',   slug: 'playstation-5', icon: '🎮'  },
  { id: 1,   name: 'Xbox One',        slug: 'xbox-one',      icon: '🕹️'  },
  { id: 186, name: 'Xbox Series X/S', slug: 'xbox-series',   icon: '🕹️'  },
  { id: 7,   name: 'Nintendo Switch', slug: 'nintendo-switch',icon: '🕹️' },
  { id: 21,  name: 'Android',         slug: 'android',       icon: '📱'  },
  { id: 3,   name: 'iOS',             slug: 'ios',           icon: '📱'  },
  { id: 5,   name: 'macOS',           slug: 'macos',         icon: '💻'  },
  { id: 6,   name: 'Linux',           slug: 'linux',         icon: '🐧'  },
];

// ---------------------------------------------------------------------------
// Genre display info (shown in UI)
// ---------------------------------------------------------------------------

export const GENRE_DISPLAY: Array<{ name: string; slug: string; icon: string }> = [
  { name: 'Action',             slug: 'action',              icon: '⚔️'  },
  { name: 'RPG',                slug: 'rpg',                 icon: '🧙'  },
  { name: 'Shooter',            slug: 'shooter',             icon: '🔫'  },
  { name: 'Strategy',           slug: 'strategy',            icon: '♟️'  },
  { name: 'Adventure',          slug: 'adventure',           icon: '🗺️'  },
  { name: 'Indie',              slug: 'indie',               icon: '🎨'  },
  { name: 'Sports',             slug: 'sports',              icon: '⚽'  },
  { name: 'Racing',             slug: 'racing',              icon: '🏎️'  },
  { name: 'Simulation',         slug: 'simulation',          icon: '🏗️'  },
  { name: 'Puzzle',             slug: 'puzzle',              icon: '🧩'  },
  { name: 'Platformer',         slug: 'platformer',          icon: '🏃'  },
  { name: 'Fighting',           slug: 'fighting',            icon: '🥊'  },
  { name: 'Family',             slug: 'family',              icon: '👨‍👩‍👧‍👦' },
  { name: 'Casual',             slug: 'casual',              icon: '🎲'  },
  { name: 'Massively Multiplayer', slug: 'massively-multiplayer', icon: '🌐' },
];

// ---------------------------------------------------------------------------
// Ranking categories
// ---------------------------------------------------------------------------

export const RANKING_CATEGORIES: Array<{
  id: RankingCategory;
  label: string;
  description: string;
}> = [
  {
    id: 'all-time',
    label: 'All-Time Best',
    description: 'The highest-rated games in history across all platforms',
  },
  {
    id: 'best-of-year',
    label: 'Best of the Year',
    description: "The top-rated games released this year",
  },
  {
    id: 'most-popular',
    label: 'Most Popular',
    description: 'Games with the largest and most engaged player communities',
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    description: 'Highly anticipated games releasing soon',
  },
  {
    id: 'pc',
    label: 'Best on PC',
    description: 'Top-rated games available on PC',
  },
  {
    id: 'playstation',
    label: 'Best on PlayStation',
    description: 'Top-rated games on PlayStation 4 & 5',
  },
  {
    id: 'xbox',
    label: 'Best on Xbox',
    description: 'Top-rated games on Xbox One & Series X/S',
  },
  {
    id: 'nintendo',
    label: 'Best on Nintendo',
    description: 'Top-rated games on Nintendo Switch',
  },
  {
    id: 'android',
    label: 'Best on Android',
    description: 'Top-rated games on Android mobile devices',
  },
  {
    id: 'ios',
    label: 'Best on iOS',
    description: 'Top-rated games on iPhone & iPad',
  },
  {
    id: 'cross-platform',
    label: 'Cross-Platform',
    description: 'Great games available on multiple platforms',
  },
  {
    id: 'free-to-play',
    label: 'Free to Play',
    description: 'The best free-to-play games you can start right now',
  },
  {
    id: 'multiplayer',
    label: 'Multiplayer',
    description: 'Top-rated games with multiplayer support',
  },
  {
    id: 'open-world',
    label: 'Open World',
    description: 'The best open-world adventures to explore',
  },
  {
    id: 'story',
    label: 'Story-Rich',
    description: 'Games celebrated for their compelling narratives',
  },
  {
    id: 'rpg',
    label: 'RPG',
    description: 'The highest-rated role-playing games',
  },
  {
    id: 'action',
    label: 'Action',
    description: 'The best action games ranked by critic and community scores',
  },
  {
    id: 'shooter',
    label: 'Shooter',
    description: 'Top-rated first- and third-person shooters',
  },
  {
    id: 'racing',
    label: 'Racing',
    description: 'The fastest and most acclaimed racing games',
  },
  {
    id: 'horror',
    label: 'Horror',
    description: 'The scariest and highest-rated horror experiences',
  },
  {
    id: 'strategy',
    label: 'Strategy',
    description: 'Top strategy games that test your mind',
  },
  {
    id: 'sports',
    label: 'Sports',
    description: 'The best sports simulation and arcade games',
  },
  {
    id: 'indie',
    label: 'Indie',
    description: 'Outstanding independent games ranked by community love',
  },
];

// ---------------------------------------------------------------------------
// Cache TTL values (seconds)
// ---------------------------------------------------------------------------

export const CACHE_TTL = {
  /** Static game detail pages – refresh every hour */
  gameDetail: 3600,
  /** Ranking lists – refresh every 30 minutes */
  rankingList: 1800,
  /** Search results – short cache, 5 minutes */
  search: 300,
  /** Home page hero data – 15 minutes */
  home: 900,
  /** Screenshots / movies – very stable, 6 hours */
  media: 21600,
  /** Upcoming games – changes often, 10 minutes */
  upcoming: 600,
} as const;
