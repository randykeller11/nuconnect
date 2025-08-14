-- Idempotent adds to support AI enrichment & avatars

alter table public.profiles
  add column if not exists profile_photo_path text,             -- storage path (e.g., u/<uid>/avatar.jpg)
  add column if not exists profile_photo_updated_at timestamptz,
  add column if not exists ai_bio text,                         -- AI drafted networking bio
  add column if not exists ai_tags text[] default '{}',         -- AI suggested tags (normalized)
  add column if not exists onboarding_state jsonb default '{}'::jsonb; -- small server-side cache (e.g., asked/answered)

-- helpful index
create index if not exists idx_profiles_updated_at on public.profiles(updated_at);

-- Make sure the bucket is public
update storage.buckets set public = true where id = 'avatars';

-- Allow read for anyone (public bucket handles this automatically)
-- Restrict writes to authenticated users only
drop policy if exists "avatars-insert-authenticated" on storage.objects;
create policy "avatars-insert-authenticated" on storage.objects
for insert to authenticated
with check (bucket_id = 'avatars');

drop policy if exists "avatars-update-owner" on storage.objects;
create policy "avatars-update-owner" on storage.objects
for update to authenticated
using (bucket_id = 'avatars' and owner = auth.uid())
with check (bucket_id = 'avatars' and owner = auth.uid());

drop policy if exists "avatars-delete-owner" on storage.objects;
create policy "avatars-delete-owner" on storage.objects
for delete to authenticated
using (bucket_id = 'avatars' and owner = auth.uid());
