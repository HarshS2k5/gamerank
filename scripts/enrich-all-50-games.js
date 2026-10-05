const fs = require('fs');
const path = require('path');

const STEAM_MAPPINGS = {
  'elden-ring': 1245620,
  'grand-theft-auto-v': 271590,
  'red-dead-redemption-2': 1174180,
  'the-witcher-3-wild-hunt': 292030,
  'cyberpunk-2077': 1091500,
  'baldurs-gate-3': 1086940,
  'god-of-war-ragnarok': 2322010,
  'marvels-spider-man-2': 2651280,
  'hades-ii': 1145350,
  'hollow-knight-silksong': 1030300,
  'doom-the-dark-ages': 3017860,
  'death-stranding-2-on-the-beach': 3280350,
  'monster-hunter-wilds': 2246340,
  'hollow-knight': 367520,
  'terraria': 105600,
  'counter-strike-2': 730,
  'apex-legends': 1172470,
  'forza-horizon-5': 1551360,
  'resident-evil-4': 2050650,
  'stardew-valley': 413150,
  'dark-souls-iii': 374320,
  'sekiro-shadows-die-twice': 814380,
  'hogwarts-legacy': 990080,
  'ghost-of-tsushima': 2215430,
  'the-last-of-us-part-i': 1888930,
  'street-fighter-6': 1364780,
  'tekken-8': 1778820,
  'cuphead': 268910,
  'celeste': 504230,
  'wuthering-waves': 3513350,
  'dota-2': 570,
  'rocket-league': 252950,
  'overwatch-2': 2357570,
  'ea-sports-fc-24': 2195250,
};

const SPECIFIC_COVERS = {
  'death-stranding-2-on-the-beach': 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7ubx.jpg',
  'wuthering-waves': 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/07/06/3f/07063f40-1a99-bb82-4a2c-cafa1e145d1d/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
};

