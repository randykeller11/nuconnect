Got it—here’s your **updated `instructions.md`** with LinkedIn/GitHub OAuth removed and a revamped, low-friction onboarding/profile plan that still yields rich, high-signal data. It’s granular, implementation-ready, and keeps the **Build → Test → Move on** cadence.

---

# NuConnect — Polished Demo Build Plan (Granular, No SQL, Dual-Mode Auth)

> **Note:** This version supports **Magic Link (OTP email)** as the primary flow for low-friction onboarding, with **Password login** available as a fallback for power users or edge cases.
> Prereqs: You already ran the SQL in Supabase.
> Tooling: Next.js App Router, Supabase JS + `@supabase/ssr`, Tailwind + shadcn/ui, Zod, Playwright, Jest/RTL, MSW/Supertest.
> Flow per milestone: **Build → Test → Move on**.

---

## Step 0 — Environment & Auth Setup (dual-mode, one-time)

### Build

1. **Dependencies**

   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. **Middleware—Enable SSR auth token refresh**

   ```ts
   // middleware.ts
   import { createMiddlewareClient } from '@supabase/ssr'
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'

   export async function middleware(req: NextRequest) {
     const res = NextResponse.next()
     const supabase = createMiddlewareClient({ req, res })
     await supabase.auth.getSession()
     return res
   }

   export const config = {
     matcher: ['/((?!_next|static|favicon.ico|robots.txt).*)'],
   }
   ```

3. **Supabase clients**

   ```ts
   // lib/supabase/server.ts
   import { createServerClient } from '@supabase/ssr'
   import { cookies } from 'next/headers'

   export function createSupabaseServerClient() {
     const cookieStore = cookies()
     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           get: (name) => cookieStore.get(name)?.value,
           set: () => {},
           remove: () => {},
         },
       }
     )
   }

   // lib/supabase/browser.ts
   import { createBrowserClient } from '@supabase/ssr'

   export const supabaseBrowser = () =>
     createBrowserClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     )
   ```

4. **Auth UI—support both Magic Link and Password**

   ```tsx
   // app/auth/page.tsx (client component)
   'use client'
   import { supabaseBrowser } from '@/lib/supabase/browser'
   import { useState } from 'react'
   import { toast } from 'sonner'

   export default function AuthPage() {
     const [mode, setMode] = useState<'magic' | 'password'>('magic')
     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')

     async function onSubmit() {
       const supabase = supabaseBrowser()
       if (mode === 'magic') {
         const { error } = await supabase.auth.signInWithOtp({
           email,
           options: {
             emailRedirectTo: `${window.location.origin}/auth/callback`,
             shouldCreateUser: true,
           },
         })
         error
           ? toast.error('Failed to send Magic Link. Try again.')
           : toast.success('Check your email for a magic link.')
       } else {
         const { data, error } = await supabase.auth.signInWithPassword({ email, password })
         if (error) return toast.error('Login failed: ' + error.message)
         router.push('/auth/callback')
       }
     }

     return (
       <div>
         <h1>Login or Sign Up</h1>
         <button
           onClick={() => setMode('magic')}
           className={mode === 'magic' ? 'active' : ''}
         >
           Magic Link
         </button>
         <button
           onClick={() => setMode('password')}
           className={mode === 'password' ? 'active' : ''}
         >
           Password
         </button>

         <form onSubmit={(e) => {e.preventDefault(); onSubmit()}}>
           <input
             type="email"
             placeholder="Email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
           />
           {mode === 'password' && (
             <input
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />
           )}
           <button type="submit">
             {mode === 'magic' ? 'Send Magic Link' : 'Sign In'}
           </button>
         </form>
       </div>
     )
   }
   ```

5. **Auth callback—redirect based on profile presence**

   ```tsx
   // app/auth/callback/page.tsx
   'use client'
   import { useEffect } from 'react'
   import { useRouter } from 'next/navigation'
   import { supabaseBrowser } from '@/lib/supabase/browser'

   export default function Callback() {
     const router = useRouter()
     useEffect(() => {
       ;(async () => {
         const supabase = supabaseBrowser()
         const { data: { user } } = await supabase.auth.getUser()
         if (!user) return router.replace('/auth')
         const res = await fetch('/api/me/profile')
         const { hasProfile } = await res.json()
         router.replace(hasProfile ? '/home' : '/onboarding')
       })()
     }, [router])
     return null
   }
   ```

### Test

* **Integration**: `tests/auth/signin.test.ts` (Magic Link, password, error UX, redirects)
* **E2E**: `auth.e2e.spec.ts` — user uses magic link (or password), lands on `/onboarding`

---

## Step 1 — Onboarding 2.0 (low friction → high signal; manual LinkedIn URL)

**Goal:** In ≤2 minutes, capture just enough to deliver first matches, then progressively deepen.

### Build

1. **Validation**

   * `lib/validation/profile.ts` (Zod):

     * enums: `seniority ∈ ['student','junior','mid','senior','lead','exec','founder']`
     * caps: `industries≤3`, `skills≤5`, `interests≤7`, `objectives≤4`, `seeking≤3`
     * normalization: trim, lowercase, dedupe arrays; URLs validated (`linkedin_url`, `website_url`, `x_url`, etc.)

