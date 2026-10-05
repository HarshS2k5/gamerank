import { NextRequest, NextResponse } from 'next/server'
import { GameDataProvider, AIMatchCriteria } from '@/lib/provider'

export async function POST(request: NextRequest) {
  try {
    const criteria: AIMatchCriteria = await request.json()
    const matches = await GameDataProvider.findGameMatches(criteria)

    return NextResponse.json({
      success: true,
      count: matches.length,
      results: matches,
    })
  } catch (error) {
    console.error('AI Finder API error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI game match search' },
      { status: 500 }
    )
  }
}
