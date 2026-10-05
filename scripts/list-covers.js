const fs = require('fs');
const content = fs.readFileSync('./lib/database.ts', 'utf8');
const games = eval(content.slice(content.indexOf('['), content.lastIndexOf(']') + 1));

console.log('--- ALL 50 GAMES COVERS ---');
games.forEach(g => {
  console.log(`${g.id}. [${g.slug}]: ${g.coverImage}`);
});
