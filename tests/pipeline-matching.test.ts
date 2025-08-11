import { MatchingHeuristic } from '../lib/pipeline/match-heuristic';
import type { Profile } from '../shared/schema';

describe('Matching Heuristic', () => {
  let heuristic: MatchingHeuristic;
  
  const baseProfile: Profile = {
    user_id: 'user-1',
    name: 'John Doe',
    interests: ['AI', 'Fintech'],
    career_goals: 'find-cofounder',
    mentorship_pref: 'seeking',
    contact_prefs: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    heuristic = new MatchingHeuristic();
  });

  describe('calculateMatch', () => {
    test('should calculate high score for shared interests', () => {
      const candidate: Profile = {
        ...baseProfile,
        user_id: 'user-2',
        name: 'Jane Smith',
        interests: ['AI', 'Fintech', 'Education'], // 2 shared interests
        career_goals: 'find-cofounder',
        mentorship_pref: 'offering'
      };

      const match = heuristic.calculateMatch(baseProfile, candidate);

      expect(match.score).toBeGreaterThan(0);
      expect(match.sharedTopics).toContain('AI');
      expect(match.sharedTopics).toContain('Fintech');
      expect(match.explanation).toContain('shared interests');
    });

    test('should give bonus for mentorship compatibility', () => {
      const candidate: Profile = {
        ...baseProfile,
        user_id: 'user-2',
        name: 'Jane Smith',
        interests: ['AI'], // 1 shared interest = 2 points
        mentorship_pref: 'offering' // seeking + offering = 3 points
      };

      const match = heuristic.calculateMatch(baseProfile, candidate);

      expect(match.score).toBe(5); // 2 + 3
      expect(match.explanation).toContain('mentorship');
    });

    test('should give high score for co-founder compatibility', () => {
      const candidate: Profile = {
        ...baseProfile,
        user_id: 'user-2',
        name: 'Jane Smith',
        interests: ['AI'], // 1 shared = 2 points
        career_goals: 'find-cofounder', // both seeking cofounder = 4 points
        mentorship_pref: 'none'
      };

      const match = heuristic.calculateMatch(baseProfile, candidate);

      expect(match.score).toBe(6); // 2 + 4
      expect(match.explanation).toContain('co-founder');
    });

    test('should apply priority boost multiplier', () => {
      const candidate: Profile = {
        ...baseProfile,
        user_id: 'user-2',
        name: 'Jane Smith',
        interests: ['AI'], // Base score of 2
        mentorship_pref: 'none',
        career_goals: 'explore-jobs'
      };

      const matchWithBoost = heuristic.calculateMatch(baseProfile, candidate, ['priority_visibility']);
      const matchWithoutBoost = heuristic.calculateMatch(baseProfile, candidate, []);

      expect(matchWithBoost.score).toBeGreaterThan(matchWithoutBoost.score);
      expect(matchWithBoost.hasPriorityBoost).toBe(true);
      expect(matchWithoutBoost.hasPriorityBoost).toBeFalsy();
    });

    test('should handle profiles with no shared interests', () => {
      const candidate: Profile = {
        ...baseProfile,
        user_id: 'user-2',
        name: 'Jane Smith',
        interests: ['Music', 'Art'], // No shared interests
        mentorship_pref: 'none',
        career_goals: 'explore-jobs'
      };

      const match = heuristic.calculateMatch(baseProfile, candidate);

      expect(match.score).toBe(0);
      expect(match.sharedTopics).toHaveLength(0);
      expect(match.explanation).toContain('Potential connection');
    });

    test('should match mentor-mentee pairs correctly', () => {
      const mentorProfile: Profile = {
        ...baseProfile,
        mentorship_pref: 'offering',
        career_goals: 'mentor-others'
      };

      const menteeProfile: Profile = {
        ...baseProfile,
        user_id: 'user-2',
        name: 'Jane Smith',
        mentorship_pref: 'seeking',
        career_goals: 'find-mentor'
      };

      const match = heuristic.calculateMatch(mentorProfile, menteeProfile);

      expect(match.score).toBe(9); // 2 (interests) + 3 (mentorship) + 4 (career goals)
      expect(match.explanation).toContain('mentorship');
    });
  });

  describe('rankCandidates', () => {
    const userProfile: Profile = {
      ...baseProfile,
      user_id: 'current-user'
    };

    const candidates: Profile[] = [
      {
        ...baseProfile,
        user_id: 'candidate-1',
        name: 'Low Match',
        interests: ['Music'], // No shared interests
        mentorship_pref: 'none',
        career_goals: 'explore-jobs'
      },
      {
        ...baseProfile,
        user_id: 'candidate-2',
        name: 'High Match',
        interests: ['AI', 'Fintech'], // 2 shared interests
        mentorship_pref: 'offering', // Compatible mentorship
        career_goals: 'find-cofounder' // Compatible career goal
      },
      {
        ...baseProfile,
        user_id: 'candidate-3',
        name: 'Medium Match',
        interests: ['AI'], // 1 shared interest
        mentorship_pref: 'offering', // Compatible mentorship
        career_goals: 'explore-jobs'
      }
    ];

    test('should rank candidates by score', () => {
      const matches = heuristic.rankCandidates(userProfile, candidates, {
        userId: 'current-user',
        maxMatches: 3
      });

      expect(matches).toHaveLength(3);
      expect(matches[0].profile.name).toBe('High Match');
      expect(matches[1].profile.name).toBe('Medium Match');
      expect(matches[2].profile.name).toBe('Low Match');
      
      // Verify scores are in descending order
      expect(matches[0].score).toBeGreaterThanOrEqual(matches[1].score);
      expect(matches[1].score).toBeGreaterThanOrEqual(matches[2].score);
    });

    test('should limit results to maxMatches', () => {
      const matches = heuristic.rankCandidates(userProfile, candidates, {
        userId: 'current-user',
        maxMatches: 2
      });

      expect(matches).toHaveLength(2);
    });

    test('should provide extra matches when includeBoosts is true', () => {
      const matches = heuristic.rankCandidates(userProfile, candidates, {
        userId: 'current-user',
        maxMatches: 2,
        includeBoosts: true
      });

      expect(matches).toHaveLength(3); // 2 + 2 extra, but only 3 candidates available
    });

    test('should exclude user from their own matches', () => {
      const candidatesWithSelf = [...candidates, userProfile];
      
      const matches = heuristic.rankCandidates(userProfile, candidatesWithSelf, {
        userId: 'current-user',
        maxMatches: 5
      });

      expect(matches).toHaveLength(3); // Should exclude self
      expect(matches.every(match => match.profile.user_id !== userProfile.user_id)).toBe(true);
    });

    test('should prioritize boosted candidates', () => {
      // Add priority boost to the low match candidate
      const boostedCandidates = candidates.map(candidate => 
        candidate.user_id === 'candidate-1' 
          ? { ...candidate, hasPriorityBoost: true }
          : candidate
      );

      // Mock the calculateMatch to return priority boost
      const originalCalculateMatch = heuristic.calculateMatch;
      heuristic.calculateMatch = jest.fn().mockImplementation((user, candidate, boosts = []) => {
        const result = originalCalculateMatch.call(heuristic, user, candidate, boosts);
        if (candidate.user_id === 'candidate-1') {
          result.hasPriorityBoost = true;
        }
        return result;
      });

      const matches = heuristic.rankCandidates(userProfile, boostedCandidates, {
        userId: 'current-user',
        maxMatches: 3
      });

      // Priority boost should float to top despite lower score
      expect(matches[0].profile.user_id).toBe('candidate-1');
      expect(matches[0].hasPriorityBoost).toBe(true);
    });
  });
});
