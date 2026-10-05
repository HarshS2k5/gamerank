import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamerank.vercel.app'
  const categories = [
    'all-time', 'pc', 'android', 'ios', 'playstation', 'xbox', 'nintendo',
    'cross-platform', 'free-to-play', 'multiplayer', 'open-world', 'story',
    'rpg', 'action', 'shooter', 'racing', 'horror', 'strategy', 'sports',
    'indie', 'best-of-year', 'most-popular', 'upcoming'
  ]

  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/rankings/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rankings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...categoryEntries,
  ]
}
