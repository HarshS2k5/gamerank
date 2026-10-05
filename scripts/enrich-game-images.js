const fs = require('fs');
const path = require('path');
const https = require('https');

// Mapping of Steam App IDs for PC/Multiplatform games
const STEAM_APPS = {
  'elden-ring': 1245620,
  'grand-theft-auto-v': 271590,
  'red-dead-redemption-2': 1174180,
  'the-witcher-3-wild-hunt': 292030,
  'cyberpunk-2077': 1091500,
  'baldurs-gate-3': 1086940,
  'god-of-war-ragnarok': 2322010,
  'hades-ii': 1145350,
  'hollow-knight': 367520,
  'terraria': 105600,
  'counter-strike-2': 730,
  'apex-legends': 1172470,
  'forza-horizon-5': 1551360,
  'resident-evil-4': 2050650,
  'stardew-valley': 413150,
  'dark-souls-iii': 374320,
  'sekiro-shadows-die-twice': 814380,
  'hogwarts-legacy': 990080,
  'ghost-of-tsushima': 2215430,
  'the-last-of-us-part-i': 1888930,
  'street-fighter-6': 1364780,
  'tekken-8': 1778820,
  'cuphead': 268910,
  'celeste': 504230,
  'dota-2': 570,
  'overwatch-2': 2357570,
  'ea-sports-fc-24': 2195250,
  'rocket-league': 252950,
  'monster-hunter-wilds': 2246340,
  'hollow-knight-silksong': 1030300,
};

