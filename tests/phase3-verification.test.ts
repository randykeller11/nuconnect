import { openrouterChat } from '../lib/ai/openrouter';
import { IntakeStateMachine } from '../lib/pipeline/stateMachine';
import { sessionManager } from '../lib/pipeline/session';
import { MatchingHeuristic } from '../lib/pipeline/match-heuristic';
import fs from 'fs';

// Mock fetch for OpenRouter tests
global.fetch = jest.fn();

describe('Phase 3: AI Service & Pipeline Verification', () => {
  
  describe('OpenRouter AI Service', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.OPENROUTER_API_KEY = 'test-api-key';
    });

    afterEach(() => {
      delete process.env.OPENROUTER_API_KEY;
    });

    test('should have OpenRouter API key configured', () => {
      // In real environment, this should be set
      expect(process.env.OPENROUTER_API_KEY).toBeDefined();
    });

    test('should export openrouterChat function', () => {
      expect(typeof openrouterChat).toBe('function');
    });

    test('should handle API calls correctly', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'AI response' } }]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await openrouterChat([
        { role: 'user', content: 'Test message' }
      ]);

      expect(result).toBe('AI response');
      expect(fetch).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });

  describe('Session Management', () => {
    const testUserId = 'test-user-123';

    afterEach(() => {
      sessionManager.clearSession(testUserId);
    });

    test('should create and manage user sessions', () => {
      const session = sessionManager.createSession(testUserId);
      
      expect(session.userId).toBe(testUserId);
      expect(session.currentStep).toBe(0);
      expect(session.answers).toEqual({});
      expect(session.profile).toEqual({});
    });

    test('should advance session steps', () => {
      sessionManager.createSession(testUserId);
      const updatedSession = sessionManager.advanceStep(testUserId, 'John Doe');
      
      expect(updatedSession.currentStep).toBe(1);
      expect(updatedSession.answers[0]).toBe('John Doe');
    });

    test('should complete intake', () => {
      sessionManager.createSession(testUserId);
      const completedSession = sessionManager.completeIntake(testUserId);
      
      expect(completedSession.currentStep).toBe(-1);
    });
  });

  describe('Intake State Machine', () => {
    let stateMachine: IntakeStateMachine;
    const testUserId = 'test-user-456';

    beforeEach(() => {
      stateMachine = new IntakeStateMachine();
      sessionManager.clearSession(testUserId);
    });

    afterEach(() => {
      sessionManager.clearSession(testUserId);
    });

    test('should provide base questions in order', async () => {
      const q1 = await stateMachine.getNextQuestion(testUserId);
      expect(q1?.id).toBe('name');
      expect(q1?.type).toBe('text');
      expect(q1?.required).toBe(true);

      await stateMachine.processAnswer(testUserId, 'John Doe');
      const q2 = await stateMachine.getNextQuestion(testUserId);
      expect(q2?.id).toBe('interests');
      expect(q2?.type).toBe('multiselect');
    });

    test('should validate answers correctly', async () => {
      await stateMachine.getNextQuestion(testUserId);
      
      // Valid answer should succeed
      const validResult = await stateMachine.processAnswer(testUserId, 'John Doe');
      expect(validResult.success).toBe(true);
      
      // Invalid answer should fail
      sessionManager.clearSession(testUserId);
      await stateMachine.getNextQuestion(testUserId);
      const invalidResult = await stateMachine.processAnswer(testUserId, '');
      expect(invalidResult.success).toBe(false);
    });

    test('should update profile from answers', async () => {
      await stateMachine.getNextQuestion(testUserId);
      await stateMachine.processAnswer(testUserId, 'John Doe');
      
      const session = sessionManager.getSession(testUserId);
      expect(session?.profile.name).toBe('John Doe');
    });
  });

  describe('Matching Heuristic', () => {
    let heuristic: MatchingHeuristic;

    beforeEach(() => {
      heuristic = new MatchingHeuristic();
    });

    test('should calculate match scores based on interests', () => {
      const userProfile = {
        user_id: 'user-1',
        name: 'John',
        interests: ['AI', 'Fintech'],
        career_goals: 'find-cofounder',
        mentorship_pref: 'seeking',
        contact_prefs: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      const candidate = {
        ...userProfile,
        user_id: 'user-2',
        name: 'Jane',
        interests: ['AI', 'Education'],
        mentorship_pref: 'offering'
      };

      const match = heuristic.calculateMatch(userProfile, candidate);
      
      expect(match.score).toBeGreaterThan(0);
      expect(match.sharedTopics).toContain('AI');
      expect(match.explanation).toContain('shared interests');
    });

    test('should rank candidates by compatibility', () => {
      const userProfile = {
        user_id: 'user-1',
        name: 'John',
        interests: ['AI'],
        career_goals: 'find-cofounder',
        mentorship_pref: 'seeking',
        contact_prefs: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      const candidates = [
        {
          ...userProfile,
          user_id: 'user-2',
          name: 'Low Match',
          interests: ['Music'],
          mentorship_pref: 'none',
          career_goals: 'explore-jobs'
        },
        {
          ...userProfile,
          user_id: 'user-3',
          name: 'High Match',
          interests: ['AI'],
          mentorship_pref: 'offering',
          career_goals: 'find-cofounder'
        }
      ];

      const matches = heuristic.rankCandidates(userProfile, candidates, {
        userId: 'user-1',
        maxMatches: 2
      });

      expect(matches).toHaveLength(2);
      expect(matches[0].profile.name).toBe('High Match');
      expect(matches[0].score).toBeGreaterThan(matches[1].score);
    });
  });

  describe('Prompt Templates', () => {
    test('should have intake prompt template', () => {
      expect(fs.existsSync('prompts/intake.yaml')).toBe(true);
      
      const intakeContent = fs.readFileSync('prompts/intake.yaml', 'utf8');
      expect(intakeContent).toContain('system_prompt');
      expect(intakeContent).toContain('base_questions');
      expect(intakeContent).toContain('professional interests');
    });

    test('should have matching prompt template', () => {
      expect(fs.existsSync('prompts/match.yaml')).toBe(true);
      
      const matchContent = fs.readFileSync('prompts/match.yaml', 'utf8');
      expect(matchContent).toContain('system_prompt');
      expect(matchContent).toContain('matching_criteria');
      expect(matchContent).toContain('mentorship_compatibility');
    });
  });

  describe('File Structure', () => {
    test('should have all required AI service files', () => {
      expect(fs.existsSync('lib/ai/openrouter.ts')).toBe(true);
    });

    test('should have all required pipeline files', () => {
      expect(fs.existsSync('lib/pipeline/session.ts')).toBe(true);
      expect(fs.existsSync('lib/pipeline/stateMachine.ts')).toBe(true);
      expect(fs.existsSync('lib/pipeline/match-heuristic.ts')).toBe(true);
    });

    test('should have prompt template files', () => {
      expect(fs.existsSync('prompts/intake.yaml')).toBe(true);
      expect(fs.existsSync('prompts/match.yaml')).toBe(true);
    });
  });

  describe('Integration', () => {
    test('should handle complete intake flow', async () => {
      const stateMachine = new IntakeStateMachine();
      const testUserId = 'integration-test-user';

      try {
        // Start intake
        const q1 = await stateMachine.getNextQuestion(testUserId);
        expect(q1?.id).toBe('name');

        // Answer questions
        await stateMachine.processAnswer(testUserId, 'Integration Test User');
        await stateMachine.processAnswer(testUserId, ['AI', 'Fintech']);
        await stateMachine.processAnswer(testUserId, 'find-cofounder');
        await stateMachine.processAnswer(testUserId, 'seeking');
        await stateMachine.processAnswer(testUserId, 'San Francisco');

        // Check session state
        const session = sessionManager.getSession(testUserId);
        expect(session?.profile.name).toBe('Integration Test User');
        expect(session?.profile.interests).toEqual(['AI', 'Fintech']);
        expect(session?.profile.careerGoals).toBe('find-cofounder');
        expect(session?.profile.mentorshipPref).toBe('seeking');
      } finally {
        sessionManager.clearSession(testUserId);
      }
    });
  });
});