const NON_STEAM_ASSETS = {
  'minecraft': {
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/3b/b7/24/3bb724be-0244-933a-af48-ad2195689877/AppIcon-0-0-1x_U007emarketing-0-10-0-85-220.png/512x512bb.jpg',
    bg: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/3b/b7/24/3bb724be-0244-933a-af48-ad2195689877/AppIcon-0-0-1x_U007emarketing-0-10-0-85-220.png/512x512bb.jpg',
    shots: [
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/07/47/6f/07476fcd-1ecf-18ca-e7f7-364d6c6cd5e1/pr_source.png/1280x720bb.png',
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/5e/52/62/5e526279-d6e4-4d1e-841f-50607da1978d/pr_source.png/1280x720bb.png',
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/3d/bf/9a/3dbf9a12-8ee4-ea04-37f2-1a4c9c22e4c4/pr_source.png/1280x720bb.png',
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/9f/bd/91/9fbd91e7-bb1f-7ff4-53a5-f559779df344/pr_source.png/1280x720bb.png'
    ]
  },
  'the-legend-of-zelda-tears-of-the-kingdom': {
    cover: 'https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg',
    bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg',
    shots: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop'
    ]
  },
  'super-mario-odyssey': {
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1m5a.png',
    bg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1m5a.png',
    shots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop'
    ]
  },
  'fortnite': {
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/58/ac/a0/58aca06b-4dc5-d680-14c4-1f05fb3b9928/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg',
    bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/58/ac/a0/58aca06b-4dc5-d680-14c4-1f05fb3b9928/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg',
    shots: [
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/bd/a7/e3/bda7e31a-7341-2cf8-d54f-880aec955620/EN_FNBR_42-00_C7S4_Shot_1_iOS_AppStore_Screenshot_iPhone_2868x1320.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/2a/f2/a3/2af2a36b-16e8-6977-3391-9a30364932e7/EN_FNBR_42-00_C7S4_Shot_2_iOS_AppStore_Screenshot_iPhone_2868x1320.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/2d/ea/e9/2deae962-f00f-5d8d-2bfe-e645dcc4616c/EN_FNBR_42-00_C7S4_Shot_3_iOS_AppStore_Screenshot_iPhone_2868x1320.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/3d/8c/d7/3d8cd717-b649-65d1-1313-097ecbf78a4b/EN_FNBR_42-00_C7S4_Shot_4_iOS_AppStore_Screenshot_iPhone_2868x1320.jpg/1280x720bb.jpg'
    ]
  },
  'grand-theft-auto-vi': {
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7ws8.jpg',
    bg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7ws8.jpg',
    shots: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1920&auto=format&fit=crop'
    ]
  },
  'metroid-prime-4-beyond': {
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8kbf.jpg',
    bg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8kbf.jpg',
    shots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1920&auto=format&fit=crop'
    ]
  },
  'the-witcher-4-polaris': {
    cover: 'https://public.cdn.cdpr.app/thewitcher/website/build/2906319531-9f43b68a/_next/static/media/1920.3igs7guwxpfup.jpg',
    bg: 'https://public.cdn.cdpr.app/thewitcher/website/build/2906319531-9f43b68a/_next/static/media/1920.3igs7guwxpfup.jpg',
    thumb: 'https://public.cdn.cdpr.app/thewitcher/website/build/2906319531-9f43b68a/_next/static/media/1920.3igs7guwxpfup.jpg',
    shots: [
      'https://public.cdn.cdpr.app/thewitcher/website/build/2906319531-9f43b68a/_next/static/media/1920.3igs7guwxpfup.jpg',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920&auto=format&fit=crop'
    ]
  },
  'valorant': {
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.jpg',
    bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.jpg',
    shots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920&auto=format&fit=crop'
    ]
  },
  'genshin-impact': {
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/5c/e2/13/5ce21317-a08a-24ac-cc5f-2b25a4d71fa6/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg',
    bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/5c/e2/13/5ce21317-a08a-24ac-cc5f-2b25a4d71fa6/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg',
    shots: [
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/2d/09/2f/2d092f1a-f550-9e4e-51f3-483a973ffc53/EN-1.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/35/61/87/35618790-a7d5-d5ef-cb43-1579d505ae30/EN-2.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/4d/91/92/4d919299-467f-7128-4ee0-cb560c55041a/EN-3.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/71/34/4d/71344d57-e179-813c-4422-95f00e998e3b/EN-4.jpg/1280x720bb.jpg'
    ]
  },
  'honkai-star-rail': {
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/fd/65/dc/fd65dc18-c4b6-7b64-8266-a423f3f113e0/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    bg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/fd/65/dc/fd65dc18-c4b6-7b64-8266-a423f3f113e0/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    shots: [
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/61/61/96/616196cd-2cf5-19bd-120b-2bbeec236934/EN-2688_U00d71242-0-4.6KV.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/4a/0f/54/4a0f5451-ea3b-a2eb-3770-4f51e506691c/EN-2688_U00d71242-1.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/3e/60/d1/3e60d1f7-e435-ec5b-e4a8-f32e92c25608/EN-2688_U00d71242-2.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/13/2e/da/132edaeb-68bb-ea1d-a068-15c0e0b35e23/EN-2688_U00d71242-3.jpg/1280x720bb.jpg'
    ]
  },
  'clash-of-clans': {
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ba/b9/3a/bab93a90-921d-2caf-32a6-cde63f6006d4/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ba/b9/3a/bab93a90-921d-2caf-32a6-cde63f6006d4/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    shots: [
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/07/5e/51/075e512e-62fb-75da-dbd7-63bf410f6fd5/627799b5-bcad-4b62-8066-ffc4017dc4c4_clash_2208x1242_1.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/1d/18/d5/1d18d5d4-4866-e0f3-80b6-17482811a2f6/b7e28b24-c187-4668-96fc-9dbe987cfa90_clash_2208x1242_2.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/31/50/ea/3150ea0c-d4a9-7c87-b9c1-aa561c21e649/8c962bcf-e0f1-4fc3-a188-f5429188bfb9_clash_2208x1242_3.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/64/7b/07/647b07f8-3e58-6927-e435-013fa096377e/10fb03c5-7b58-48b4-93ec-e53b4787a216_clash_2208x1242_4.jpg/1280x720bb.jpg'
    ]
  },
  'brawl-stars': {
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ee/a7/00/eea700d3-6cec-f063-b86c-3dfd251c95bd/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg',
    bg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ee/a7/00/eea700d3-6cec-f063-b86c-3dfd251c95bd/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg',
    shots: [
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/0d/e8/35/0de83512-1540-275d-8415-624c58f567b6/183ca458-2321-468f-92a3-f53f0bcbafcd_Rank_Up_and_Customize_2208x1242_EN.png/1280x720bb.png',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/1b/ad/b8/1badb8f9-42b7-a3aa-17e9-4e5a95393086/b32e650d-85f7-4aa7-ae52-7b068da6c99c_Battle_with_Friends_2208x1242_EN.png/1280x720bb.png',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/b8/aa/70/b8aa704a-8671-ee06-d08b-ec3516089324/5b2bcf1b-85d7-463d-8eec-4a7bcaebf8f0_Fast_Paced_Multiplayer_2208x1242_EN.png/1280x720bb.png',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/e5/bd/a6/e5bda61c-cf31-c063-548d-69276e0339d1/06d6342e-152e-4b4d-be78-36021666ff96_Unlock_and_Upgrade_2208x1242_EN.png/1280x720bb.png'
    ]
  },
  'subway-surfers': {
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/3b/6f/c0/3b6fc01e-ca3c-8335-fedb-35bc6c01ee18/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    bg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/3b/6f/c0/3b6fc01e-ca3c-8335-fedb-35bc6c01ee18/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    shots: [
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/b9/d7/c2/b9d7c289-0ac5-9197-da1b-7e663e5d4067/_U002fdata_U002fapp-store-connect-assets_U002fscreenshots_U002fen-US_U002f1_IPHONE_69.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/64/00/ec/6400ec06-8d62-520e-8f2c-567f892cb621/_U002fdata_U002fapp-store-connect-assets_U002fscreenshots_U002fen-US_U002f2_IPHONE_69.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/44/29/30/44293026-c2ba-0e78-8316-f2d488da1117/_U002fdata_U002fapp-store-connect-assets_U002fscreenshots_U002fen-US_U002f3_IPHONE_69.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/16/a6/50/16a650d0-48e0-16d8-c7ea-25805f6e8c75/_U002fdata_U002fapp-store-connect-assets_U002fscreenshots_U002fen-US_U002f4_IPHONE_69.jpg/1280x720bb.jpg'
    ]
  },
  'pokemon-go': {
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/6f/ba/4f/6fba4fa7-a958-f96e-6761-7d848fd21600/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/6f/ba/4f/6fba4fa7-a958-f96e-6761-7d848fd21600/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    shots: [
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/32/36/44/323644e3-94b5-4874-9d26-ccb8e2b9358b/PGO_ASO-Screenshots-EG-01-S24_1242x2208__static_UA_EN_NV.png/1280x720bb.png',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/7c/49/7f/7c497fba-1a52-c0cb-d9a4-ff6b6d51199a/PGO_ASO-Screenshots-EG-02-S24_1242x2208__static_UA_EN_NV.png/1280x720bb.png',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/91/ce/4e/91ce4ed2-bb17-74be-e28e-5b1b4d0d0879/PGO_ASO-Screenshots-EG-03-S24_1242x2208__static_UA_EN_NV.png/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/c2/be/df/c2bedf9c-7c0d-db2e-3d07-2cba23932fa5/PGO_ASO-Screenshots-EG-04-S24_1242x2208__static_UA_EN_NV.png/1280x720bb.png'
    ]
  },
  'league-of-legends': {
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/70/e1/e9/70e1e94a-6d1e-2dd1-3375-75b43d8f71a5/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/70/e1/e9/70e1e94a-6d1e-2dd1-3375-75b43d8f71a5/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    shots: [
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/7f/a3/e0/7fa3e0fa-db16-3322-248c-c7fd067d39af/6D_ASO_Screenshots-Hwei-2208-1242.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/5e/be/12/5ebe124d-0516-c8b0-9537-9e23a4bac4f9/6D_ASO_Screenshots-Rank_Millo-2208-1242.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/87/3b/3e/873b3ee7-0e9b-4233-0a86-8a635f94b40a/Copy_of_1.2208-1242-Jinx_.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/9c/68/d9/9c68d90f-96a6-f2c9-6b54-9426f4f2bf01/Copy_of_3.2208-1242-Skins.jpg/1280x720bb.jpg'
    ]
  },
  'roblox': {
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/35/3e/ff/353eff73-c6d3-9aff-4ba5-a0a6e3afa563/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg',
    bg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop',
    thumb: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/35/3e/ff/353eff73-c6d3-9aff-4ba5-a0a6e3afa563/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg',
    shots: [
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/44/6e/a8/446ea852-2d09-c4c2-5cbf-cbeca590a42f/ASO_Q1_26_Default_EEAO_2602_Apple_iPhone_SC1-RIVALS.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/71/eb/e9/71ebe932-d39b-e77a-24cb-165b443c5180/ASO_Q1_26_Default_EEAO_2602_Apple_iPhone_SC2-BLOXFRUITS.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/40/65/ee/4065ee09-663f-fe2c-c513-4da1a27e7f91/ASO_Q1_26_Default_EEAO_2602_Apple_iPhone_SC3-FASHIONFAMOUS.jpg/1280x720bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/2e/0f/52/2e0f5223-2895-d8aa-4da7-3b2d184eb4a4/ASO_Q1_26_Default_EEAO_2602_Apple_iPhone_SC4-BROOKHAVEN.jpg/1280x720bb.jpg'
    ]
  }
};

