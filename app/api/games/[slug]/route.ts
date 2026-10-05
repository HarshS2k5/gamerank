import { NextRequest, NextResponse } from 'next/server'

const RAWG_BASE_URL = 'https://api.rawg.io/api'

function getApiKey() {
  const key = process.env.RAWG_API_KEY
  if (!key) throw new Error('RAWG_API_KEY not configured')
  return key
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const apiKey = getApiKey()
    const { slug } = params
    
    const url = `${RAWG_BASE_URL}/games/${slug}?key=${apiKey}`
    
    const response = await fetch(url, {
      next: { revalidate: 3600 * 24 }, // Cache game details for 24 hours
      signal: AbortSignal.timeout(10000),
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 })
      }
      return NextResponse.json({ error: `RAWG API error: ${response.status}` }, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error && error.message.includes('RAWG_API_KEY')) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 })
  }
}
