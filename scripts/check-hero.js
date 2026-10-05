const fs = require('fs');
const content = fs.readFileSync('lib/database.ts', 'utf8');
const games = [];
const blocks = content.split('{\n    "id":');
for (const block of blocks.slice(1)) {
  const nameMatch = block.match(/"name":\s*"([^"]+)"/);
  const slugMatch = block.match(/"slug":\s*"([^"]+)"/);
  const coverMatch = block.match(/"coverImage":\s*"([^"]+)"/);
  const thumbMatch = block.match(/"thumbnailImage":\s*"([^"]+)"/);
  const scoreMatch = block.match(/"gameRankScore":\s*(\d+)/);
  if (nameMatch && slugMatch && coverMatch && scoreMatch) {
    games.push({
      name: nameMatch[1],
      slug: slugMatch[1],
      cover: coverMatch[1],
      thumb: thumbMatch ? thumbMatch[1] : null,
      score: Number(scoreMatch[1])
    });
  }
}
games.sort((a, b) => b.score - a.score);
console.log('Top 5 games by score:');
console.log(JSON.stringify(games.slice(0, 5), null, 2));

const gta = games.find(g => g.slug.includes('grand-theft-auto-vi'));
console.log('GTA VI:', JSON.stringify(gta, null, 2));