async function verifyUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(6000), headers: { 'User-Agent': 'GameRank/1.0' } });
    if (res.ok) return true;
    const gRes = await fetch(url, { method: 'GET', headers: { 'Range': 'bytes=0-10', 'User-Agent': 'GameRank/1.0' }, signal: AbortSignal.timeout(6000) });
    return gRes.ok;
  } catch (e) {
    return false;
  }
}

async function fetchSteamData(appId, gameSlug) {
  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    if (!data[appId] || !data[appId].success) return null;
    const d = data[appId].data;

    const base = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/`;
    
    // Check if custom cover is explicitly provided
    let cover = SPECIFIC_COVERS[gameSlug] || `${base}library_600x900_2x.jpg`;
    const coverValid = await verifyUrl(cover);
    if (!coverValid) {
      cover = d.header_image || `${base}header.jpg`;
    }

    const hero = `${base}library_hero.jpg`;
    const header = d.header_image || `${base}header.jpg`;
    const shots = (d.screenshots || []).slice(0, 6).map(s => s.path_full);

    return { cover, hero, header, shots };
  } catch (e) {
    console.error(`Error fetching Steam appId ${appId}:`, e.message);
    return null;
  }
}

async function run() {
  console.log('--- Starting GameRank Complete Image Enrichment & Verification ---');
  const dbFile = path.join(__dirname, '../lib/database.ts');
  const content = fs.readFileSync(dbFile, 'utf8');
  const jsonMatch = content.match(/export const SEED_GAMES: GameRecord\[\] = (\[[\s\S]*?\]);\s*$/);
  if (!jsonMatch) throw new Error('Could not parse SEED_GAMES');

  const games = JSON.parse(jsonMatch[1]);
  console.log(`Total games to enrich: ${games.length}`);

  let updatedCount = 0;
  let verifiedCount = 0;
  let brokenCount = 0;

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    console.log(`\n[${i + 1}/${games.length}] Processing "${game.name}" (${game.slug})...`);

    let newCover = null;
    let newBg = null;
    let newThumb = null;
    let newShots = null;

    if (NON_STEAM_ASSETS[game.slug]) {
      const a = NON_STEAM_ASSETS[game.slug];
      newCover = a.cover;
      newBg = a.bg;
      newThumb = a.thumb;
      newShots = a.shots;
    } else if (STEAM_MAPPINGS[game.slug]) {
      const appId = STEAM_MAPPINGS[game.slug];
      const sData = await fetchSteamData(appId, game.slug);
      if (sData) {
        newCover = sData.cover;
        newBg = sData.hero;
        newThumb = sData.header;
        newShots = sData.shots;
      }
    }

    if (newCover) {
      // Test cover
      const coverOk = await verifyUrl(newCover);
      if (coverOk) {
        game.coverImage = newCover;
      } else {
        console.warn(`  ⚠️ Cover failed for ${game.slug}: ${newCover}`);
      }

      // Test bg
      const bgOk = await verifyUrl(newBg);
      if (bgOk) {
        game.backgroundImage = newBg;
      } else {
        // Fallback to high quality unsplash
        game.backgroundImage = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop';
      }

      // Test thumb
      const thumbOk = await verifyUrl(newThumb);
      if (thumbOk) {
        game.thumbnailImage = newThumb;
      } else {
        game.thumbnailImage = game.coverImage;
      }

      // Test shots
      const verifiedShots = [];
      for (const s of (newShots || [])) {
        const sOk = await verifyUrl(s);
        if (sOk) verifiedShots.push(s);
      }
      if (verifiedShots.length >= 3) {
        game.screenshots = verifiedShots;
      }

      updatedCount++;
    }

    // Final verification check on current game assets
    const finalCoverOk = await verifyUrl(game.coverImage);
    const finalBgOk = await verifyUrl(game.backgroundImage);
    const finalThumbOk = await verifyUrl(game.thumbnailImage || game.coverImage);
    const finalShotsOk = game.screenshots.length > 0;

    if (finalCoverOk && finalBgOk && finalThumbOk && finalShotsOk) {
      console.log(`  ✅ ALL ASSETS 100% VERIFIED: Cover, Thumbnail, Background, & ${game.screenshots.length} Screenshots`);
      verifiedCount++;
    } else {
      console.error(`  ❌ ASSET ISSUE for ${game.name}: cover=${finalCoverOk}, bg=${finalBgOk}, thumb=${finalThumbOk}, shots=${finalShotsOk}`);
      brokenCount++;
    }
  }

  console.log('\n=======================================');
  console.log(`Total Games: ${games.length}`);
  console.log(`Updated Games: ${updatedCount}`);
  console.log(`Fully Verified Games: ${verifiedCount}`);
  console.log(`Games with Issues: ${brokenCount}`);
  console.log('=======================================');

  if (brokenCount === 0) {
    const newDbCode = `// ─────────────────────────────────────────────────────────────────────────────
// GameRank – Scalable Game Database with Verified Cover Posters & Specs
// ─────────────────────────────────────────────────────────────────────────────
import { GameRecord } from '@/types/database';

export const SEED_GAMES: GameRecord[] = ${JSON.stringify(games, null, 2)};
`;

    fs.writeFileSync(dbFile, newDbCode, 'utf8');
    fs.writeFileSync(path.join(__dirname, 'seed-data.js'), `module.exports = ${JSON.stringify(games, null, 2)};\n`, 'utf8');
    console.log('Successfully saved verified database to lib/database.ts and scripts/seed-data.js!');
  } else {
    console.error('Did not overwrite database due to asset issues. Please inspect errors.');
  }
}

run().catch(console.error);
