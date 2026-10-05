async function getEpicAllImages(slug) {
  try {
    const url = 'https://store-content-ipv4.ak.epicgames.com/api/en-US/content/products/' + slug;
    const res = await fetch(url);
    const text = await res.text();
    const regex = /https:\/\/[^"'\\<>\s]+?\.(?:jpg|png|jpeg)/gi;
    const matches = text.match(regex) || [];
    const unique = Array.from(new Set(matches)).filter(u => u.includes('unrealengine.com') || u.includes('epicgames.com'));
    console.log(slug, 'found images:', unique.length);
    for (const u of unique.slice(0, 8)) {
      const check = await fetch(u, { method: 'HEAD' });
      console.log(' ', check.status, u);
    }
  } catch (e) {
    console.error(slug, 'error:', e.message);
  }
}

async function run() {
  await getEpicAllImages('fortnite');
  await getEpicAllImages('valorant');
  await getEpicAllImages('genshin-impact');
  await getEpicAllImages('honkai-star-rail');
}

run();