2. **State machine**

   * `lib/onboarding/machine.ts`:

     * `snapshotComplete`: `role` AND (`company` OR `headline`)
     * `focusComplete`: `industries.length≥1` OR `skills.length≥2`
     * `intentComplete`: `objectives.length≥1` AND `seeking.length≥1`
     * next/prev, save points, ability to resume

3. **API routes**

   * `app/api/onboarding/save/route.ts` (POST):

     * Auth required. Accept partial payload → Zod validate/normalize → **merge** into `public.profiles` for `auth.uid()`.
     * Never erase existing fields unless explicitly passed `null`.
     * Return merged row.

4. **UI components**

   * Shell: `components/onboarding/OnboardingShell.tsx` (title, subtitle, stepper, back/next, autosave indicator).

   * Steps:

     * `StepWelcome.tsx`

       * One sentence benefit: “Fill 2 quick screens to get curated matches.”
       * Buttons: **Continue** (email user is already signed in).
     * `StepSnapshot.tsx`

       * Fields: `role`, `company`, `location`, `headline` (1-line), `seniority`.
       * Links section: `linkedin_url` (paste URL), `website_url` (optional).
       * UX: **If any fields preexist** (from previous session), show collapsed with “Edit”.
       * Persist on blur/Next → POST `/api/onboarding/save`.
     * `StepFocus.tsx`

       * Chips w/ typeahead: `industries[]`, `skills[]`, `interests[]`.
       * Inline hint: “Pick a few—this powers matching.”
     * `StepIntent.tsx`

       * Chips: `objectives[]` (e.g., hire, find mentor, mentee, cofounder, learn-X, raise, invest, collab)
       * Chips: `seeking[]` (mentors, mentees, peers, investors, talent, customers)
       * `preferences`: openness slider (1–5), intro style ('short'|'detailed'), icebreakers (bool)
     * `StepReview.tsx`

       * Summary + inline edit
       * Contact sharing prefs (stored in `contact_prefs`): which links can be shown **on mutual reveal**
       * CTA: **Finish & See Matches**

   * Shared UI:

     * `components/ui/ChipsMultiSelect.tsx` (searchable, capped)
     * `components/ui/UrlField.tsx` (URL validation + favicon preview)

5. **Routing**

   * After submit: if deep-linked to a room → `/rooms/[id]`; else `/home`.

### Test

* **Unit**: `validation/profile.test.ts` (caps, enums, dedupe, URL validity); `onboarding/machine.test.ts` (guards; resume).
* **Integration**: `/api/onboarding/save.test.ts` (partial merges, RLS respected).
* **E2E**: `onboarding.e2e.spec.ts` — 2 screens + intent + review, mobile viewport 390×844; refresh mid-flow resumes; finish routes to room/home.

---

## Step 2 — Matching v2 (hybrid scoring + short AI explanation)

### Build

1. **Scoring** — `lib/matching/score.ts`

   * Weights:

     * industries +3 (cap 2), skills +2 (cap 4), interests +1 (cap 5)
     * mentorship/“seeking” compatibility +3 (mentee↔mentor; peers when both seek peers)
     * seniority peer +2
     * objectives complement +2 (hire↔talent, find-mentor↔mentors, raise↔investors)
     * same company penalty −2
   * Output: `{ score: number, sharedTopics: string[] }`

2. **Explanation** — `lib/matching/explain.ts`

   * Call OpenRouter with 2s timeout; on timeout/error → `''`
   * 15-min in-memory cache by `{roomId, userA, userB}`

3. **API** — `app/api/rooms/[id]/match/route.ts`

   * Auth + ensure caller is `room_members` member
   * Candidate pool = others in room; compute scores; sort
   * Apply boosts (`priority_visibility`, `extra_matches` → cap 5 else 3)
   * Get `ai_explanation` best-effort
   * Persist to `public.matches` (score, shared\_topics, ai\_explanation)
   * Return array: `{ user:{id,name,headline,role,company,location,profile_photo_url,linkedin_url}, match_score, shared_topics, ai_explanation }`

### Test

* **Unit**: `matching/score.test.ts`, `matching/explain.test.ts`
* **Integration**: `/api/rooms/[id]/match.test.ts` (membership, count, boosts, persistence)
* **E2E**: `match-flow.spec.ts` — two users in same room see each other in top matches (explanation or empty).

---

## Step 3 — Realtime Roster (“Who’s in the Room”)

### Build

1. **Presence**

   * Join channel `presence:room:{roomId}` on `app/rooms/[id]/page.tsx` mount with payload:

     ```ts
     { user_id, profile: { name, role, company, headline } }
     ```
   * Heartbeat every 30s → `POST /api/rooms/[id]/presence/heartbeat` to update `room_presence.last_seen`.

