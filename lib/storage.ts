import { supabaseBrowser } from '@/lib/supabase/browser'

export function sbBrowser() {
  return supabaseBrowser()
}

export async function uploadAvatar(file: File, userId: string) {
  const supabase = supabaseBrowser()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `avatars/${userId}.${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) throw uploadError
  return path
}

export function getAvatarUrl(path: string | null) {
  if (!path) return null
  const supabase = supabaseBrowser()
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}
