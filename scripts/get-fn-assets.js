async function getFNWallpapers() {
  const url = 'https://store-content-ipv4.ak.epicgames.com/api/en-US/content/products/fortnite';
  const res = await fetch(url);
  const text = await res.text();
  const matches = Array.from(new Set(text.match(/https:\/\/[^"'\\<>\s]+?\.(?:jpg|png|jpeg)/gi) || []));
  const big = matches.filter(u => u.includes('1920x1080') || u.includes('2560x1440') || u.includes('1200x1600'));
  console.log('Fortnite high res images:', big.length);
  for (const u of big) {
    try {
      const c = await fetch(u, { method: 'HEAD' });
      if (c.ok) console.log(c.status, u);
    } catch(e) {}
  }
}
getFNWallpapers();
