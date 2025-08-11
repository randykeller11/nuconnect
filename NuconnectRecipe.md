# instructions.md — NuConnect Demo Build & Seed Plan (for Aider)

**Goal:**
Ship a demo-ready NuConnect MVP to show Ramallah: stripped Matrimoney foundation → NuConnect features → seeded DB → UI styled to match the wireframes.
**Stack:** Next.js (App Router) • Supabase (Postgres/Auth) • OpenRouter • Heroku • Tailwind + shadcn/ui
**Out of scope:** “Name Your Price”.

---

## 0) Branch, env, and baseline

```bash
git checkout -b nuconnect-demo
cp .env.example .env.local
```

Update `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENROUTER_API_KEY=...
ADMIN_API_KEY=dev-admin-key
NODE_ENV=development
```

**Test gate:** `npm run dev` boots, `/api/auth/*` responds, `/api/admin/*` rejects without `ADMIN_API_KEY`.

---

## 1) Prune to foundation (if not already done)

**Keep**

* `app/api/auth/{login,register,validate}/route.ts`
* `app/api/admin/**` (header-key protection)
* `components/ui/**` (shadcn)
* `lib/{query-provider.tsx,storage.ts}`
* `shared/schema.ts`
* `tailwind.config.js`, `tsconfig.json`, `next.config.js`, `Procfile`

**Remove** Matrimoney features/pages/APIs (questionnaire/shop/etc).

**Test gate:** App renders landing only, auth ok.

---

## 2) Database migrations for NuConnect

Create: `supabase/migrations/2025xxxx_nuconnect_core.sql`

