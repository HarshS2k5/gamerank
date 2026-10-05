const fs = require('fs');

async function testEndpoint(url, expectedSubstrings = []) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`❌ FAILED ${url} (status: ${res.status})`);
      return false;
    }
    const html = await res.text();
    for (const sub of expectedSubstrings) {
      if (!html.toLowerCase().includes(sub.toLowerCase())) {
        console.error(`❌ FAILED ${url} (missing expected text: "${sub}")`);
        return false;
      }
    }
    console.log(`✅ PASSED ${url} (status: ${res.status}, length: ${html.length})`);
    return true;
  } catch (e) {
    console.error(`❌ ERROR ${url}:`, e.message);
    return false;
  }
}

async function run() {
  console.log('--- Running GameRank Automated Integration Tests ---\n');
  const tests = [
    { url: 'http://localhost:3000/', expected: ['GameRank', 'Trending Now', 'Top Rated Worldwide'] },
    { url: 'http://localhost:3000/games/minecraft', expected: ['Minecraft', 'Mojang Studios', 'GameRank Score'] },
    { url: 'http://localhost:3000/games/grand-theft-auto-vi', expected: ['Grand Theft Auto VI', 'Rockstar Games'] },
    { url: 'http://localhost:3000/games/elden-ring', expected: ['Elden Ring', 'FromSoftware'] },
    { url: 'http://localhost:3000/games/super-mario-odyssey', expected: ['Super Mario Odyssey', 'Nintendo'] },
    { url: 'http://localhost:3000/games/marvels-spider-man-2', expected: ['Marvel\'s Spider-Man 2', 'Insomniac Games'] },
    { url: 'http://localhost:3000/games/the-legend-of-zelda-tears-of-the-kingdom', expected: ['Tears of the Kingdom', 'Nintendo'] },
    { url: 'http://localhost:3000/rankings/all-time', expected: ['Top 100 Games of All Time'] },
    { url: 'http://localhost:3000/rankings/pc', expected: ['Best PC Games'] },
    { url: 'http://localhost:3000/rankings/playstation', expected: ['Best PlayStation Games'] },
    { url: 'http://localhost:3000/rankings/xbox', expected: ['Best Xbox Games'] },
    { url: 'http://localhost:3000/rankings/nintendo', expected: ['Best Nintendo Games'] },
    { url: 'http://localhost:3000/rankings/android', expected: ['Best Android Games'] },
    { url: 'http://localhost:3000/compare', expected: ['Game Comparison'] },
    { url: 'http://localhost:3000/releases', expected: ['Release Calendar'] },
    { url: 'http://localhost:3000/ai-game-finder', expected: ['AI Game Finder'] },
    { url: 'http://localhost:3000/about', expected: ['Harsh Sisodia', 'Creator'] },
    { url: 'http://localhost:3000/search?q=zelda', expected: ['Zelda', 'titles found'] },
  ];

  let passed = 0;
  for (const t of tests) {
    const ok = await testEndpoint(t.url, t.expected);
    if (ok) passed++;
  }

  console.log(`\n================================`);
  console.log(`Tests Passed: ${passed} / ${tests.length}`);
  console.log(`================================`);

  if (passed !== tests.length) {
    process.exit(1);
  }
}

run();
