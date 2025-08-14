'use client'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function AvatarUploader({ userId, onSaved }:{ userId:string; onSaved?:(url:string, path:string)=>void }) {
  const [busy, setBusy] = useState(false)
  const sb = createSupabaseBrowserClient()

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setBusy(true)
    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `u/${userId}/avatar.${ext}`
      const { error } = await sb.storage.from('avatars').upload(path, file, { upsert:true, cacheControl:'3600' })
      if (error) throw error

      const { data } = sb.storage.from('avatars').getPublicUrl(path)
      const url = data.publicUrl

      const { error: updErr } = await sb.from('profiles')
        .update({ profile_photo_url:url, profile_photo_path:path, profile_photo_updated_at: new Date().toISOString() })
        .eq('user_id', userId)
      if (updErr) throw updErr

      onSaved?.(url, path)
    } catch (e) {
      console.error(e); alert('Upload failed. Try a smaller image.')
    } finally { setBusy(false) }
  }

  return (
    <label className="inline-flex h-10 items-center justify-center rounded-2xl bg-inkwell px-4 text-aulait cursor-pointer">
      {busy ? 'Uploading…' : 'Upload Photo'}
      <input type="file" accept="image/*" className="hidden" onChange={onPick} />
    </label>
  )
}