```sql
-- See-only if already created (safe)
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  profile_photo_url text,
  interests text[] default '{}',
  career_goals text,
  mentorship_pref text check (mentorship_pref in ('seeking','offering','both','none')) default 'none',
  contact_prefs jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  location text,
  date_time timestamptz not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.match_rooms (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id),
  visibility text check (visibility in ('public','private')) default 'public',
  created_by uuid references auth.users(id),
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.room_members (
  room_id uuid references public.match_rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (room_id, user_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.match_rooms(id) on delete cascade,
  user_a uuid references auth.users(id) on delete cascade,
  user_b uuid references auth.users(id) on delete cascade,
  match_score numeric,
  shared_topics text[] default '{}',
  ai_explanation text,
  created_at timestamptz default now()
);

create table if not exists public.contact_shares (
  match_id uuid references public.matches(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  payload jsonb not null,
  shared_at timestamptz default now(),
  primary key (match_id, user_id)
);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  match_id uuid references public.matches(id) on delete cascade,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.boost_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text check (type in ('priority_visibility','extra_matches','save_contact_card')),
  amount_cents int default 0,
  status text default 'not_applicable',
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
create policy "profiles_owner_rw" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.room_members enable row level security;
create policy "room_members_owner_rw" on public.room_members
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.matches enable row level security;
create policy "matches_room_member_read" on public.matches
  for select using (
    exists (select 1 from public.room_members rm
            where rm.room_id = matches.room_id and rm.user_id = auth.uid())
  );

alter table public.contact_shares enable row level security;
create policy "contact_shares_owner_rw" on public.contact_shares
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.connections enable row level security;
create policy "connections_owner_rw" on public.connections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

Apply:

```bash
supabase db push   # or db reset --local if you want a clean slate
```

**Test gate:** Tables exist. You can insert/select using SQL editor.

---

## 3) AI service & pipeline

**Create** `lib/ai/openrouter.ts`:

```ts
export type ORMessage = { role: 'system'|'user'|'assistant'; content: string };
export async function openrouterChat(messages: ORMessage[], model='openai/gpt-4o-mini', temperature=0.2) {
  const key = process.env.OPENROUTER_API_KEY!;
  if (!key) throw new Error('OPENROUTER_API_KEY missing');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, temperature })
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? '';
}
```

**Add** minimal pipeline:

* `lib/pipeline/session.ts` — keep a per-user intake session (in memory first).
* `lib/pipeline/stateMachine.ts` — simple intake state machine to progress questions.
* `prompts/intake.yaml`, `prompts/match.yaml` — short deterministic templates.

**Test gate:** Unit tests (see §8) pass with fetch mocked.

---

## 4) API routes (MVP demo)

**Create** endpoints:

* `/api/intake/questions` — returns next dynamic question (from template + OpenRouter).
* `/api/intake/answers` — persists partial intake to `profiles` and advances state.
* `/api/rooms/create` — create public room (optionally attach to `events`).
* `/api/rooms/join` — user joins a room (`room_members`).
* `/api/rooms/[id]/match` — generate up to 3 matches for the caller (rank + store `matches`).
* `/api/matches/[id]/share-contact` — caller reveals chosen contact set for that match.
* `/api/connections` — list caller’s past matches; include mutual contact cards; POST to save `notes`.
* `/api/boosts` — log stubbed boosts; affect ranking/limit in `/match`.

**Matching heuristic for demo (fast & deterministic):**

1. Score overlap on `interests` (+2 each), `mentorship` compatibility (+3), and light cosine on a mini embedding (optional) or keyword overlap on `career_goals`.
2. Sort candidates; if `priority_visibility` boost exists for the candidate, add +∞ tiny epsilon so they float.
3. Slice 3 (or 5 with `extra_matches`).

**Test gate:** cURL each route → 200 with expected shape; one end-to-end room match works with seed data (after §6).

---

## 5) UI update strategy to match the wireframes

### 5.1 Theme & tokens (Tailwind)

In `tailwind.config.js` extend colors:

```js
extend: {
  colors: {
    inkwell: '#2C3639',
    lunar: '#3F4E4F',
    creme: '#A27B5B',
    aulait: '#DCD7C9'
  },
  borderRadius: { xl: '1.25rem', '2xl': '1.75rem' }
}
```

Global CSS variables (optional in `globals.css`):

```css
:root{
  --bg: #DCD7C9;       /* Au Lait */
  --card: #FFFFFF;
  --ink: #2C3639;      /* Inkwell text */
  --accent: #3F4E4F;   /* Lunar Eclipse */
  --cta: #2C3639;      /* Dark CTA */
}
body{background:var(--bg); color:var(--ink);}
```

### 5.2 Components to tweak

* **App shell:** top bar `bg-inkwell text-aulait`, rounded 2xl cards, generous padding.
* **Inputs:** large, soft radius, 1.5px border `border-lunar/30`, focus `ring-lunar`.
* **Primary button:** `bg-inkwell text-aulait`, hover `bg-lunar`, rounded-2xl, height 56px.
* **Headings:** H1 semibold tracking-tight; use same scale as mockups; add `max-w-prose`.

### 5.3 Pages to align with screens

* `/login` (or landing hero → form):

  * Full-bleed header block `bg-inkwell` with logo “N” circle; inner card sits on `aulait` background.
  * Stack fields: Name / Email / Passions & Interests / Career Goals + **Continue**.
* `/intake` wizard:

  * Title “Set up your profile” (xl/2xl), large spaced inputs, radio group for Mentor/Mentee, location, **Continue** CTA full width.
  * Keep background `aulait` for warmth and high contrast with inkwell.
* `/rooms/[id]`:

  * Card with “Join match room” → “Get matches” CTA.
  * Match items: avatar, shared topics pills (tiny `bg-lunar/20 text-inkwell`), **Share contact** button.

**Aider tasking:**

* Update existing shadcn components to use new tokens; create `components/BrandHeader.tsx`, `components/FormCard.tsx`, `components/PrimaryButton.tsx`.
* Add two pages: `app/login/page.tsx`, `app/intake/page.tsx` with the layout described.
* Keep everything mobile-first; min width iPhone 13 is fine.

**Visual test gate:** Side-by-side check with mockups (colors, spacing, rounded corners, typography).

---

## 6) Seed the database for demo

We’ll seed: users/auth, profiles, an event, a public room, memberships, and a few precomputed matches to speed up the demo.

### 6.1 Add seed script (Node)

Install deps:

```bash
npm i -D @supabase/supabase-js @faker-js/faker
```

Create `scripts/seed.ts`:

```ts
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(url, svc, { auth: { persistSession: false } });

