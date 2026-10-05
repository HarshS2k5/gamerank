async function checkUrls(urls) {
  for (const [name, list] of Object.entries(urls)) {
    console.log(`\n=== Checking ${name} ===`);
    for (const url of list) {
      try {
        const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) });
        console.log(res.status, url);
      } catch (e) {
        console.log('ERR', e.message, url);
      }
    }
  }
}

const candidates = {
  'zelda-totk': [
    'https://assets.nintendo.com/image/upload/c_fill,f_auto,q_auto,w_1200/ncom/en_US/games/switch/t/the-legend-of-zelda-tears-of-the-kingdom-switch/hero',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/t/the-legend-of-zelda-tears-of-the-kingdom-switch/screenshot-gallery/screenshot01',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/t/the-legend-of-zelda-tears-of-the-kingdom-switch/screenshot-gallery/screenshot02',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/t/the-legend-of-zelda-tears-of-the-kingdom-switch/screenshot-gallery/screenshot03',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/t/the-legend-of-zelda-tears-of-the-kingdom-switch/screenshot-gallery/screenshot04',
    'https://assets.nintendo.com/image/upload/c_fill,f_auto,q_auto,w_600/ncom/en_US/games/switch/t/the-legend-of-zelda-tears-of-the-kingdom-switch/boxart'
  ],
  'super-mario-odyssey': [
    'https://assets.nintendo.com/image/upload/c_fill,f_auto,q_auto,w_1200/ncom/en_US/games/switch/s/super-mario-odyssey-switch/hero',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/s/super-mario-odyssey-switch/screenshot-gallery/screenshot01',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/s/super-mario-odyssey-switch/screenshot-gallery/screenshot02',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/s/super-mario-odyssey-switch/screenshot-gallery/screenshot03',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/s/super-mario-odyssey-switch/screenshot-gallery/screenshot04',
    'https://assets.nintendo.com/image/upload/c_fill,f_auto,q_auto,w_600/ncom/en_US/games/switch/s/super-mario-odyssey-switch/boxart'
  ],
  'metroid-prime-4': [
    'https://assets.nintendo.com/image/upload/c_fill,f_auto,q_auto,w_1200/ncom/en_US/games/switch/m/metroid-prime-4-beyond-switch/hero',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/m/metroid-prime-4-beyond-switch/screenshot-gallery/screenshot01',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/m/metroid-prime-4-beyond-switch/screenshot-gallery/screenshot02',
    'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,dpr_2.0,f_auto,q_auto,w_960/ncom/en_US/games/switch/m/metroid-prime-4-beyond-switch/screenshot-gallery/screenshot03'
  ]
};

checkUrls(candidates);
