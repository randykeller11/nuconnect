'use client'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

type Props = { userId: string; onSaved?: (publicUrl: string, path:string)=>void }

export default function AvatarUploader({ userId, onSaved }: Props){
  const [busy, setBusy] = useState(false)
  const supabase = createSupabaseBrowserClient()

  async function onSelect(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `u/${userId}/avatar.${ext}`

      // Upload (upsert)
      const { error: upErr } = await supabase
        .storage.from('avatars')
        .upload(path, file, { upsert: true, cacheControl: '3600' })
      if (upErr) throw upErr

      // Public URL (Option A: public bucket)
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = data.publicUrl

      // Update profile
      const { error: updErr } = await supabase
        .from('profiles')
        .update({ profile_photo_url: publicUrl, profile_photo_path: path, profile_photo_updated_at: new Date().toISOString() })
        .eq('user_id', userId)
      if (updErr) throw updErr

      onSaved?.(publicUrl, path)
    } catch (err) {
      console.error('avatar upload failed', err)
      alert('Upload failed. Please try a smaller image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label className="inline-flex items-center justify-center h-10 px-4 rounded-2xl bg-inkwell text-aulait cursor-pointer">
        {busy ? 'Uploading…' : 'Upload Photo'}
        <input type="file" accept="image/*" className="hidden" onChange={onSelect}/>
      </label>
      <p className="text-xs text-muted-foreground">JPEG/PNG, up to ~5MB</p>
    </div>
  )
}
