const fs = require('fs');

async function searchSteam(query) {
  try {
    const url = 'https://store.steampowered.com/api/storesearch/?term=' + encodeURIComponent(query) + '&l=english&cc=US';
    const res = await fetch(url);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      return data.items[0];
    }
  } catch (e) {
    console.error('Error searching Steam for', query, e.message);
  }
  return null;
}

async function run() {
  const content = fs.readFileSync('./lib/database.ts', 'utf8');
  const jsonMatch = content.match(/export const SEED_GAMES: GameRecord\[\] = (\[[\s\S]*?\]);\s*$/);
  const games = JSON.parse(jsonMatch[1]);

  console.log('Searching Steam for all games...');
  const steamMap = {};

  for (const game of games) {
    // Delay 200ms
    await new Promise(r => setTimeout(r, 200));
    const item = await searchSteam(game.name);
    if (item && item.name.toLowerCase().includes(game.name.toLowerCase().slice(0, 8))) {
      console.log(`FOUND: "${game.name}" (${game.slug}) -> Steam App ID: ${item.id} ("${item.name}")`);
      steamMap[game.slug] = item.id;
    } else {
      console.log(`NOT ON STEAM: "${game.name}" (${game.slug})`);
    }
  }

  console.log('\nTotal Steam matches found:', Object.keys(steamMap).length);
  fs.writeFileSync('./scripts/steam-map.json', JSON.stringify(steamMap, null, 2));
}

run();
