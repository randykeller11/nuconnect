# NuConnect Matching System Issues Analysis

## Current Problem Summary

The matching system is failing because **no room members are being found** when querying the database. The logs show:

```
Room members query: {
  roomMembers: [],
  error: null,
  roomId: '608934e7-dbd5-4900-ab5f-e4881069793a',
  userId: '408df360-a87c-4b88-8b3e-ba248e8b7c72'
}
Candidate IDs: []
No room members found - returning 0 queued
```

This indicates that either:
1. The `room_members` table is empty
2. The user is not properly joined to any rooms
3. There's a database schema/relationship issue
4. The room IDs don't match between tables

## Application Architecture Context

### Current Matching Flow
1. User clicks "Start Matching" in a room
2. System calls `/api/matches/start` with `roomId`
3. API queries `room_members` table to find other users in the same room
4. System excludes the current user and any previously interacted users
5. Remaining candidates get scored and queued in `match_queue` table
6. User sees candidates via `/api/matches/next` endpoint

### Database Schema (Expected)
The matching system relies on these key tables:

**Core Tables:**
- `profiles` - User profile data (skills, industries, interests, etc.)
- `events` - Networking events
- `rooms` - Networking rooms within events
- `room_members` - Junction table linking users to rooms

**Matching Tables:**
- `match_sessions` - Tracks active matching sessions per user/room
- `match_queue` - Pre-scored candidates waiting to be shown
- `match_interactions` - Records of likes/skips per user/room/target
- `match_synergy` - AI-generated synergy briefs for mutual matches

### Current Code Behavior

**Room Joining Flow:**
1. User visits room page (`/rooms/[id]`)
2. If not a member, clicks "Join Room" 
3. Calls `/api/rooms/join` which should add entry to `room_members`
4. User then clicks "Start Matching"

**Matching Query Logic:**
```typescript
// From app/api/matches/start/route.ts
const { data: roomMembers } = await supabase
  .from('room_members')
  .select('user_id')
  .eq('room_id', roomId)
  .neq('user_id', user.id);
```

This query should return all users in the room except the current user.

## Specific Issues Identified

### 1. Empty room_members Table
The most likely issue is that the `room_members` table is empty or not being populated correctly when users join rooms.

**Expected Data Flow:**
- User joins room → Entry created in `room_members` table
- Multiple users in room → Multiple entries with same `room_id`
- Matching query finds other users → Candidates available

**Current Reality:**
- Query returns empty array → No candidates found → Matching fails

### 2. Possible Schema Mismatches
The code expects these table structures:

```sql
-- room_members table should have:
room_id (UUID, references rooms.id)
user_id (UUID, references auth.users.id or profiles.user_id)
created_at (timestamp)

-- rooms table should have:
id (UUID, primary key)
name (text)
event_id (UUID, references events.id)
member_count (integer)
```

### 3. Row Level Security (RLS) Issues
Since the app uses Supabase with RLS policies, the issue might be:
- RLS policy preventing the query from seeing room_members
- User context not properly passed to server-side queries
- Service role vs authenticated user permissions

### 4. Room Joining Logic Problems
The `/api/rooms/join` endpoint might not be:
- Actually inserting records into `room_members`
- Updating the `member_count` on the room
- Handling duplicate joins properly

## Data Verification Needed

To diagnose this issue, we need to verify:

1. **Does `room_members` table exist and have data?**
   ```sql
   SELECT * FROM room_members LIMIT 10;
   ```

2. **Are there rooms with the expected IDs?**
   ```sql
   SELECT id, name, member_count FROM rooms 
   WHERE id = '608934e7-dbd5-4900-ab5f-e4881069793a';
   ```

3. **Is the current user actually joined to any rooms?**
   ```sql
   SELECT * FROM room_members 
   WHERE user_id = '408df360-a87c-4b88-8b3e-ba248e8b7c72';
   ```

4. **Are there other users in the same room?**
   ```sql
   SELECT * FROM room_members 
   WHERE room_id = '608934e7-dbd5-4900-ab5f-e4881069793a';
   ```

## Expected vs Actual Behavior

### Expected Behavior
1. User joins room → `room_members` entry created
2. Other users also in room → Multiple `room_members` entries
3. Start matching → Query finds other users → Candidates available
4. Matching proceeds with scoring and queueing

### Actual Behavior
1. User joins room → Unknown if `room_members` entry created
2. Start matching → Query returns empty array
3. No candidates found → Matching fails immediately
4. User sees "You've seen everyone here!" message

## Technical Context for ChatGPT

### Framework & Database
- **Next.js 14** with App Router
- **Supabase** PostgreSQL database with Row Level Security
- **TypeScript** throughout
- Server-side API routes use `supabaseServer()` client

### Authentication Flow
- Supabase Auth with magic links
- User context available as `auth.uid()` in RLS policies
- Server routes get user via `await supabase.auth.getUser()`

### Current Matching Implementation
- **Session-based**: Each user/room gets a matching session
- **Queue-based**: Candidates pre-scored and stored in `match_queue`
- **Interaction tracking**: Likes/skips stored in `match_interactions`
- **Mutual detection**: When both users like each other
- **AI integration**: OpenRouter for match explanations and synergy

### Database Relationships Expected
```
events (1) → (many) rooms
rooms (1) → (many) room_members
users (1) → (many) room_members
users (1) → (many) profiles
```

## Questions for Database Analysis

1. **Schema Verification**: Do the table structures match what the code expects?
2. **Data Population**: Is the room joining process actually creating `room_members` entries?
3. **RLS Policies**: Are the security policies preventing the matching queries from working?
4. **Foreign Key Constraints**: Are the relationships properly established between tables?
5. **Seeding Issues**: Did the database seeding process populate rooms and memberships correctly?

## Immediate Next Steps

1. **Verify table contents** with direct SQL queries
2. **Test room joining flow** to ensure `room_members` entries are created
3. **Check RLS policies** to ensure matching queries can access data
4. **Add more detailed logging** to the room joining API endpoint
5. **Validate room IDs** are consistent between UI and database

This analysis should provide enough context for ChatGPT to cross-reference against any SQL changes that were implemented and identify the root cause of the empty `room_members` query results.