const INTERESTS = ['AI','Climate','Fintech','Education','Health','Music','Art','Gaming','Marketing','Ops','Sales'];
const GOALS = ['find-cofounder','explore-jobs','hire','learn-ai','mentor-others','find-mentor','investors','portfolio-feedback'];

function pick<T>(arr:T[], n=3){ return faker.helpers.arrayElements(arr, n); }

async function ensureAuthUser(email:string, name:string){
  // Insert into auth via admin API
  const { data, error } = await sb.auth.admin.createUser({ email, email_confirm: true });
  if (error && !String(error.message).includes('already registered')) throw error;
  const user = data?.user ?? (await sb.from('profiles').select('user_id').eq('user_id', 'noop')).data; // dummy
  return (data?.user?.id) || (await sb.from('auth.users').select('id').eq('email', email).maybeSingle()).data?.id;
}

async function upsertProfile(user_id:string, name:string){
  const interests = pick(INTERESTS, faker.number.int({min:2,max:5}));
  const mentorship = faker.helpers.arrayElement(['seeking','offering','both','none']);
  const careerGoals = faker.helpers.arrayElement(GOALS);
  const contact = { linkedin: `https://linkedin.com/in/${faker.internet.userName()}` };

  const { error } = await sb.from('profiles').upsert({
    user_id, name,
    interests,
    career_goals: careerGoals,
    mentorship_pref: mentorship,
    contact_prefs: contact
  });
  if (error) throw error;
  return { interests, mentorship, careerGoals };
}

async function main(){
  // Create 30 users
  const users:string[] = [];
  for (let i=0;i<30;i++){
    const name = faker.person.fullName();
    const email = faker.internet.email({ firstName: name.split(' ')[0] }).toLowerCase();
    const id = await ensureAuthUser(email, name);
    if (!id) continue;
    await upsertProfile(id, name);
    users.push(id);
  }

  // Create a demo event + room
  const { data: eventRow } = await sb.from('events')
    .insert({ name: 'NuConnect Demo Night', description: 'Internal demo', location: 'Chicago', date_time: new Date().toISOString() })
    .select('*').single();

  const { data: room } = await sb.from('match_rooms')
    .insert({ name: 'Demo Room', description: 'Public demo room', event_id: eventRow!.id, visibility: 'public' })
    .select('*').single();

  // Join first 20 users to room
  await sb.from('room_members').insert(users.slice(0,20).map(u => ({ room_id: room!.id, user_id: u })));

  console.log('Seed complete:', { users: users.length, room: room!.id, event: eventRow!.id });
}

