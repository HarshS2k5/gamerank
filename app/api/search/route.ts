import { NextRequest, NextResponse } from 'next/server'

const RAWG_BASE_URL = 'https://api.rawg.io/api'

function getApiKey() {
  const key = process.env.RAWG_API_KEY
  if (!key) throw new Error('RAWG_API_KEY not configured')
  return key
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = getApiKey()
    const searchParams = request.nextUrl.searchParams
    
    const query = searchParams.get('q')
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ count: 0, results: [] })
    }
    
    const params = new URLSearchParams()
    params.set('key', apiKey)
    params.set('search', query.trim())
    params.set('search_precise', 'true')
    params.set('page_size', searchParams.get('page_size') || '20')
    params.set('page', searchParams.get('page') || '1')
    
    // Optional filters
    const filters = ['genres', 'platforms', 'dates', 'metacritic', 'ordering', 'tags']
    filters.forEach(f => {
      const v = searchParams.get(f)
      if (v) params.set(f, v)
    })
    
    const response = await fetch(`${RAWG_BASE_URL}/games?${params.toString()}`, {
      next: { revalidate: 300 }, // 5 min cache for search
      signal: AbortSignal.timeout(10000),
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Search failed' }, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error && error.message.includes('RAWG_API_KEY')) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