2. **Roster UI** — `components/room/Roster.tsx`

   * Card grid: avatar, name, role @ company, presence dot
   * Filters: interests, mentor/mentee toggle
   * Sorts: “Most aligned to me” (client-side quick score), “Newest”
   * Spotlight strip: top candidates

### Test

* **Unit**: `roster/filter-sort.test.ts`
* **Integration**: `/api/rooms/[id]/presence.test.ts` (member-only upsert/read; last\_seen updates)
* **E2E**: `presence.spec.ts` — two browsers see each other; filters/sorts function.

---

## Step 4 — Contact Reveal & Connections

### Build

1. **Share contact modal** (from a match card)

   * User selects fields to share: `linkedin_url`, `website_url`, `email` (if opted), `phone` (if provided), socials
   * `POST app/api/matches/[id]/share-contact/route.ts`:

     * Auth + must be `user_a` or `user_b`
     * Upsert `public.contact_shares (match_id, user_id, payload)`
     * Compute `mutual` = both sides shared → return `mutual: boolean`

2. **Connections page** — `app/connections/page.tsx`

   * List recent matches; show mutual contact cards when ready
   * Search by name or shared topic
   * Inline notes; star favorite (`connections.is_starred`)
   * `app/api/connections/route.ts` — GET (list), POST (update `{ match_id, notes, is_starred }`)

### Test

* **Unit**: `contact/reveal-logic.test.ts`
* **Integration**: `/api/matches/[id]/share-contact.test.ts`, `/api/connections.test.ts`
* **E2E**: `connections.spec.ts` — two accounts share → mutual card appears; note & star persist.

---

## Step 5 — Organizer Dashboard (attendees, AI suggestions, promote)

### Build

1. **Admin APIs** (require `ADMIN_API_KEY`)

   * `GET /api/admin/rooms/:id/attendees` → profiles + last\_seen; query params `?q=`, `?online=true`
   * `POST /api/admin/rooms/:id/suggest` → compute top pairs using `score.ts`, dedupe, persist to `ai_suggestions` (optionally add rationale via `explain.ts`)
   * `POST /api/admin/rooms/:id/actions` → `{ action:'promote'|'pair'|'dismiss', user_a, user_b, note? }` → `organizer_actions`

2. **UI** — `app/admin/events/[slug]/page.tsx`

   * **Attendees**: table with presence, filters, per-attendee “Suggest matches” drawer
   * **AI Suggestions**: list with score + rationale; **Promote** action
   * **Room Health**: members, online now, matches, mutual shares; top interests chart

### Test

* **Unit**: `admin/suggestion-engine.test.ts`
* **Integration**: `/api/admin/rooms/:id/suggest.test.ts`, `/api/admin/rooms/:id/actions.test.ts`
* **E2E**: `admin-dashboard.spec.ts` — run suggestions; promote pair; UI reflects change.

---

## Step 6 — Seed & Demo Controls

### Build

1. **Seed script** — `scripts/seed.ts`

   * Create:

     * 50 users (Supabase Admin API) with diverse `industries/skills/interests/seniority/objectives/seeking`
     * Event `demo-night` + 1 public room + 35 members
     * 30 `matches` + 20 `ai_suggestions` with short rationales
2. **Dev controls** — `app/dev/demo/page.tsx`

   * Buttons: **Reset Room Data**, **Seed Demo Data**, **Run Suggestions**

### Test

* **Integration**: `seed/consistency.test.ts` — counts, FKs, membership
* **E2E**: `demo-smoke.spec.ts` — onboard → join room → matches → contact reveal → admin promotes; all under 3 minutes.

---

## Step 7 — UI Polish & Performance

### Build

1. **Theme**

   * Apply tokens (Inkwell/Lunar/Crème/Au Lait); cards `rounded-2xl p-6 shadow-sm`
2. **Mobile-first**

   * Roster 2-col ≤ 390px; bottom sheet actions; min 44px tap targets
3. **Async UX**

   * Skeletons for roster/matches; success/error toasts
4. **Perf**

   * Timing logs in `/api/rooms/[id]/match` and `/api/admin/rooms/:id/suggest`
   * Candidate cap = 100; call `explain.ts` only for top 5 pairs

### Test

* **Visual (optional)**: snapshot core screens
* **Perf (mock AI)**: `perf/match.timing.test.ts` and `perf/suggest.timing.test.ts` < 2000 ms
* **E2E**: `ui-polish.spec.ts` — iPhone 13: no horizontal scroll; skeletons visible; toasts appear

---

## Done Criteria (demo-ready)

* Onboarding 2.0 (email sign-in, **no OAuth**) yields structured, high-signal profiles (role/company/headline/seniority + industries/skills/interests + objectives/seeking + links).
* Matching v2 returns top matches quickly with concise explanations.
* Live roster with presence, filters, sorts.
* Contact reveal is mutual-gated; connections support notes & stars.
* Organizer dashboard generates suggestions and promotes pairs.
* Seeded demo feels lively; perf budgets met; **all tests pass**.

---

If you want, I can also spit out **copy-paste Aider prompts** for each step (one “Build”, one “Test”), so you can fly through this in order.
