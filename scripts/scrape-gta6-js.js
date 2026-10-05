const https = require('https');

function fetchText(url) {
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
  const html = await fetchText('https://www.rockstargames.com/VI');
  const jsFiles = [];
  const jsRegex = /src="(\/_next\/static\/[^"]+\.js)"/g;
  let m;
  while ((m = jsRegex.exec(html)) !== null) {
    jsFiles.push('https://www.rockstargames.com/VI' + m[1]);
  }
  console.log('Found JS files:', jsFiles);

  for (const jsUrl of jsFiles) {
    const jsContent = await fetchText(jsUrl);
    // Find all static media files
    const mediaRegex = /static\/media\/[^"'\\]+\.(?:jpg|png|webp|avif)/g;
    let mm;
    while ((mm = mediaRegex.exec(jsContent)) !== null) {
      console.log('Media:', 'https://www.rockstargames.com/VI/_next/' + mm[0]);
    }
  }
}

main();
