const https = require('https');

https.get('https://store.epicgames.com/en-US/p/wuthering-waves-2c3631', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const m = d.match(/https:\/\/[^"'\\\s]+\.(?:jpg|png|webp)/g) || [];
    console.log('All image matches count:', m.length);
    Array.from(new Set(m)).forEach(u => console.log(u));
  });
});
