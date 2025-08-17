# Supabase Storage Bucket Logic for Avatar Photos

## Overview
This document explains how NuConnect manages avatar photo uploads using Supabase Storage and stores the URLs in the profiles table.

## Storage Architecture

### Bucket Configuration
- **Bucket Name**: `avatars`
- **Public Access**: Yes (images are publicly accessible)
- **File Size Limit**: 5MB
- **Allowed MIME Types**: image/jpeg, image/png, image/webp, image/gif

### File Path Convention
Files are stored with the following path structure:
```
avatars/{user_id}.{timestamp}.{extension}
```

Example: `avatars/72df85ea-5ebc-43e2-a39a-5fd40bc1596a.1734567890123.jpg`

## Database Schema

### Profiles Table Fields
The `profiles` table stores avatar information in these fields:

1. **`profile_photo_url`** (text): The full public URL to access the image
   - Example: `https://ymxhgdcezmcrrzqdhble.supabase.co/storage/v1/object/public/avatars/user123.1734567890.jpg`
   - This is what gets displayed in the UI

2. **`avatar_url`** (text): The storage path/key within the bucket
   - Example: `avatars/user123.1734567890.jpg`
   - This is used for storage operations (delete, update)

## Upload Flow

### 1. Client-Side Upload Trigger
```typescript
// In app/profile/edit/page.tsx
async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file || !userId) return

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData
    })

    const { path, url } = await response.json()
    // Update form state with both path and URL
    setForm((f: any) => ({ ...f, avatar_url: path, profile_photo_url: url }))
  } catch (err: any) {
    toast.error('Upload failed: ' + err.message)
  }
}
```

### 2. Server-Side Upload Processing
```typescript
// In app/api/upload/avatar/route.ts
export async function POST(req: NextRequest) {
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. Extract file from FormData
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  // 3. Generate unique file path
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `avatars/${user.id}.${Date.now()}.${ext}`
  
  // 4. Upload to Supabase Storage using service role
  const { error: uploadError } = await serviceSupabase.storage
    .from('avatars')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })
  
  // 5. Get public URL
  const { data } = serviceSupabase.storage.from('avatars').getPublicUrl(path)
  const publicUrl = data.publicUrl
  
  // 6. Update profiles table with both path and URL
  await serviceSupabase
    .from('profiles')
    .update({ 
      profile_photo_url: publicUrl,  // Full URL for display
      avatar_url: path,              // Storage path for operations
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
  
  return NextResponse.json({ path, url: publicUrl })
}
```

## Display Logic

### Profile Pages
```typescript
// In app/profile/page.tsx and app/home/page.tsx
{profile?.profile_photo_url || profile?.avatar_url ? (
  <img
    src={profile.profile_photo_url || profile.avatar_url}
    alt={profile.name}
    className="w-24 h-24 rounded-full object-cover"
  />
) : (
  <div className="w-24 h-24 bg-gradient-to-br from-inkwell to-lunar rounded-full">
    <span className="text-3xl font-bold text-aulait">
      {profile?.name?.charAt(0) || 'U'}
    </span>
  </div>
)}
```

### Edit Profile Page
```typescript
// In app/profile/edit/page.tsx
{form.profile_photo_url || form.avatar_url ? (
  <img 
    src={form.profile_photo_url || getAvatarUrl(form.avatar_url) || ''} 
    alt="Avatar" 
    className="w-full h-full object-cover" 
  />
) : (
  <div className="w-full h-full flex items-center justify-center text-lunar">
    <span className="text-2xl font-bold">
      {form.first_name?.[0]?.toUpperCase() || '?'}
    </span>
  </div>
)}
```

## URL Generation

### Public URL Structure
Supabase generates public URLs in this format:
```
https://{project_ref}.supabase.co/storage/v1/object/public/{bucket_id}/{file_path}
```

Example:
```
https://ymxhgdcezmcrrzqdhble.supabase.co/storage/v1/object/public/avatars/72df85ea-5ebc-43e2-a39a-5fd40bc1596a.1734567890123.jpg
```

### Helper Function
```typescript
// In lib/storage.ts
export function getAvatarUrl(path: string | null) {
  if (!path) return null
  const supabase = supabaseBrowser()
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}
```

## Security & Permissions

### RLS Policies
The storage bucket uses Row Level Security with these policies:

1. **Public Read**: Anyone can view avatar images
2. **Authenticated Upload**: Only authenticated users can upload
3. **User-Specific Operations**: Users can only modify their own avatars

### Service Role Usage
The upload API uses the service role client to bypass RLS policies:
```typescript
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
```

## Error Handling

### Common Issues
1. **"Bucket not found"**: The avatars bucket doesn't exist
2. **"Unauthorized"**: User not authenticated or RLS policy blocking
3. **"File too large"**: Exceeds 5MB limit
4. **"Invalid file type"**: Not an allowed image format

### Troubleshooting
- Verify bucket exists and is public
- Check RLS policies are correctly configured
- Ensure service role key has storage permissions
- Validate file size and type before upload

## Data Flow Summary

1. **Upload**: File → Storage Bucket → Generate Public URL
2. **Store**: Save both `avatar_url` (path) and `profile_photo_url` (full URL) in profiles table
3. **Display**: Use `profile_photo_url` for direct image rendering
4. **Operations**: Use `avatar_url` for storage operations (delete, replace)

This dual-field approach provides flexibility for both display and storage management while maintaining backward compatibility.
