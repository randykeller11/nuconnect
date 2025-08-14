export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { handleLinkedInOAuth, importFromLinkedInUrl, getDevMockProfile } from '../../../../lib/integrations/linkedin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, token, url } = body
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      )
    }
    
    let result
    
    switch (provider) {
      case 'linkedin':
        if (token) {
          // OAuth flow
          result = await handleLinkedInOAuth(token)
        } else if (url) {
          // Manual URL import
          result = await importFromLinkedInUrl(url)
        } else {
          // Dev mock fallback
          result = getDevMockProfile()
        }
        break
        
      default:
        return NextResponse.json(
          { error: 'Unsupported provider' },
          { status: 400 }
        )
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
    
    // Store enrichment data (in production, this would go to profiles.enrich.linkedin)
    const enrichData = {
      provider,
      importedAt: new Date().toISOString(),
      profile: result.profile
    }
    
    return NextResponse.json({
      success: true,
      profile: result.profile,
      enrich: enrichData
    })
    
  } catch (error) {
    console.error('Error importing profile:', error)
    return NextResponse.json(
      { error: 'Failed to import profile' },
      { status: 500 }
    )
  }
}
