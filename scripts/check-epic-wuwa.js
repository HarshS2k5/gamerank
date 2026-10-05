const https = require('https');

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const data = await fetchJson('https://store-content-ipv4.ak.epicgames.com/api/en-US/content/products/wuthering-waves');
  if (data) {
    const str = JSON.stringify(data);
    const m = str.match(/https:\/\/[^"'\s\\]+\.(?:jpg|png)/g) || [];
    console.log('Epic Wuthering Waves images:', Array.from(new Set(m)));
  } else {
    console.log('No Epic data for wuthering-waves');
  }
}
run();
