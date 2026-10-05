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
    
    const url = `${RAWG_BASE_URL}/games/${slug}/screenshots?key=${apiKey}&page_size=12`
    
    const response = await fetch(url, {
      next: { revalidate: 3600 * 24 },
      signal: AbortSignal.timeout(10000),
    })
    
    if (!response.ok) {
      return NextResponse.json({ results: [] }, { status: 200 })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ results: [] })
  }
}
