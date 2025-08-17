Here’s an `instructions.md` you can hand to Aider. It’s written as concrete, repo-scoped steps with exact code edits and sanity checks. I’ve also called out that the **most likely culprit is the path including the bucket name (`avatars/…`)**, which can produce broken public URLs; Supabase expects **paths relative to the bucket**, not including the bucket id. ([Supabase][1])

---

# instructions.md

## Goal

Fix avatar image rendering by:

1. Storing the **bucket-relative key** (no bucket name prefix) in `profiles.avatar_url`.
2. Storing the **full public URL** in `profiles.profile_photo_url`.
3. Always rendering a **full URL** (either the stored one or computed via `getPublicUrl(key)`).
4. Ensuring the server route has a real `user.id` and sets `contentType` on upload.
5. (If using `<Image>`) Whitelisting the Supabase hostname in `next.config.js`.

> **Likely culprit (fix first):** Uploading with a path like `avatars/${user.id}.jpg` while already calling `.from('avatars')`. Paths must be **relative to the bucket** (e.g., `${user.id}.jpg`), otherwise you can end up with a broken URL such as `…/public/avatars/avatars/…`. Supabase’s docs specify that `upload` and `getPublicUrl` use paths **relative to the bucket**, e.g., `folder/file.png`. ([Supabase][1])

---

## 1) Server upload route: make keys bucket-relative and set `contentType`

**File:** `app/api/upload/avatar/route.ts`

### A) Change the object key (remove bucket prefix)

* **Find:**

```ts
const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
const path = `avatars/${user.id}.${Date.now()}.${ext}`
```

* **Replace with:**

```ts
const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
const objectKey = `${user.id}.${Date.now()}.${ext}` // bucket-relative
```

### B) Upload with `contentType` and use the bucket-relative key everywhere

* **Find (upload call & public URL):**

```ts
const { error: uploadError } = await serviceSupabase.storage
  .from('avatars')
  .upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })

const { data } = serviceSupabase.storage.from('avatars').getPublicUrl(path)
const publicUrl = data.publicUrl
```

* **Replace with:**

```ts
const { error: uploadError } = await serviceSupabase.storage
  .from('avatars')
  .upload(objectKey, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type, // ensure correct MIME
  })
if (uploadError) throw uploadError

const { data } = serviceSupabase.storage.from('avatars').getPublicUrl(objectKey)
const publicUrl = data.publicUrl
```

> Supabase recommends providing `contentType` on upload for correct handling. ([Supabase][2])

### C) Update DB with the correct values

* **Find:**

```ts
.update({ 
  profile_photo_url: publicUrl,
  avatar_url: path,
  updated_at: new Date().toISOString()
})
```

* **Replace with:**

```ts
.update({
  profile_photo_url: publicUrl, // full URL for rendering
  avatar_url: objectKey,        // bucket-relative key for storage ops
  updated_at: new Date().toISOString()
})
```

### D) Ensure `user` is real in route handler (App Router SSR auth pattern)

If `user` is sometimes `null`, switch to the official Next.js App Router server-side auth client so cookies are read properly in route handlers. Follow Supabase’s “Server-Side Auth for Next.js (App Router)” guide to create a server client that uses `cookies()` and then call `supabase.auth.getUser()` from that client. ([Supabase][3])

---

## 2) Public URL helper: expect a bucket-relative key

**File:** `lib/storage.ts`

* **Ensure it looks like:**

```ts
export function getAvatarUrl(path: string | null) {
  if (!path) return null
  const supabase = supabaseBrowser()
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}
```

> `getPublicUrl` expects a **bucket-relative** path such as `folder/filename.png` or `filename.png`, not `avatars/filename.png`. ([Supabase][4])

---

## 3) UI: never render `avatar_url` directly; always use a full URL

**Files:**

* `app/profile/page.tsx`
* `app/home/page.tsx`
* `app/profile/edit/page.tsx`

### A) Read-only pages

* **Find:**

```tsx
{profile?.profile_photo_url || profile?.avatar_url ? (
  <img
    src={profile.profile_photo_url || profile.avatar_url}
    ...
  />
```

* **Replace with:**

