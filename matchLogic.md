# NuConnect Matching System Architecture

## Overview

NuConnect implements a sophisticated matching system that connects users within specific networking rooms. The system uses a combination of profile-based scoring, mutual consent mechanics, and completion tracking to facilitate meaningful professional connections.

## Core Components

### 1. Database Schema

The matching system relies on several key database tables:

- **profiles**: User profile data including skills, industries, interests, networking goals
- **rooms**: Networking spaces tied to events where matching occurs
- **room_members**: Junction table tracking which users belong to which rooms
- **matches**: Records of user connections, including mutual match status
- **events**: Parent containers for rooms, providing context and organization

### 2. Matching Flow Architecture

#### Phase 1: Room Entry
1. Users discover rooms through events or the home dashboard
2. Users join rooms via `/api/rooms/join` endpoint
3. Room membership is recorded in `room_members` table
4. Member count is updated on the room record

#### Phase 2: Match Generation
When a user requests matches (`/api/matches` POST):

1. **Profile Retrieval**: System fetches the requesting user's complete profile
2. **Candidate Discovery**: Identifies all other room members excluding the requester
3. **Exclusion Filtering**: Removes users who have already been matched with (either direction)
4. **Scoring Algorithm**: Each candidate is scored using `scoreMatch()` function
5. **Rationale Generation**: AI-powered explanations via `explainMatchLLM()` or fallback `whySimple()`
6. **Result Ranking**: Candidates sorted by score, filtered by minimum threshold, limited to top 20

#### Phase 3: Match Presentation
The Deck component (`components/match/Deck.tsx`) presents matches as swipeable cards:

1. **Card Display**: Shows anonymized profile information (no names/photos initially)
2. **User Decision**: Skip (left arrow/button) or Connect (right arrow/button)
3. **Progress Tracking**: Visual progress bar shows completion status
4. **Keyboard Support**: Arrow keys for quick navigation

#### Phase 4: Connection Logic
When user chooses to connect (`/api/contact/share` POST):

1. **Match Record Creation**: Creates entry in `matches` table with `profile_a`, `profile_b`, `room_id`
2. **Mutual Check**: Queries for reciprocal match record
3. **Revelation Logic**: If mutual match exists, both users get full profile access
4. **Notification**: Success feedback via toast notifications

### 3. Completion Tracking System

#### Status Checking (`/api/matches/completed` POST)
- Identifies all other room members
- Counts existing matches for the requesting user
- Determines if user has matched with everyone available
- Returns completion status and statistics

#### UI State Management
- **EventsCard**: Checks completion status for all rooms, updates button states
- **RoomClient**: Disables "Get Matches" when complete, shows appropriate messaging
- **EventRoomsClient**: Modifies button behavior based on completion status

### 4. Scoring Algorithm

The matching score is calculated in `lib/matching/score.ts` using:

#### Primary Factors:
- **Interests Overlap (40% weight)**: Uses Jaccard similarity on interests arrays
- **Skills Alignment (30% weight)**: Jaccard similarity on skills arrays  
- **Industry Matching (20% weight)**: Jaccard similarity on industries arrays
- **Networking Goals (10% weight)**: Keyword matching for mentorship/cofounder goals

#### Scoring Methodology:
```javascript
// Jaccard similarity: intersection / union
function jaccard(a, b) {
  const A = new Set(a.map(x => x.toLowerCase()))
  const B = new Set(b.map(x => x.toLowerCase()))
  let inter = 0
  A.forEach(x => { if (B.has(x)) inter++ })
  const union = A.size + B.size - inter
  return union ? inter / union : 0
}

// Weighted scoring
score = jaccard(interests) * 40 + 
        jaccard(skills) * 30 + 
        jaccard(industries) * 20 +
        goalBonus * 10
```

- Final score normalized to 0-100 range
- Minimum threshold filtering removes low-quality matches

### 5. AI-Enhanced Explanations

#### OpenRouter Integration:
- Uses LLM to generate personalized match explanations
- Fallback to rule-based explanations if AI fails
- Explanations help users understand why they're matched

