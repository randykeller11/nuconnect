// This route is deprecated - use /api/matches/start and /api/matches/next instead
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  return NextResponse.json({ 
    error: 'This endpoint is deprecated. Use /api/matches/start to begin matching.' 
  }, { status: 410 })
}
