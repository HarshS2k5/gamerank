async function searchEpic(query) {
  const gql = {
    query: `query searchStoreQuery($keywords: String) {
      Catalog {
        catalogOffers(keywords: $keywords, locale: "en-US") {
          elements {
            title
            keyImages {
              type
              url
            }
          }
        }
      }
    }`,
    variables: { keywords: query }
  };
  const res = await fetch('https://graphql.epicgames.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gql)
  });
  const data = await res.json();
  const elems = data.data && data.data.Catalog && data.data.Catalog.catalogOffers && data.data.Catalog.catalogOffers.elements;
  if (elems && elems.length > 0) {
    const el = elems[0];
    console.log(query, '->', el.title);
    el.keyImages.forEach(k => console.log('  ', k.type, ':', k.url));
  } else {
    console.log(query, 'not found on Epic');
  }
}

async function run() {
  await searchEpic('Genshin Impact');
  await searchEpic('Honkai: Star Rail');
  await searchEpic('League of Legends');
  await searchEpic('Valorant');
  await searchEpic('Fortnite');
}

run();
