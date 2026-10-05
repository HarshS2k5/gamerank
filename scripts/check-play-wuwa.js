const https = require('https');

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const html = await fetchPage('https://play.google.com/store/apps/details?id=com.kurogame.wutheringwaves.global&hl=en');
  const regex = /"https:\/\/play-lh\.googleusercontent\.com\/[^"]+"/g;
  const matches = (html.match(regex) || []).map(s => s.replace(/"/g, ''));
  console.log('Unique Play images count:', new Set(matches).size);
  Array.from(new Set(matches)).slice(0, 10).forEach(u => console.log(u));
}
run();
