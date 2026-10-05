const https = require('https');
const fs = require('fs');

https.get('https://www.rockstargames.com/VI', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const urls = [];
    const regex = /(\/VI\/_next\/static\/media\/[^"'()<>]+\.(?:jpg|png|webp|avif))/g;
    let m;
    while ((m = regex.exec(d)) !== null) {
      urls.push('https://www.rockstargames.com' + m[1]);
    }
    const unique = Array.from(new Set(urls));
    console.log('Unique media count:', unique.length);
    unique.forEach(u => console.log(u));
  });
});
