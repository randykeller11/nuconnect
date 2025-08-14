-- Idempotent adds to support AI enrichment & avatars

alter table public.profiles
  add column if not exists profile_photo_path text,             -- storage path (e.g., u/<uid>/avatar.jpg)
  add column if not exists profile_photo_updated_at timestamptz,
  add column if not exists ai_bio text,                         -- AI drafted networking bio
  add column if not exists ai_tags text[] default '{}',         -- AI suggested tags (normalized)
  add column if not exists onboarding_state jsonb default '{}'::jsonb; -- small server-side cache (e.g., asked/answered)

-- helpful index
create index if not exists idx_profiles_updated_at on public.profiles(updated_at);
