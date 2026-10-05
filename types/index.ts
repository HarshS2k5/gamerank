// ─────────────────────────────────────────────────────────────────────────────
// GameRank – Global TypeScript Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// RAWG API – Shared sub-types
// ---------------------------------------------------------------------------

export interface RAWGPlatform {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  year_end: number | null;
  year_start: number | null;
  games_count: number;
  image_background: string;
}

export interface RAWGGenre {
  id: number;
  slug: string;
  name: string;
  games_count: number;
  image_background: string;
}

export interface RAWGTag {
  id: number;
  slug: string;
  name: string;
  language: string;
  games_count: number;
  image_background: string;
}

export interface RAWGDeveloper {
  id: number;
  slug: string;
  name: string;
  games_count: number;
  image_background: string;
}

export interface RAWGPublisher {
  id: number;
  slug: string;
  name: string;
  games_count: number;
  image_background: string;
}

export interface RAWGScreenshot {
  id: number;
  image: string;
  width: number;
  height: number;
  is_deleted: boolean;
}

export interface RAWGMovieData {
  480: string;
  max: string;
}

export interface RAWGMovie {
  id: number;
  name: string;
  preview: string;
  data: RAWGMovieData;
}

export interface RAWGRating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

export interface RAWGEsrbRating {
  id: number;
  slug: string;
  name: string;
}

export interface RAWGPlatformEntry {
  platform: RAWGPlatform;
  released_at: string | null;
  requirements_en: { minimum?: string; recommended?: string } | null;
  requirements_ru: { minimum?: string; recommended?: string } | null;
}

export interface RAWGParentPlatform {
  platform: {
    id: number;
    slug: string;
    name: string;
  };
}

export interface RAWGStoreEntry {
  id: number;
  url: string;
  store: {
    id: number;
    slug: string;
    name: string;
    domain: string;
    games_count: number;
    image_background: string;
  };
}

// ---------------------------------------------------------------------------
// RAWG API – Core game object
// ---------------------------------------------------------------------------

export interface RAWGGame {
  id: number;
  slug: string;
  name: string;
  name_original: string;
  description: string;
  description_raw: string;
  metacritic: number | null;
  released: string | null;
  background_image: string | null;
  background_image_additional: string | null;
  website: string;
  rating: number;
  rating_top: number;
  ratings: RAWGRating[];
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  playtime: number;
  screenshots_count: number;
  movies_count: number;
  creators_count: number;
  achievements_count: number;
  parent_achievements_count: number;
  reddit_url: string;
  reddit_name: string;
  reddit_description: string;
  reddit_logo: string;
  reddit_count: number;
  twitch_count: number;
  youtube_count: number;
  reviews_count: number;
  community_rating: number | null;
  saturated_color: string;
  dominant_color: string;
  platforms: RAWGPlatformEntry[] | null;
  parent_platforms: RAWGParentPlatform[] | null;
  genres: RAWGGenre[];
  stores: RAWGStoreEntry[] | null;
  tags: RAWGTag[] | null;
  esrb_rating: RAWGEsrbRating | null;
  developers: RAWGDeveloper[];
  publishers: RAWGPublisher[];
}

// ---------------------------------------------------------------------------
// RAWG API – Paginated response
// ---------------------------------------------------------------------------

export interface RAWGGamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RAWGGame[];
}

// ---------------------------------------------------------------------------
// GameRank – Scoring algorithm output
// ---------------------------------------------------------------------------

export interface GameRankScore {
  rawScore: number;
  normalizedScore: number;
  components: {
    criticScore: number;
    communityScore: number;
    popularityScore: number;
    recencyBonus: number;
  };
}

// ---------------------------------------------------------------------------
// GameRank – Ranking categories
// ---------------------------------------------------------------------------

export type RankingCategory =
  | 'all-time'
  | 'pc'
  | 'android'
  | 'ios'
  | 'playstation'
  | 'xbox'
  | 'nintendo'
  | 'cross-platform'
  | 'free-to-play'
  | 'multiplayer'
  | 'open-world'
  | 'story'
  | 'rpg'
  | 'action'
  | 'shooter'
  | 'racing'
  | 'horror'
  | 'strategy'
  | 'sports'
  | 'indie'
  | 'best-of-year'
  | 'most-popular'
  | 'upcoming';

// ---------------------------------------------------------------------------
// GameRank – Search & filtering
// ---------------------------------------------------------------------------

export interface SearchFilters {
  platforms?: string | number;
  genres?: string | number;
  tags?: string;
  dates?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  metacritic?: string;
  exclude_additions?: boolean;
  search_precise?: boolean;
}

// ---------------------------------------------------------------------------
// GameRank – Platform display metadata
// ---------------------------------------------------------------------------

export interface PlatformInfo {
  id: number;
  name: string;
  slug: string;
  icon: string;
}