// Curated high-res assets for non-Steam & exclusive titles
const CUSTOM_ASSETS = {
  'minecraft': {
    cover: 'https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf7537d14210d52.jpg',
    bg: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf7537d14210d52.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/0aa/0aa06d9d023f0340c268046b07d6c6e7.jpg',
      'https://media.rawg.io/media/screenshots/92e/92e0082c448bb957b42cefb6b876fc62.jpg',
      'https://media.rawg.io/media/screenshots/115/11579a4918e954c25607b309f7a552fd.jpg',
      'https://media.rawg.io/media/screenshots/452/452ec872da6aebf1ce7c83f9dd40fd05.jpg'
    ]
  },
  'the-legend-of-zelda-tears-of-the-kingdom': {
    cover: 'https://media.rawg.io/media/games/5ec/5ecac83024ec31b5b304e01f2d665559.jpg',
    bg: 'https://media.rawg.io/media/screenshots/762/7629b398863f91572c57eb3c5f5fb8cf.jpg',
    thumb: 'https://media.rawg.io/media/games/5ec/5ecac83024ec31b5b304e01f2d665559.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/762/7629b398863f91572c57eb3c5f5fb8cf.jpg',
      'https://media.rawg.io/media/screenshots/9e9/9e9db6777c223c3fe796ceea03ad6f95.jpg',
      'https://media.rawg.io/media/screenshots/f63/f63a833503f848cbca1965bb742918df.jpg',
      'https://media.rawg.io/media/screenshots/c5f/c5f850d96d99ef824a737f5b4df29c3d.jpg'
    ]
  },
  'super-mario-odyssey': {
    cover: 'https://media.rawg.io/media/games/e88/e88373d49ec233827ecf0e74b8fb4e0b.jpg',
    bg: 'https://media.rawg.io/media/screenshots/003/003d7c57ef228b3cf17d59855590a218.jpg',
    thumb: 'https://media.rawg.io/media/games/e88/e88373d49ec233827ecf0e74b8fb4e0b.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/003/003d7c57ef228b3cf17d59855590a218.jpg',
      'https://media.rawg.io/media/screenshots/599/599a0933cb6ef8e137119e7e721d23aa.jpg',
      'https://media.rawg.io/media/screenshots/d5c/d5cf9a60e0a514d339243451737e41ef.jpg',
      'https://media.rawg.io/media/screenshots/c4f/c4f2bbcfcf60d3d37c8670bf67995f51.jpg'
    ]
  },
  'marvels-spider-man-2': {
    cover: 'https://media.rawg.io/media/games/047/04702170cc72186987f2ffb9148d6139.jpg',
    bg: 'https://media.rawg.io/media/screenshots/5bf/5bf7d6eeab4743ec11b6da4d6ab3aaec.jpg',
    thumb: 'https://media.rawg.io/media/games/047/04702170cc72186987f2ffb9148d6139.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/5bf/5bf7d6eeab4743ec11b6da4d6ab3aaec.jpg',
      'https://media.rawg.io/media/screenshots/02c/02c38ce027bb39fe753966fb9c5b2a3a.jpg',
      'https://media.rawg.io/media/screenshots/bdc/bdc68c34c44933a3c9489f41d9ef1154.jpg',
      'https://media.rawg.io/media/screenshots/4fe/4feb800e4708ff82a3962d3a37ea818d.jpg'
    ]
  },
  'fortnite': {
    cover: 'https://media.rawg.io/media/games/d2c/d2c7423d64da86ab368440bc332eaab6.jpg',
    bg: 'https://media.rawg.io/media/screenshots/88c/88c1b3f9bfcb483189914436ae05d7b8.jpg',
    thumb: 'https://media.rawg.io/media/games/d2c/d2c7423d64da86ab368440bc332eaab6.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/88c/88c1b3f9bfcb483189914436ae05d7b8.jpg',
      'https://media.rawg.io/media/screenshots/600/6007ecad76ca6fc8deaa12ef54f43ec8.jpg',
      'https://media.rawg.io/media/screenshots/9d7/9d7a2fa349bb27a8dc7bbfecf8a8461b.jpg',
      'https://media.rawg.io/media/screenshots/762/762514101e4835848529aaae173c3ee9.jpg'
    ]
  },
  'grand-theft-auto-vi': {
    cover: 'https://media.rawg.io/media/games/22f/22f30ae2572c833215c2ec4df3d01309.jpg',
    bg: 'https://media.rawg.io/media/screenshots/a7c/a7c438f4066e52011484d0089e023192.jpg',
    thumb: 'https://media.rawg.io/media/games/22f/22f30ae2572c833215c2ec4df3d01309.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/a7c/a7c438f4066e52011484d0089e023192.jpg',
      'https://media.rawg.io/media/screenshots/1dc/1dcd95033c46b95b87198ba29d6dca33.jpg',
      'https://media.rawg.io/media/screenshots/256/25603831828f237efb9933ae38965021.jpg',
      'https://media.rawg.io/media/screenshots/43b/43ba45cf4aa76be4608c02c462ea09e9.jpg'
    ]
  },
  'doom-the-dark-ages': {
    cover: 'https://media.rawg.io/media/games/7cf/7cfc2a0468a35607b38cb7ffc0a52df2.jpg',
    bg: 'https://media.rawg.io/media/screenshots/923/923058866e4a29a8a7fe7159c5d13a96.jpg',
    thumb: 'https://media.rawg.io/media/games/7cf/7cfc2a0468a35607b38cb7ffc0a52df2.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/923/923058866e4a29a8a7fe7159c5d13a96.jpg',
      'https://media.rawg.io/media/screenshots/2c4/2c4d924d5462cf1b54a6521bc279fb04.jpg',
      'https://media.rawg.io/media/screenshots/59f/59f8c691f18fc43cfc0ec8eb7c22ee3a.jpg',
      'https://media.rawg.io/media/screenshots/1ac/1ac19f174714b23323bc57adc8e76ac6.jpg'
    ]
  },
  'metroid-prime-4-beyond': {
    cover: 'https://media.rawg.io/media/games/390/3900fecfa90dfd0a927fa1c480111f18.jpg',
    bg: 'https://media.rawg.io/media/screenshots/03c/03c513200ff7e2f98647dc51372e61df.jpg',
    thumb: 'https://media.rawg.io/media/games/390/3900fecfa90dfd0a927fa1c480111f18.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/03c/03c513200ff7e2f98647dc51372e61df.jpg',
      'https://media.rawg.io/media/screenshots/762/7629b398863f91572c57eb3c5f5fb8cf.jpg',
      'https://media.rawg.io/media/screenshots/9e9/9e9db6777c223c3fe796ceea03ad6f95.jpg',
      'https://media.rawg.io/media/screenshots/f63/f63a833503f848cbca1965bb742918df.jpg'
    ]
  },
  'death-stranding-2-on-the-beach': {
    cover: 'https://media.rawg.io/media/games/28b/28ba730cfec9e755fe1d454fa3fb6c6f.jpg',
    bg: 'https://media.rawg.io/media/screenshots/2c4/2c4d924d5462cf1b54a6521bc279fb04.jpg',
    thumb: 'https://media.rawg.io/media/games/28b/28ba730cfec9e755fe1d454fa3fb6c6f.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/2c4/2c4d924d5462cf1b54a6521bc279fb04.jpg',
      'https://media.rawg.io/media/screenshots/59f/59f8c691f18fc43cfc0ec8eb7c22ee3a.jpg',
      'https://media.rawg.io/media/screenshots/1ac/1ac19f174714b23323bc57adc8e76ac6.jpg',
      'https://media.rawg.io/media/screenshots/0aa/0aa06d9d023f0340c268046b07d6c6e7.jpg'
    ]
  },
  'the-witcher-4-polaris': {
    cover: 'https://media.rawg.io/media/games/569/5699479b4a4d67362bb2b451c8cc9300.jpg',
    bg: 'https://media.rawg.io/media/screenshots/1ac/1ac19f174714b23323bc57adc8e76ac6.jpg',
    thumb: 'https://media.rawg.io/media/games/569/5699479b4a4d67362bb2b451c8cc9300.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/1ac/1ac19f174714b23323bc57adc8e76ac6.jpg',
      'https://media.rawg.io/media/screenshots/2c4/2c4d924d5462cf1b54a6521bc279fb04.jpg',
      'https://media.rawg.io/media/screenshots/59f/59f8c691f18fc43cfc0ec8eb7c22ee3a.jpg',
      'https://media.rawg.io/media/screenshots/923/923058866e4a29a8a7fe7159c5d13a96.jpg'
    ]
  },
  'valorant': {
    cover: 'https://media.rawg.io/media/games/0f5/0f5f7a3da44e05b7623127a808d64779.jpg',
    bg: 'https://media.rawg.io/media/screenshots/957/957c7d1e847c21e7d0e408ec21c17ee1.jpg',
    thumb: 'https://media.rawg.io/media/games/0f5/0f5f7a3da44e05b7623127a808d64779.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/957/957c7d1e847c21e7d0e408ec21c17ee1.jpg',
      'https://media.rawg.io/media/screenshots/5bf/5bf7d6eeab4743ec11b6da4d6ab3aaec.jpg',
      'https://media.rawg.io/media/screenshots/02c/02c38ce027bb39fe753966fb9c5b2a3a.jpg',
      'https://media.rawg.io/media/screenshots/88c/88c1b3f9bfcb483189914436ae05d7b8.jpg'
    ]
  },
  'genshin-impact': {
    cover: 'https://media.rawg.io/media/games/d1f/d1f86641e62686f0aa67434e350523e1.jpg',
    bg: 'https://media.rawg.io/media/screenshots/599/5998a13cb09fbe7982299da7863cbff8.jpg',
    thumb: 'https://media.rawg.io/media/games/d1f/d1f86641e62686f0aa67434e350523e1.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/599/5998a13cb09fbe7982299da7863cbff8.jpg',
      'https://media.rawg.io/media/screenshots/003/003d7c57ef228b3cf17d59855590a218.jpg',
      'https://media.rawg.io/media/screenshots/762/7629b398863f91572c57eb3c5f5fb8cf.jpg',
      'https://media.rawg.io/media/screenshots/9e9/9e9db6777c223c3fe796ceea03ad6f95.jpg'
    ]
  },
  'honkai-star-rail': {
    cover: 'https://media.rawg.io/media/games/9b1/9b1b7774ba713eb731f24cd9a3cb71c7.jpg',
    bg: 'https://media.rawg.io/media/screenshots/882/8824141d4f24ef3b174246fe136692aa.jpg',
    thumb: 'https://media.rawg.io/media/games/9b1/9b1b7774ba713eb731f24cd9a3cb71c7.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/882/8824141d4f24ef3b174246fe136692aa.jpg',
      'https://media.rawg.io/media/screenshots/599/5998a13cb09fbe7982299da7863cbff8.jpg',
      'https://media.rawg.io/media/screenshots/bdc/bdc68c34c44933a3c9489f41d9ef1154.jpg',
      'https://media.rawg.io/media/screenshots/4fe/4feb800e4708ff82a3962d3a37ea818d.jpg'
    ]
  },
  'wuthering-waves': {
    cover: 'https://media.rawg.io/media/games/7c9/7c9f807f35bbf1bb5723b7e7c813d94d.jpg',
    bg: 'https://media.rawg.io/media/screenshots/599/5998a13cb09fbe7982299da7863cbff8.jpg',
    thumb: 'https://media.rawg.io/media/games/7c9/7c9f807f35bbf1bb5723b7e7c813d94d.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/599/5998a13cb09fbe7982299da7863cbff8.jpg',
      'https://media.rawg.io/media/screenshots/882/8824141d4f24ef3b174246fe136692aa.jpg',
      'https://media.rawg.io/media/screenshots/003/003d7c57ef228b3cf17d59855590a218.jpg',
      'https://media.rawg.io/media/screenshots/762/7629b398863f91572c57eb3c5f5fb8cf.jpg'
    ]
  },
  'clash-of-clans': {
    cover: 'https://media.rawg.io/media/games/1a7/1a74d28434316d414a3861c8a6fcf4a3.jpg',
    bg: 'https://media.rawg.io/media/screenshots/d5c/d5cf9a60e0a514d339243451737e41ef.jpg',
    thumb: 'https://media.rawg.io/media/games/1a7/1a74d28434316d414a3861c8a6fcf4a3.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/d5c/d5cf9a60e0a514d339243451737e41ef.jpg',
      'https://media.rawg.io/media/screenshots/c4f/c4f2bbcfcf60d3d37c8670bf67995f51.jpg',
      'https://media.rawg.io/media/screenshots/599/599a0933cb6ef8e137119e7e721d23aa.jpg',
      'https://media.rawg.io/media/screenshots/003/003d7c57ef228b3cf17d59855590a218.jpg'
    ]
  },
  'brawl-stars': {
    cover: 'https://media.rawg.io/media/games/89a/89a5840d42646ae1a8e2cb92a2a0d922.jpg',
    bg: 'https://media.rawg.io/media/screenshots/c4f/c4f2bbcfcf60d3d37c8670bf67995f51.jpg',
    thumb: 'https://media.rawg.io/media/games/89a/89a5840d42646ae1a8e2cb92a2a0d922.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/c4f/c4f2bbcfcf60d3d37c8670bf67995f51.jpg',
      'https://media.rawg.io/media/screenshots/d5c/d5cf9a60e0a514d339243451737e41ef.jpg',
      'https://media.rawg.io/media/screenshots/599/599a0933cb6ef8e137119e7e721d23aa.jpg',
      'https://media.rawg.io/media/screenshots/003/003d7c57ef228b3cf17d59855590a218.jpg'
    ]
  },
  'subway-surfers': {
    cover: 'https://media.rawg.io/media/games/d07/d07e60155b9e4a362bfcf90e4f8d9f04.jpg',
    bg: 'https://media.rawg.io/media/screenshots/452/452ec872da6aebf1ce7c83f9dd40fd05.jpg',
    thumb: 'https://media.rawg.io/media/games/d07/d07e60155b9e4a362bfcf90e4f8d9f04.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/452/452ec872da6aebf1ce7c83f9dd40fd05.jpg',
      'https://media.rawg.io/media/screenshots/0aa/0aa06d9d023f0340c268046b07d6c6e7.jpg',
      'https://media.rawg.io/media/screenshots/92e/92e0082c448bb957b42cefb6b876fc62.jpg',
      'https://media.rawg.io/media/screenshots/115/11579a4918e954c25607b309f7a552fd.jpg'
    ]
  },
  'pokemon-go': {
    cover: 'https://media.rawg.io/media/games/020/020df115e5d3c829e1eb61df18f29ea6.jpg',
    bg: 'https://media.rawg.io/media/screenshots/762/762514101e4835848529aaae173c3ee9.jpg',
    thumb: 'https://media.rawg.io/media/games/020/020df115e5d3c829e1eb61df18f29ea6.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/762/762514101e4835848529aaae173c3ee9.jpg',
      'https://media.rawg.io/media/screenshots/88c/88c1b3f9bfcb483189914436ae05d7b8.jpg',
      'https://media.rawg.io/media/screenshots/600/6007ecad76ca6fc8deaa12ef54f43ec8.jpg',
      'https://media.rawg.io/media/screenshots/9d7/9d7a2fa349bb27a8dc7bbfecf8a8461b.jpg'
    ]
  },
  'league-of-legends': {
    cover: 'https://media.rawg.io/media/games/78b/78bc81e247fc7e1b8da1ce68025e50c4.jpg',
    bg: 'https://media.rawg.io/media/screenshots/1fd/1fd874744d081f9a2d88c222ffc324c4.jpg',
    thumb: 'https://media.rawg.io/media/games/78b/78bc81e247fc7e1b8da1ce68025e50c4.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/1fd/1fd874744d081f9a2d88c222ffc324c4.jpg',
      'https://media.rawg.io/media/screenshots/957/957c7d1e847c21e7d0e408ec21c17ee1.jpg',
      'https://media.rawg.io/media/screenshots/5bf/5bf7d6eeab4743ec11b6da4d6ab3aaec.jpg',
      'https://media.rawg.io/media/screenshots/02c/02c38ce027bb39fe753966fb9c5b2a3a.jpg'
    ]
  },
  'roblox': {
    cover: 'https://media.rawg.io/media/games/35b/35b47c4d7976da33455d3d4d1ec16410.jpg',
    bg: 'https://media.rawg.io/media/screenshots/1ac/1ac19f174714b23323bc57adc8e76ac6.jpg',
    thumb: 'https://media.rawg.io/media/games/35b/35b47c4d7976da33455d3d4d1ec16410.jpg',
    shots: [
      'https://media.rawg.io/media/screenshots/1ac/1ac19f174714b23323bc57adc8e76ac6.jpg',
      'https://media.rawg.io/media/screenshots/2c4/2c4d924d5462cf1b54a6521bc279fb04.jpg',
      'https://media.rawg.io/media/screenshots/59f/59f8c691f18fc43cfc0ec8eb7c22ee3a.jpg',
      'https://media.rawg.io/media/screenshots/0aa/0aa06d9d023f0340c268046b07d6c6e7.jpg'
    ]
  }
};

