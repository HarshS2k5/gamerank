const fs = require('fs');

async function getInfoboxFile(title) {
  try {
    const url = 'https://en.wikipedia.org/w/api.php?action=parse&page=' + encodeURIComponent(title) + '&prop=text&section=0&format=json';
    const res = await fetch(url, { headers: { 'User-Agent': 'GameRankBot/1.0 (contact@gamerank.com)' } });
    const data = await res.json();
    if (!data.parse || !data.parse.text) {
      console.log(title, 'no parse data');
      return null;
    }
    const html = data.parse.text['*'];
    const match = html.match(/\/wiki\/(File:[^"' >]+)/i);
    if (!match) {
      console.log(title, 'no File match');
      return null;
    }
    const file = decodeURIComponent(match[1].replace('File:', ''));
    const fileUrl = 'https://en.wikipedia.org/w/api.php?action=query&titles=File:' + encodeURIComponent(file) + '&prop=imageinfo&iiprop=url&format=json';
    const fRes = await fetch(fileUrl, { headers: { 'User-Agent': 'GameRankBot/1.0' } });
    const fData = await fRes.json();
    for (const k in fData.query.pages) {
      if (fData.query.pages[k].imageinfo) {
        const u = fData.query.pages[k].imageinfo[0].url;
        const check = await fetch(u, { method: 'HEAD', headers: { 'User-Agent': 'GameRankBot/1.0' } });
        console.log(title, '->', file, '->', check.status, u);
        return { file, url: u, status: check.status };
      }
    }
  } catch (e) {
    console.error(title, 'error:', e.message);
  }
  return null;
}

async function run() {
  const list = [
    'Minecraft',
    'Fortnite',
    'Metroid Prime 4: Beyond',
    'Death Stranding 2: On the Beach',
    'Doom: The Dark Ages',
    'Genshin Impact',
    'Honkai: Star Rail',
    'Wuthering Waves',
    'Clash of Clans',
    'Brawl Stars',
    'Subway Surfers',
    'Pokémon Go',
    'League of Legends',
    'Roblox'
  ];
  for (const t of list) {
    await getInfoboxFile(t);
  }
}

run();