#### Explanation Logic (`whySimple` function):
1. **Multi-factor matches**: "You both share interests in X and have complementary Y skills"
2. **Interest-focused**: "Both passionate about X - great potential for collaboration"
3. **Skill-focused**: "Your shared expertise in X could lead to interesting discussions"
4. **Industry-focused**: "Both working in X with complementary backgrounds"
5. **High-score fallback**: "Strong professional alignment and complementary goals"
6. **Default**: "Interesting background differences that could spark valuable conversations"

## Data Flow Diagrams

### Match Request Flow
```
User clicks "Get Matches" 
→ POST /api/matches {roomId}
→ Fetch user profile
→ Get room members (exclude self)
→ Filter already-matched users
→ Score remaining candidates
→ Generate AI explanations
→ Return ranked matches
→ Display in Deck component
```

### Connection Flow
```
User clicks "Connect"
→ POST /api/contact/share {toUserId, roomId}
→ Create match record
→ Check for mutual match
→ If mutual: reveal profiles + show modal
→ If not mutual: show "request sent" toast
→ Advance to next card
```

### Completion Check Flow
```
Component mounts
→ POST /api/matches/completed {roomId}
→ Get all room members
→ Count user's existing matches
→ Calculate completion percentage
→ Update UI button states
```

## Key Business Logic Rules

### 1. Mutual Consent Model
- Connections require both users to express interest
- One-sided matches remain hidden until reciprocated
- Full profile revelation only occurs on mutual match

### 2. Room-Scoped Matching
- Matches are contextual to specific rooms/events
- Users can have different match pools in different rooms
- Room membership required for match eligibility

### 3. Completion States
- Users can "complete" a room by matching with all available members
- Completed rooms disable matching UI and show appropriate messaging
- New room members reset completion status for existing users

### 4. Progressive Disclosure
- Initial match cards show limited, anonymized information
- Full profiles revealed only after mutual connection
- Gradual trust-building through the matching process

## Technical Implementation Details

### State Management
- React hooks for local component state
- Server-side data fetching for match generation
- Real-time UI updates based on user actions

### Error Handling
- Graceful degradation when AI explanations fail
- Toast notifications for connection status
- Loading states during async operations

### Performance Considerations
- Match scoring happens server-side to protect algorithms
- Results cached and paginated (top 20 matches)
- Efficient database queries with proper indexing needs

### Security & Privacy
- Profile data filtered before client transmission
- Match algorithms run server-side only
- User consent required for all profile sharing

## Current Implementation Gaps & Issues

### 1. React Hooks Violations
- The Deck component has conditional useEffect calls that violate Rules of Hooks
- Need to ensure all hooks are called in consistent order

### 2. Missing Features
- No real-time notifications for mutual matches
- Limited analytics on match success rates
- No user feedback mechanism to improve matching

### 3. Scalability Concerns
- All room members loaded into memory for matching
- No pagination for large rooms
- Scoring algorithm runs for every match request

## Integration Points

### Authentication
- Supabase auth integration for user identity
- Server-side user context in all matching endpoints

### Database
- Supabase PostgreSQL for all persistent data
- Real-time subscriptions could be added for live updates

### AI Services
- OpenRouter API for enhanced match explanations
- Fallback logic ensures system works without AI

## Future Enhancement Opportunities

### 1. Real-time Features
- Live notifications when mutual matches occur
- Real-time room member updates
- WebSocket integration for instant feedback

### 2. Advanced Matching
- Machine learning-based scoring improvements
- User feedback integration to improve match quality
- Temporal factors (availability, event timing)
- Location-based matching within events

### 3. Analytics & Insights
- Match success rate tracking
- User engagement metrics
- Room performance analytics
- A/B testing for scoring algorithms

### 4. Social Features
- Group matching for team formation
- Event-specific matching criteria
- Integration with calendar systems
- Icebreaker suggestions based on shared interests

### 5. Performance Optimizations
- Caching of match scores
- Background processing for large rooms
- Incremental matching as new users join
- Database indexing strategy for match queries

This architecture provides a solid foundation for professional networking while maintaining user privacy and encouraging meaningful connections through the mutual consent model.
