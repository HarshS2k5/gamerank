async function search() {
  const slugs = ['wuthering-waves', 'league-of-legends', 'genshin-impact', 'rocket-league', 'fall-guys', 'gta-vi', 'grand-theft-auto-vi'];
  for (const slug of slugs) {
    try {
      const url = 'https://store-content-ipv4.ak.epicgames.com/api/en-US/content/products/' + slug;
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const matches = text.match(/https:\/\/[^"'\\<>\s]+?\.(?:jpg|png|jpeg)/gi) || [];
        const unique = Array.from(new Set(matches)).filter(u => u.includes('unrealengine.com'));
        console.log(`=== ${slug} (found ${unique.length}) ===`);
        const blades = unique.filter(u => u.includes('1200x1600') || u.includes('1200_1600') || u.includes('portrait') || u.includes('s2-'));
        const heroes = unique.filter(u => u.includes('2560x1440') || u.includes('1920x1080') || u.includes('hero') || u.includes('s1-'));
        const shots = unique.filter(u => u.includes('1920x1080') || u.includes('g1a') || u.includes('screenshot'));
        console.log('Cover candidates:', blades.slice(0, 3));
        console.log('Hero candidates:', heroes.slice(0, 3));
        console.log('Screenshot candidates:', shots.slice(0, 5));
      } else {
        console.log(`${slug} -> HTTP ${res.status}`);
      }
    } catch (e) {
      console.log(`${slug} error: ${e.message}`);
    }
  }
}
search();