```tsx
{profile?.profile_photo_url || profile?.avatar_url ? (
  <img
    src={profile.profile_photo_url || getAvatarUrl(profile.avatar_url) || ''}
    ...
  />
```

### B) Edit page (pattern already correct—keep it)

* Ensure it remains:

```tsx
<img
  src={form.profile_photo_url || getAvatarUrl(form.avatar_url) || ''} 
  ...
/>
```

---

## 4) (If using Next `<Image>`) allow Supabase domain

**File:** `next.config.js`

* **Add:**

```js
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/avatars/**',
      },
    ],
  },
}
```

This avoids “hostname is not configured” errors when rendering remote images. ([Stack Overflow][5], [Next.js][6])

---

## 5) Clean-up & data consistency

1. In the Supabase **Storage → avatars** bucket, confirm object keys are like `72df...jpg` (no leading `avatars/` inside the bucket). If you previously uploaded with `avatars/…`, you may see a folder named `avatars` **inside** the bucket. Files there will still work **if** you consistently use the **bucket-relative** key (`avatars/72df...jpg`) everywhere. The safest path forward is to standardize on **no bucket prefix** for new uploads and migrate old references as needed. (Docs consistently show bucket-relative paths.) ([Supabase][1])
2. In the `profiles` table, ensure:

   * `avatar_url` = the **bucket-relative key** (e.g., `72df...jpg` or `avatars/72df...jpg` if you intentionally keep that inner folder).
   * `profile_photo_url` = the **full public URL** (should load directly in a new tab).
3. Test a new upload and verify the generated `publicUrl` opens in a new tab (200 OK). ([Supabase][7])

---

## 6) Smoke tests

* [ ] Upload a new avatar and confirm DB row has `avatar_url` = bucket-relative key, `profile_photo_url` = full URL.
* [ ] Visit the `profile_photo_url` in a new tab — it should render the image (no auth needed if bucket is public). ([Supabase][4])
* [ ] UI pages render the image using either the stored `profile_photo_url` or `getAvatarUrl(avatar_url)`.
* [ ] If using `<Image>`, no “hostname not configured” error. ([Stack Overflow][5])
* [ ] Route handler obtains a non-null `user.id` per the App Router SSR guide. ([Supabase][3])

---

## References

* Supabase Storage `getPublicUrl` (expects bucket-relative path). ([Supabase][4])
* Supabase Storage `upload` parameters & path format (bucket-relative). ([Supabase][1])
* Storage guide (contentType on upload). ([Supabase][2])
* Next.js images configuration / remote hosts. ([Stack Overflow][5], [Next.js][6])
* Next.js + Supabase server-side auth (App Router). ([Supabase][3])

---

### Notes for Aider

* Prefer exact, minimal diffs per file as specified above.
* Do **not** refactor unrelated code.
* Keep the existing form logic and toasts intact; only touch the upload path, DB update fields, helper usage, and Next image config.
* If older uploads live under an inner `avatars/` folder inside the bucket, **do not** break them—`getAvatarUrl` will work as long as `avatar_url` exactly matches the bucket-relative key you see in the console (e.g., `avatars/old-file.jpg`).

[1]: https://supabase.com/docs/reference/javascript/storage-from-upload?utm_source=chatgpt.com "JavaScript: Upload a file"
[2]: https://supabase.com/docs/guides/storage/uploads/standard-uploads?utm_source=chatgpt.com "Standard Uploads | Supabase Docs"
[3]: https://supabase.com/docs/guides/auth/server-side/nextjs?utm_source=chatgpt.com "Setting up Server-Side Auth for Next.js"
[4]: https://supabase.com/docs/reference/javascript/storage-from-getpublicurl?utm_source=chatgpt.com "JavaScript: Retrieve public URL | Supabase Docs"
[5]: https://stackoverflow.com/questions/76164057/next-js-hostname-not-configured-under-images-in-next-config-js-even-though-remot?utm_source=chatgpt.com "Next.js hostname not configured under images in ..."
[6]: https://nextjs.org/docs/app/api-reference/config/next-config-js/images?utm_source=chatgpt.com "images - next.config.js"
[7]: https://supabase.com/docs/guides/storage?utm_source=chatgpt.com "Storage | Supabase Docs"
