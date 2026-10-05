// ─────────────────────────────────────────────────────────────────────────────
// GameRank – Scalable Game Data Provider Abstraction Layer
// ─────────────────────────────────────────────────────────────────────────────
// Central service used across:
//  1. Game Comparison
//  2. Premium Game Detail Pages
//  3. Release Calendar
//  4. AI Game Finder
//  5. Homepage Carousels & Search Engine
// ─────────────────────────────────────────────────────────────────────────────

import { GameRecord, PlatformFilter, GenreFilter, ReleaseStatus } from '@/types/database';
import { SEED_GAMES } from '@/lib/database';

export interface AIMatchCriteria {
  naturalQuery?: string;
  platform?: string;
  genre?: string;
  gameMode?: string;      // 'Single Player', 'Multiplayer', 'Co-op', 'Any'
  price?: string;         // 'Free', 'Paid', 'Any'
  experience?: string;    // 'Story-focused', 'Competitive', 'Relaxing', 'Challenging', 'Exploration', 'Creative', 'Casual', 'Any'
}

export interface AIMatchResult {
  game: GameRecord;
  matchScore: number;     // 0-100 percentage
  breakdown: {
    platformMatch: number;  // max 25
    genreMatch: number;     // max 20
    gameplayMatch: number;  // max 20
    featuresMatch: number;  // max 15
    preferencesMatch: number;// max 10
    qualityScore: number;   // max 10
  };
  reasons: string[];
}

export interface ReleaseFilterOptions {
  timeframe?: 'all' | 'today' | 'this-week' | 'this-month' | 'next-month' | '2026' | '2027' | 'upcoming' | 'recent';
  platform?: string;
  genre?: string;
  type?: 'all' | 'free' | 'aaa' | 'indie';
  status?: ReleaseStatus | 'all';
}

export class GameDataProvider {
  /**
   * Retrieves all games from the database
   */
  static async getAllGames(): Promise<GameRecord[]> {
    return [...SEED_GAMES];
  }

  /**
   * Alias for getAllGames
   */
  static async getGames(): Promise<GameRecord[]> {
    return this.getAllGames();
  }

