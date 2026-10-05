import { NextRequest, NextResponse } from 'next/server'

const RAWG_BASE_URL = 'https://api.rawg.io/api'

function getApiKey() {
  const key = process.env.RAWG_API_KEY
  if (!key) throw new Error('RAWG_API_KEY not configured')
  return key
}

// Maps ranking category to RAWG API parameters
function getCategoryParams(category: string): Record<string, string> {
  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1
  const lastYear = currentYear - 1
  
  const params: Record<string, Record<string, string>> = {
    'all-time': { ordering: '-metacritic', metacritic: '1,100' },
    'pc': { platforms: '4', ordering: '-metacritic', metacritic: '1,100' },
    'android': { platforms: '21', ordering: '-rating' },
    'ios': { platforms: '3', ordering: '-rating' },
    'playstation': { platforms: '187,18,16', ordering: '-metacritic' },
    'xbox': { platforms: '186,1,14', ordering: '-metacritic' },
    'nintendo': { platforms: '7,83', ordering: '-metacritic' },
    'cross-platform': { ordering: '-rating', exclude_stores: '', page_size: '40' },
    'free-to-play': { tags: '35078,8,69', ordering: '-rating' },
    'multiplayer': { tags: '7', ordering: '-rating' },
    'open-world': { tags: '149', ordering: '-rating' },
    'story': { tags: '406', ordering: '-rating' },
    'rpg': { genres: '5', ordering: '-metacritic' },
    'action': { genres: '4', ordering: '-metacritic' },
    'shooter': { genres: '2', ordering: '-metacritic' },
    'racing': { genres: '1', ordering: '-metacritic' },
    'horror': { genres: '19', ordering: '-rating' },
    'strategy': { genres: '10', ordering: '-metacritic' },
    'sports': { genres: '15', ordering: '-metacritic' },
    'indie': { genres: '51', ordering: '-rating' },
    'best-of-year': { dates: `${lastYear}-01-01,${currentYear}-12-31`, ordering: '-metacritic' },
    'most-popular': { ordering: '-added' },
    'upcoming': { dates: `${currentYear}-${String(new Date().getMonth()+1).padStart(2,'0')}-01,${nextYear}-12-31`, ordering: '-added' },
  }
  
  return params[category] || { ordering: '-rating' }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const apiKey = getApiKey()
    const { category } = params
    const searchParams = request.nextUrl.searchParams
    
    const categoryParams = getCategoryParams(category)
    
    const urlParams = new URLSearchParams()
    urlParams.set('key', apiKey)
    urlParams.set('page_size', searchParams.get('page_size') || '40')
    urlParams.set('page', searchParams.get('page') || '1')
    
    // Apply category-specific params
    Object.entries(categoryParams).forEach(([k, v]) => {
      if (v) urlParams.set(k, v)
    })
    
    // Allow overrides from query string
    const overridable = ['ordering', 'page', 'page_size']
    overridable.forEach(p => {
      const v = searchParams.get(p)
      if (v) urlParams.set(p, v)
    })
    
    const response = await fetch(`${RAWG_BASE_URL}/games?${urlParams.toString()}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error && error.message.includes('RAWG_API_KEY')) {
      return NextResponse.json({ error: 'API key not configured', setup: 'Add RAWG_API_KEY to .env.local' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 })
  }
}
