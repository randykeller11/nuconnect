import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Use service role client to bypass RLS policies
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const objectKey = `${user.id}.${Date.now()}.${ext}` // bucket-relative

    // Upload file using service role
    const { error: uploadError } = await serviceSupabase.storage
      .from('avatars')
      .upload(objectKey, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type, // ensure correct MIME
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data } = serviceSupabase.storage.from('avatars').getPublicUrl(objectKey)
    const publicUrl = data.publicUrl

    // Update profile with new avatar URL using service role
    const { error: updateError } = await serviceSupabase
      .from('profiles')
      .update({
        profile_photo_url: publicUrl, // full URL for rendering
        avatar_url: objectKey,        // bucket-relative key for storage ops
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ 
      path: objectKey,
      url: publicUrl
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