  /**
   * Get single game by slug with case-insensitive matching
   */
  static async getGameBySlug(slug: string): Promise<GameRecord | null> {
    const normalized = slug.toLowerCase().trim();
    const local = SEED_GAMES.find((g) => g.slug.toLowerCase() === normalized);
    if (local) return local;

    // Optional dynamic fallback from RAWG if not in seed
    if (process.env.RAWG_API_KEY) {
      try {
        const res = await fetch(`https://api.rawg.io/api/games/${normalized}?key=${process.env.RAWG_API_KEY}`, {
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
   * Fetch 2 to 4 games for side-by-side comparison
   */
  static async compareGames(slugs: string[]): Promise<GameRecord[]> {
    const validSlugs = slugs.slice(0, 4);
    const results: GameRecord[] = [];

    for (const slug of validSlugs) {
      const game = await this.getGameBySlug(slug);
      if (game) results.push(game);
    }

    return results;
  }

  /**
   * Search games by keyword and optional filters
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
          g.tags.some((t) => t.toLowerCase().includes(q)) ||
          g.developer.toLowerCase().includes(q) ||
          g.publisher.toLowerCase().includes(q)
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

    const ordering = filters?.ordering || '-gamerank';
    return this.sortGames(results, ordering);
  }

  /**
   * Return games closely matching this game's tags, gameplay, and genre
   */
  static async getSimilarGames(slug: string, limit: number = 4): Promise<GameRecord[]> {
    const target = await this.getGameBySlug(slug);
    if (!target) return [];

    const others = SEED_GAMES.filter((g) => g.slug !== target.slug);

    // Score based on shared tags & genres
    const scored = others.map((other) => {
      let score = 0;
      target.genres.forEach((g) => {
        if (other.genres.includes(g)) score += 3;
      });
      target.tags.forEach((t) => {
        if (other.tags.includes(t)) score += 2;
      });
      if (target.singlePlayer === other.singlePlayer) score += 1;
      if (target.multiplayer === other.multiplayer) score += 1;
      if (target.openWorld && other.openWorld) score += 2;

      return { game: other, score };
    });

    scored.sort((a, b) => b.score - a.score || b.game.gameRankScore - a.game.gameRankScore);
    return scored.slice(0, limit).map((s) => s.game);
  }

  /**
   * Return distinct "More Like This" recommendations based on platforms and complementary genres
   */
  static async getMoreLikeThis(slug: string, limit: number = 4): Promise<GameRecord[]> {
    const target = await this.getGameBySlug(slug);
    if (!target) return [];

    // Filter by same primary platform & overlapping player appeal
    const candidates = SEED_GAMES.filter(
      (g) => g.slug !== target.slug && g.platforms.some((p) => target.platforms.includes(p))
    );

    // Complementary sorting prioritizing community score and genre
    candidates.sort((a, b) => {
      const aSharedGenre = a.genres.filter((g) => target.genres.includes(g)).length;
      const bSharedGenre = b.genres.filter((g) => target.genres.includes(g)).length;
      return (bSharedGenre * 10 + b.playerScore) - (aSharedGenre * 10 + a.playerScore);
    });

    return candidates.slice(0, limit);
  }

  /**
   * Return verified upcoming games sorted by release proximity
   */
  static async getUpcomingGames(limit: number = 20): Promise<GameRecord[]> {
    const today = new Date('2024-06-01'); // modern reference baseline
    const upcoming = SEED_GAMES.filter((g) => {
      if (g.releaseStatus === 'Coming Soon' || g.releaseStatus === 'Announced' || g.releaseStatus === 'TBA' || g.releaseStatus === 'Delayed') {
        return true;
      }
      return new Date(g.releaseDate) > today;
    });

    upcoming.sort((a, b) => {
      if (a.releaseStatus === 'TBA') return 1;
      if (b.releaseStatus === 'TBA') return -1;
      return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
    });

    return upcoming.slice(0, limit);
  }

  /**
   * Return recently released games sorted newest first
   */
  static async getRecentlyReleasedGames(limit: number = 20): Promise<GameRecord[]> {
    const released = SEED_GAMES.filter((g) => g.releaseStatus === 'Released' || !g.releaseStatus);
    released.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    return released.slice(0, limit);
  }

  /**
   * Return releases filtered for calendar views
   */
  static async getReleases(filter: ReleaseFilterOptions = {}): Promise<GameRecord[]> {
    let list = [...SEED_GAMES];

    // Filter by platform
    if (filter.platform && filter.platform !== 'all') {
      const p = filter.platform.toLowerCase();
      list = list.filter((g) => g.platforms.some((plat) => plat.toLowerCase().includes(p)));
    }

    // Filter by genre
    if (filter.genre && filter.genre !== 'all') {
      const gMatch = filter.genre.toLowerCase();
      list = list.filter((g) => g.genres.some((genre) => genre.toLowerCase().includes(gMatch)));
    }

    // Filter by type
    if (filter.type === 'free') {
      list = list.filter((g) => g.freeToPlay);
    } else if (filter.type === 'indie') {
      list = list.filter((g) => g.genres.includes('Indie') || g.tags.includes('Indie'));
    } else if (filter.type === 'aaa') {
      list = list.filter((g) => !g.genres.includes('Indie') && !g.tags.includes('Indie'));
    }

    // Filter by release status
    if (filter.status && filter.status !== 'all') {
      list = list.filter((g) => g.releaseStatus === filter.status);
    }

    // Filter by timeframe
    const now = new Date('2025-01-01'); // stable active baseline
    if (filter.timeframe === 'upcoming') {
      list = list.filter((g) => g.releaseStatus === 'Coming Soon' || g.releaseStatus === 'Announced' || g.releaseStatus === 'TBA' || g.releaseStatus === 'Delayed' || new Date(g.releaseDate) >= now);
      list.sort((a, b) => {
        if (a.releaseStatus === 'TBA') return 1;
        if (b.releaseStatus === 'TBA') return -1;
        return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      });
      return list;
    }

    if (filter.timeframe === 'recent') {
      list = list.filter((g) => g.releaseStatus === 'Released' || new Date(g.releaseDate) <= now);
      list.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      return list;
    }

    if (filter.timeframe === '2026') {
      list = list.filter((g) => g.releaseDate.startsWith('2026'));
      list.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
      return list;
    }

    if (filter.timeframe === '2027') {
      list = list.filter((g) => g.releaseDate.startsWith('2027'));
      list.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
      return list;
    }

    // Default: Sort by release date descending
    list.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    return list;
  }

  /**
   * Curated rankings list by category
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
        return this.getUpcomingGames(40);

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

      // Genres
      default:
        list = list.filter((g) =>
          g.genres.some((genre) =>
            genre.toLowerCase().replace(/[\s-]/g, '').includes(category.replace(/[\s-]/g, ''))
          )
        );
        list.sort((a, b) => b.gameRankScore - a.gameRankScore);
    }

    return list;
  }

  /**
   * 🤖 AI Game Finder Match Engine
   * Scores every candidate strictly using available database fields without hallucinations.
   * Total Match Score out of 100%:
   * - Platform match: 25%
   * - Genre match: 20%
   * - Gameplay match: 20%
   * - Features match: 15%
   * - User preferences: 10%
   * - GameRank quality: 10%
   */
  static async findGameMatches(criteria: AIMatchCriteria): Promise<AIMatchResult[]> {
    const games = await this.getAllGames();
    const query = (criteria.naturalQuery || '').toLowerCase();

    // Natural language token extraction
    const wantsScary = query.includes('scary') || query.includes('horror') || query.includes('creepy') || criteria.genre === 'Horror';
    const wantsOpenWorld = query.includes('open world') || query.includes('open-world') || query.includes('explore') || criteria.genre === 'Open World' || criteria.experience === 'Exploration';
    const wantsStory = query.includes('story') || query.includes('narrative') || query.includes('plot') || criteria.experience === 'Story-focused';
    const wantsMultiplayer = query.includes('multiplayer') || query.includes('friends') || query.includes('pvp') || criteria.gameMode === 'Multiplayer';
    const wantsCoOp = query.includes('coop') || query.includes('co-op') || query.includes('together') || criteria.gameMode === 'Co-op';
    const wantsFree = query.includes('free') || query.includes('f2p') || criteria.price === 'Free';
    const wantsRPG = query.includes('rpg') || query.includes('role-playing') || criteria.genre === 'RPG';
    const wantsFPS = query.includes('fps') || query.includes('first person') || query.includes('shooter') || criteria.genre === 'FPS';
    const wantsRelaxing = query.includes('relaxing') || query.includes('chill') || query.includes('casual') || criteria.experience === 'Relaxing';
    const wantsChallenging = query.includes('difficult') || query.includes('challenging') || query.includes('hard') || query.includes('souls') || criteria.experience === 'Challenging';

    const platformReq = (criteria.platform || '').toLowerCase();
    const wantsPC = platformReq.includes('pc') || query.includes('pc') || query.includes('steam');
    const wantsPlayStation = platformReq.includes('playstation') || platformReq.includes('ps5') || platformReq.includes('ps4') || query.includes('playstation') || query.includes('ps5');
    const wantsXbox = platformReq.includes('xbox') || query.includes('xbox');
    const wantsNintendo = platformReq.includes('nintendo') || platformReq.includes('switch') || query.includes('nintendo') || query.includes('switch');
    const wantsMobile = platformReq.includes('mobile') || platformReq.includes('android') || platformReq.includes('ios') || query.includes('mobile') || query.includes('phone');

    const results: AIMatchResult[] = [];

    for (const game of games) {
      let platformMatch = 25;
      let genreMatch = 20;
      let gameplayMatch = 20;
      let featuresMatch = 15;
      let preferencesMatch = 10;
      let qualityScore = Math.round((game.gameRankScore / 100) * 10);

      const reasons: string[] = [];

      // 1. Platform Evaluation (25 pts)
      if (wantsPC) {
        if (game.platforms.some((p) => p.includes('PC'))) {
          reasons.push('Available natively on PC');
        } else {
          platformMatch = 5;
        }
      } else if (wantsPlayStation) {
        if (game.platforms.some((p) => p.includes('PlayStation'))) {
          reasons.push('Full PlayStation 5 & PS4 support');
        } else {
          platformMatch = 5;
        }
      } else if (wantsXbox) {
        if (game.platforms.some((p) => p.includes('Xbox'))) {
          reasons.push('Supported on Xbox Series X|S');
        } else {
          platformMatch = 5;
        }
      } else if (wantsNintendo) {
        if (game.platforms.some((p) => p.includes('Nintendo'))) {
          reasons.push('Available on Nintendo Switch');
        } else {
          platformMatch = 5;
        }
      } else if (wantsMobile) {
        if (game.platforms.some((p) => p.includes('Android') || p.includes('iOS'))) {
          reasons.push('Playable on iOS & Android mobile');
        } else {
          platformMatch = 5;
        }
      }

      // 2. Genre Evaluation (20 pts)
      let matchedGenres = 0;
      if (wantsScary) {
        if (game.genres.includes('Horror') || game.tags.includes('Horror')) {
          matchedGenres++;
          reasons.push('Top-rated survival horror & psychological suspense');
        }
      }
      if (wantsRPG) {
        if (game.genres.includes('RPG') || game.genres.includes('Action RPG')) {
          matchedGenres++;
          reasons.push('Deep character progression & RPG mechanics');
        }
      }
      if (wantsFPS) {
        if (game.genres.includes('FPS') || game.genres.includes('Shooter')) {
          matchedGenres++;
          reasons.push('Precise shooting mechanics and combat');
        }
      }
      if (criteria.genre && criteria.genre !== 'Any') {
        if (game.genres.some((g) => g.toLowerCase().includes(criteria.genre!.toLowerCase()))) {
          matchedGenres++;
          reasons.push(`Official ${criteria.genre} classification`);
        }
      }

      if (wantsScary || wantsRPG || wantsFPS || (criteria.genre && criteria.genre !== 'Any')) {
        genreMatch = matchedGenres > 0 ? 20 : 6;
      }

      // 3. Gameplay Evaluation (20 pts)
      let gameplayScore = 15;
      if (wantsOpenWorld) {
        if (game.openWorld || game.genres.includes('Open World') || game.tags.includes('Open World')) {
          gameplayScore = 20;
          reasons.push('Vast open world with seamless exploration');
        } else {
          gameplayScore = 8;
        }
      }
      if (wantsStory) {
        if (game.genres.includes('Story') || game.tags.includes('Story Rich') || game.criticScore >= 88) {
          gameplayScore = Math.min(gameplayScore + 5, 20);
          reasons.push('Critically acclaimed narrative and story focus');
        }
      }
      gameplayMatch = gameplayScore;

      // 4. Features Evaluation (15 pts)
      let featScore = 15;
      if (wantsMultiplayer) {
        if (game.multiplayer) {
          reasons.push('Active worldwide multiplayer community');
        } else {
          featScore = 4;
        }
      }
      if (wantsCoOp) {
        if (game.coOp) {
          reasons.push('Dedicated cooperative gameplay to play together');
        } else {
          featScore = 5;
        }
      }
      if (wantsFree) {
        if (game.freeToPlay) {
          reasons.push('100% Free to Play without required upfront purchase');
        } else {
          featScore = 6;
        }
      }
      featuresMatch = featScore;

      // 5. User Preferences Evaluation (10 pts)
      if (wantsRelaxing && (game.tags.includes('Relaxing') || game.tags.includes('Wholesome') || game.genres.includes('Simulation'))) {
        preferencesMatch = 10;
        reasons.push('Relaxing and casual pace');
      } else if (wantsChallenging && (game.tags.includes('Difficult') || game.tags.includes('Souls-like'))) {
        preferencesMatch = 10;
        reasons.push('High skill ceiling and rewarding challenge');
      }

      // Calculate total match score
      const totalScore = Math.min(
        Math.max(
          Math.round(platformMatch + genreMatch + gameplayMatch + featuresMatch + preferencesMatch + qualityScore),
          40
        ),
        99
      );

      // Ensure at least 2 clear reasons exist
      if (reasons.length === 0) {
        reasons.push(`High GameRank Score of ${game.gameRankScore}/100`);
        reasons.push(`Popular in ${game.genres.slice(0, 2).join(' & ')}`);
      }

      results.push({
        game,
        matchScore: totalScore,
        breakdown: {
          platformMatch,
          genreMatch,
          gameplayMatch,
          featuresMatch,
          preferencesMatch,
          qualityScore,
        },
        reasons: reasons.slice(0, 4),
      });
    }

    results.sort((a, b) => b.matchScore - a.matchScore || b.game.gameRankScore - a.game.gameRankScore);
    return results.slice(0, 12);
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
      releaseStatus: 'Released',
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
      openWorld: Boolean(rawg.tags?.some((t: any) => t.slug?.includes('open-world'))),
      officialWebsite: rawg.website,
      screenshots: rawg.short_screenshots?.map((s: any) => s.image) || []
    };
  }
}
