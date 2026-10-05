const https = require('https');

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => resolve(''));
  });
}

async function main() {
  const html = await fetchPage('https://www.rockstargames.com/VI');
  const mediaHtml = await fetchPage('https://www.rockstargames.com/VI/media');
  
  const combined = html + '\n' + mediaHtml;
  const urls = [];
  const regex = /(https:\/\/[^"'\s<>]+\.(?:jpg|png|webp|jpeg))/gi;
  let m;
  while ((m = regex.exec(combined)) !== null) {
    urls.push(m[1]);
  }
  
  // also look for relative paths like /_next/static/media/...
  const relRegex = /"(\/_next\/static\/media\/[^"]+)"/g;
  while ((m = relRegex.exec(combined)) !== null) {
    urls.push('https://www.rockstargames.com/VI' + m[1]);
  }

  console.log('Unique image URLs found:');
  const unique = Array.from(new Set(urls));
  unique.forEach(u => console.log(u));
}

main();
