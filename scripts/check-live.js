const https = require('https');
https.get('https://gamerank-one.vercel.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /<img[^>]*alt="Grand Theft Auto VI"[^>]*>/g;
    let match;
    let i = 1;
    while ((match = regex.exec(data)) !== null) {
      console.log(`Image ${i++}:`, match[0]);
    }
  });
});
