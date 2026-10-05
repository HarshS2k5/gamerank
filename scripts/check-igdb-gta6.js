const https = require('https');

https.get('https://www.igdb.com/games/grand-theft-auto-vi', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const covers = d.match(/images\.igdb\.com\/igdb\/image\/upload\/[^"'\s<>]+\.(?:jpg|png)/g) || [];
    console.log(Array.from(new Set(covers)));
  });
});