main().catch(e => { console.error(e); process.exit(1); });
```

Run:

```bash
tsx scripts/seed.ts   # or ts-node if you prefer
```

### 6.2 Optional: precompute a few matches

Create `scripts/seed-matches.ts`:

```ts
import { createClient } from '@supabase/supabase-js';
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main(){
  const { data: room } = await sb.from('match_rooms').select('id').eq('name','Demo Room').maybeSingle();
  const { data: members } = await sb.from('room_members').select('user_id').eq('room_id', room!.id);

  // naive pairings
  for (let i=0; i<members!.length-1; i+=2){
    const a = members![i].user_id, b = members![i+1].user_id;
    await sb.from('matches').insert({
      room_id: room!.id, user_a: a, user_b: b,
      match_score: 0.72, shared_topics: ['AI','Education'],
      ai_explanation: 'High overlap on AI education and mutual mentor interest.'
    });
  }
  console.log('Seeded matches for demo room.');
}
main();
```

Run:

```bash
tsx scripts/seed-matches.ts
```

**Demo flow:**

* Log in as any seeded user (or quick-create with email).
* Join “Demo Room” → click “Get matches” → immediate precomputed matches show; contact reveal works.

---

## 7) Minimal UI pages for the demo

Create/adjust:

* `app/login/page.tsx` – header block `bg-inkwell text-aulait`, centered card with Name/Email/Passions & Interests/Career Goals, **Continue**.
* `app/intake/page.tsx` – “Set up your profile” layout (big H1, inputs, radio group Mentor/Mentee, Location, full-width CTA).
* `app/rooms/[id]/page.tsx` – “Join room” & “Get matches” actions; list of matches as stacked cards with shared-topic chips; **Share Contact** button on each.
* `app/connections/page.tsx` – recent matches with any mutual contact cards; notes editor.

**UX niceties for the demo**

* Toasts on success/error (shadcn `useToast`).
* Skeletons while fetching matches.
* Store “last room id” in localStorage to speed re-entry.

**Test gate:** You can perform the full demo on your machine in < 5 minutes from a fresh DB.

---

## 8) Testing setup & gates

Install:

```bash
npm i -D jest ts-jest @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw supertest cross-fetch playwright @playwright/test
```

Add scripts to `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:e2e": "playwright test"
}
```

**Unit tests**

* `lib/ai/openrouter.test.ts` — mock `fetch`, assert headers & errors
* `lib/pipeline/stateMachine.test.ts` — intake transitions/guards
* `lib/pipeline/match-heuristic.test.ts` — scoring & boosts effect

**Integration tests**

* `app/api/intake/*.test.ts` — returns question, saves answer
* `app/api/rooms/*.test.ts` — create, join, match returns 3 (or 5 w/ extra\_matches)
* `app/api/matches/share-contact.test.ts` — mutual reveal logic

**E2E (Playwright)**

* `e2e/demo.spec.ts`:

  1. Login
  2. Intake profile
  3. Join “Demo Room”
  4. Get matches
  5. Share contact
  6. See connection history & notes

**Perf sanity**

* Log total latency of `/rooms/[id]/match`; target < 2s with seed size (20 users).

---

## 9) Deploy to Heroku (demo)

Ensure Next standalone:

```js
// next.config.js
module.exports = { output: 'standalone' }
```

`Procfile`:

```
web: node .next/standalone/server.js
```

Push:

```bash
npm run build
heroku config:set NODE_ENV=production NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=... OPENROUTER_API_KEY=... ADMIN_API_KEY=...
git push heroku nuconnect-demo:main
```

**Smoke test:** `/api/health` (add a trivial route), then run through the demo room.

---

## 10) Demo script (what to show Ramallah)

1. **Login/Sign up** → quick intake (passions, interests, goals, mentor/mentee).
2. **Join public “Demo Room”.**
3. **Get Matches** → 1–3 cards with shared topics + explanation.
4. **Share Contact** from both sides → see mutual contact card.
5. **Connections** tab → notes (“Wants to collab on youth programs”).
6. (Optional) Trigger a **Boost** and re-fetch matches to show effect.

---

## 11) Nice-to-have polish if time allows

* LinkedIn OAuth button (stub) on login.
* Avatar generators (dicebear) for profiles.
* Chips autocomplete for interests (downshift or shadcn `Command`).

---

## 12) Milestones (commit names)

1. `foundation-pruned`
2. `db-migrations-nuconnect`
3. `ai-wrapper-and-prompts`
4. `intake-flow-api-ui`
5. `rooms-matching-api-ui`
6. `contact-reveal-connections`
7. `seed-scripts-added`
8. `ui-theme-wireframe-pass`
9. `e2e-green`
10. `heroku-demo-live`

---

### Quick commands

```bash
# start db & app
supabase start
supabase db push
npm run dev

# seed
tsx scripts/seed.ts
tsx scripts/seed-matches.ts

# tests
npm test
npm run test:e2e
```

---

**Done.** This gives you: a demo-ready NuConnect with seeded users/room/matches, dynamic intake, working contact reveal, and a UI that matches the wireframes (Inkwell / Lunar / Crème Brûlée / Au Lait palette).
