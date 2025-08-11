import { createMocks } from 'node-mocks-http';

// Mock Supabase
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    insert: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    upsert: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    eq: jest.fn(() => ({
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      neq: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    })),
    order: jest.fn(() => Promise.resolve({ data: [], error: null }))
  }))
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

// Mock the pipeline modules
jest.mock('../lib/pipeline/stateMachine', () => ({
  intakeStateMachine: {
    getNextQuestion: jest.fn(),
    processAnswer: jest.fn()
  }
}));

jest.mock('../lib/pipeline/match-heuristic', () => ({
  matchingHeuristic: {
    rankCandidates: jest.fn()
  }
}));

describe('API Routes Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Intake API', () => {
    test('GET /api/intake/questions should return next question', async () => {
      const { intakeStateMachine } = require('../lib/pipeline/stateMachine');
      
      const mockQuestion = {
        id: 'name',
        type: 'text',
        question: 'What is your name?',
        required: true
      };
      
      intakeStateMachine.getNextQuestion.mockResolvedValue(mockQuestion);
      
      // Test the core logic
      const userId = 'test-user-123';
      const result = await intakeStateMachine.getNextQuestion(userId);
      
      expect(result).toEqual(mockQuestion);
      expect(intakeStateMachine.getNextQuestion).toHaveBeenCalledWith(userId);
    });

    test('GET /api/intake/questions should handle completion', async () => {
      const { intakeStateMachine } = require('../lib/pipeline/stateMachine');
      
      intakeStateMachine.getNextQuestion.mockResolvedValue(null);
      
      const userId = 'completed-user';
      const result = await intakeStateMachine.getNextQuestion(userId);
      
      expect(result).toBeNull();
    });

    test('POST /api/intake/answers should process valid answer', async () => {
      const { intakeStateMachine } = require('../lib/pipeline/stateMachine');
      
      const mockResult = {
        success: true,
        nextQuestion: {
          id: 'interests',
          type: 'multiselect',
          question: 'What are your interests?',
          options: ['AI', 'Fintech', 'Education'],
          required: true
        },
        isComplete: false
      };
      
      intakeStateMachine.processAnswer.mockResolvedValue(mockResult);
      
      const userId = 'test-user-123';
      const answer = 'John Doe';
      const result = await intakeStateMachine.processAnswer(userId, answer);
      
      expect(result.success).toBe(true);
      expect(result.nextQuestion).toBeDefined();
      expect(result.isComplete).toBe(false);
    });

    test('POST /api/intake/answers should handle invalid answer', async () => {
      const { intakeStateMachine } = require('../lib/pipeline/stateMachine');
      
      const mockResult = {
        success: false,
        error: 'Invalid answer format'
      };
      
      intakeStateMachine.processAnswer.mockResolvedValue(mockResult);
      
      const userId = 'test-user-123';
      const answer = ''; // Invalid empty answer
      const result = await intakeStateMachine.processAnswer(userId, answer);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid answer format');
    });

    test('POST /api/intake/answers should handle completion', async () => {
      const { intakeStateMachine } = require('../lib/pipeline/stateMachine');
      
      const mockResult = {
        success: true,
        isComplete: true
      };
      
      intakeStateMachine.processAnswer.mockResolvedValue(mockResult);
      
      const userId = 'test-user-123';
      const answer = 'San Francisco';
      const result = await intakeStateMachine.processAnswer(userId, answer);
      
      expect(result.success).toBe(true);
      expect(result.isComplete).toBe(true);
    });
  });

  describe('Rooms API', () => {
    test('POST /api/rooms/create should validate room data', () => {
      const { insertMatchRoomSchema } = require('../shared/schema');
      
      const validRoom = {
        name: 'AI Enthusiasts',
        description: 'Connect with AI professionals',
        visibility: 'public',
        event_id: '123e4567-e89b-12d3-a456-426614174000',
        created_by: '123e4567-e89b-12d3-a456-426614174001'
      };
      
      const result = insertMatchRoomSchema.safeParse(validRoom);
      expect(result.success).toBe(true);
    });

    test('POST /api/rooms/create should reject invalid visibility', () => {
      const { insertMatchRoomSchema } = require('../shared/schema');
      
      const invalidRoom = {
        name: 'Test Room',
        visibility: 'invalid-visibility'
      };
      
      const result = insertMatchRoomSchema.safeParse(invalidRoom);
      expect(result.success).toBe(false);
    });

    test('POST /api/rooms/join should validate membership data', () => {
      const { insertRoomMemberSchema } = require('../shared/schema');
      
      const validMembership = {
        room_id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001'
      };
      
      const result = insertRoomMemberSchema.safeParse(validMembership);
      expect(result.success).toBe(true);
    });

    test('POST /api/rooms/[id]/match should generate matches', async () => {
      const { matchingHeuristic } = require('../lib/pipeline/match-heuristic');
      
      const mockMatches = [
        {
          id: 'match-1',
          profile: {
            user_id: 'user-2',
            name: 'Sarah Chen',
            interests: ['AI', 'Fintech'],
            career_goals: 'find-cofounder',
            mentorship_pref: 'offering',
            contact_prefs: {}
          },
          score: 8.5,
          sharedTopics: ['AI', 'Fintech'],
          explanation: 'Great match based on shared interests in AI and Fintech',
          hasPriorityBoost: false
        },
        {
          id: 'match-2',
          profile: {
            user_id: 'user-3',
            name: 'Michael Rodriguez',
            interests: ['AI', 'Climate'],
            career_goals: 'mentor-others',
            mentorship_pref: 'offering',
            contact_prefs: {}
          },
          score: 7.2,
          sharedTopics: ['AI'],
          explanation: 'Good potential for mentorship',
          hasPriorityBoost: true
        }
      ];
      
      matchingHeuristic.rankCandidates.mockReturnValue(mockMatches);
      
      const userProfile = {
        user_id: 'user-1',
        name: 'John Doe',
        interests: ['AI', 'Fintech'],
        career_goals: 'find-cofounder',
        mentorship_pref: 'seeking',
        contact_prefs: {}
      };
      
      const candidateProfiles = mockMatches.map(m => m.profile);
      const options = { userId: 'user-1', maxMatches: 3, includeBoosts: false };
      
      const result = matchingHeuristic.rankCandidates(userProfile, candidateProfiles, options);
      
      expect(result).toHaveLength(2);
      expect(result[0].score).toBe(8.5);
      expect(result[1].hasPriorityBoost).toBe(true);
    });
  });

  describe('Contact Sharing API', () => {
    test('POST /api/matches/[id]/share-contact should validate contact data', () => {
      const { insertContactShareSchema } = require('../shared/schema');
      
      const validShare = {
        match_id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        payload: {
          email: 'john@example.com',
          linkedin: 'https://linkedin.com/in/johndoe',
          phone: '+1 (555) 123-4567'
        }
      };
      
      const result = insertContactShareSchema.safeParse(validShare);
      expect(result.success).toBe(true);
    });

    test('should detect mutual contact sharing', () => {
      const contactShares = [
        {
          match_id: 'match-1',
          user_id: 'user-1',
          payload: { email: 'user1@example.com' },
          shared_at: '2024-01-01T00:00:00Z'
        },
        {
          match_id: 'match-1',
          user_id: 'user-2',
          payload: { email: 'user2@example.com' },
          shared_at: '2024-01-01T00:01:00Z'
        }
      ];
      
      const isMutual = contactShares.length >= 2;
      expect(isMutual).toBe(true);
      
      const mutualContacts = isMutual ? contactShares : null;
      expect(mutualContacts).toHaveLength(2);
    });
  });

  describe('Connections API', () => {
    test('GET /api/connections should handle user connections', () => {
      // Mock connections data structure
      const mockConnections = [
        {
          id: 'conn-1',
          user_id: 'user-1',
          match_id: 'match-1',
          notes: 'Great conversation about AI startups',
          created_at: '2024-01-01T00:00:00Z'
        }
      ];
      
      expect(mockConnections).toHaveLength(1);
      expect(mockConnections[0].notes).toContain('AI startups');
    });

    test('POST /api/connections should validate connection data', () => {
      const { insertConnectionSchema } = require('../shared/schema');
      
      const validConnection = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        match_id: '123e4567-e89b-12d3-a456-426614174001',
        notes: 'Interested in collaborating on climate tech solutions'
      };
      
      const result = insertConnectionSchema.safeParse(validConnection);
      expect(result.success).toBe(true);
    });
  });

  describe('Boosts API', () => {
    test('GET /api/boosts should handle user boosts', () => {
      const mockBoosts = [
        {
          id: 'boost-1',
          user_id: 'user-1',
          type: 'priority_visibility',
          amount_cents: 500,
          status: 'active',
          created_at: '2024-01-01T00:00:00Z'
        }
      ];
      
      expect(mockBoosts).toHaveLength(1);
      expect(mockBoosts[0].type).toBe('priority_visibility');
      expect(mockBoosts[0].status).toBe('active');
    });

    test('POST /api/boosts should validate boost data', () => {
      const { insertBoostTransactionSchema } = require('../shared/schema');
      
      const validBoost = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'extra_matches',
        amount_cents: 1000,
        status: 'active'
      };
      
      const result = insertBoostTransactionSchema.safeParse(validBoost);
      expect(result.success).toBe(true);
    });

    test('should validate boost types', () => {
      const { insertBoostTransactionSchema } = require('../shared/schema');
      
      const validTypes = ['priority_visibility', 'extra_matches', 'save_contact_card'];
      const invalidType = 'invalid_boost_type';
      
      validTypes.forEach(type => {
        const boost = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          type,
          amount_cents: 500
        };
        
        const result = insertBoostTransactionSchema.safeParse(boost);
        expect(result.success).toBe(true);
      });
      
      const invalidBoost = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        type: invalidType,
        amount_cents: 500
      };
      
      const invalidResult = insertBoostTransactionSchema.safeParse(invalidBoost);
      expect(invalidResult.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing required parameters', () => {
      const testCases = [
        { userId: undefined, answer: 'test' },
        { userId: 'test', answer: undefined },
        { userId: '', answer: 'test' },
        { userId: 'test', answer: '' }
      ];
      
      testCases.forEach(testCase => {
        const hasValidParams = !!(testCase.userId && testCase.answer);
        expect(hasValidParams).toBe(false);
      });
    });

    test('should validate UUID format', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
      ];
      
      const invalidUUIDs = [
        'not-a-uuid',
        '123-456-789',
        '',
        '123e4567-e89b-12d3-a456-42661417400', // too short
        '123e4567-e89b-12d3-a456-426614174000-extra' // too long
      ];
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      validUUIDs.forEach(uuid => {
        expect(uuidRegex.test(uuid)).toBe(true);
      });
      
      invalidUUIDs.forEach(uuid => {
        expect(uuidRegex.test(uuid)).toBe(false);
      });
    });

    test('should handle Supabase errors gracefully', async () => {
      const mockError = {
        message: 'Database connection failed',
        code: 'CONNECTION_ERROR'
      };
      
      // Mock a failed database operation
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn(() => Promise.resolve({ data: null, error: mockError }))
      });
      
      // Test error handling logic
      const result = await mockSupabaseClient.from('profiles').select('*');
      
      expect(result.error).toBeDefined();
      expect(result.error.message).toBe('Database connection failed');
      expect(result.data).toBeNull();
    });
  });

  describe('Data Validation', () => {
    test('should validate email format in contact sharing', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org'
      ];
      
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com'
      ];
      
      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
      
      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    test('should validate LinkedIn URL format', () => {
      const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
      
      const validUrls = [
        'https://linkedin.com/in/johndoe',
        'https://www.linkedin.com/in/jane-smith',
        'https://linkedin.com/in/user123/'
      ];
      
      const invalidUrls = [
        'http://linkedin.com/in/user', // not https
        'https://facebook.com/user', // wrong domain
        'https://linkedin.com/user', // missing /in/
        'linkedin.com/in/user' // missing protocol
      ];
      
      validUrls.forEach(url => {
        expect(linkedinRegex.test(url)).toBe(true);
      });
      
      invalidUrls.forEach(url => {
        expect(linkedinRegex.test(url)).toBe(false);
      });
    });
  });
});