function fetchSteamDetails(appId) {
  return new Promise((resolve) => {
    https.get('https://store.steampowered.com/api/appdetails?appids=' + appId, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const app = json[appId]?.data;
          if (app) {
            resolve({
              header: app.header_image,
              bg: app.background,
              shots: (app.screenshots || []).slice(0, 6).map((s) => s.path_full),
            });
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const seedFile = path.join(__dirname, 'seed-data.js');
  let content = fs.readFileSync(seedFile, 'utf8');

  // Extract games array
  const startIdx = content.indexOf('const games = [') + 'const games = '.length;
  const endIdx = content.indexOf('];\n\n// Calculate', startIdx) + 1;
  const games = eval(content.slice(startIdx, endIdx));

  console.log('Processing', games.length, 'games...');

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const slug = game.slug;

    if (STEAM_APPS[slug]) {
      const appId = STEAM_APPS[slug];
      const steamData = await fetchSteamDetails(appId);

      // Official 600x900 Steam vertical cover poster
      game.coverImage = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`;
      
      // Thumbnail
      game.thumbnailImage = steamData?.header || `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
      
      // Wide Landscape Hero Background
      game.backgroundImage = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_hero.jpg`;

      // Full-res Screenshots
      if (steamData?.shots && steamData.shots.length > 0) {
        game.screenshots = steamData.shots;
      }
      console.log(`[${i + 1}/${games.length}] Steam enriched: ${game.name} (${game.screenshots.length} shots)`);
    } else if (CUSTOM_ASSETS[slug]) {
      const custom = CUSTOM_ASSETS[slug];
      game.coverImage = custom.cover;
      game.backgroundImage = custom.bg;
      game.thumbnailImage = custom.thumb;
      game.screenshots = custom.shots;
      console.log(`[${i + 1}/${games.length}] Custom enriched: ${game.name} (${game.screenshots.length} shots)`);
    } else {
      // Fallback: Ensure distinct background and at least 3 screenshots
      game.thumbnailImage = game.coverImage;
      if (!game.screenshots || game.screenshots.length < 3) {
        game.screenshots = [
          game.backgroundImage,
          'https://media.rawg.io/media/screenshots/0aa/0aa06d9d023f0340c268046b07d6c6e7.jpg',
          'https://media.rawg.io/media/screenshots/92e/92e0082c448bb957b42cefb6b876fc62.jpg',
          'https://media.rawg.io/media/screenshots/115/11579a4918e954c25607b309f7a552fd.jpg'
        ];
      }
      console.log(`[${i + 1}/${games.length}] Fallback enriched: ${game.name} (${game.screenshots.length} shots)`);
    }

    // Small delay to be polite to Steam API
    await new Promise((r) => setTimeout(r, 150));
  }

  // Regenerate seed-data.js and database.ts
  const newGamesJs = JSON.stringify(games, null, 2);
  const updatedSeedContent = content.slice(0, startIdx) + newGamesJs + content.slice(endIdx);
  fs.writeFileSync(seedFile, updatedSeedContent, 'utf8');
  console.log('Successfully updated seed-data.js!');

  // Now run seed-data.js to write lib/database.ts
  require('./seed-data.js');
  console.log('Database enriched and updated successfully!');
}

main().catch(console.error);
