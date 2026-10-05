import { NextRequest, NextResponse } from 'next/server'

const RAWG_BASE_URL = 'https://api.rawg.io/api'

function getApiKey() {
  const key = process.env.RAWG_API_KEY
  if (!key) {
    throw new Error('RAWG_API_KEY environment variable is not set. Get your free key at https://rawg.io/apidocs')
  }
  return key
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = getApiKey()
    const searchParams = request.nextUrl.searchParams
    
    const params = new URLSearchParams()
    params.set('key', apiKey)
    
    // Forward allowed params
    const allowedParams = ['page', 'page_size', 'ordering', 'search', 'genres', 'platforms', 'tags', 'dates', 'metacritic', 'exclude_stores']
    allowedParams.forEach(param => {
      const value = searchParams.get(param)
      if (value) params.set(param, value)
    })
    
    const url = `${RAWG_BASE_URL}/games?${params.toString()}`
    
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Invalid API key. Please check your RAWG_API_KEY.' }, { status: 401 })
      }
      return NextResponse.json({ error: `RAWG API error: ${response.status}` }, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error && error.message.includes('RAWG_API_KEY')) {
      return NextResponse.json({ 
        error: 'API key not configured',
        setup: 'Add RAWG_API_KEY to your .env.local file. Get a free key at https://rawg.io/apidocs'
      }, { status: 503 })
    }
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 })
  }
}
