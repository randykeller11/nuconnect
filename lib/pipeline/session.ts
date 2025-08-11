// In-memory session storage for user intake progress
// In production, this would be stored in Redis or database

interface IntakeSession {
  userId: string;
  currentStep: number;
  answers: Record<string, any>;
  profile: {
    name?: string;
    interests?: string[];
    careerGoals?: string;
    mentorshipPref?: 'seeking' | 'offering' | 'both' | 'none';
    location?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

class SessionManager {
  private sessions = new Map<string, IntakeSession>();

  getSession(userId: string): IntakeSession | null {
    return this.sessions.get(userId) || null;
  }

  createSession(userId: string): IntakeSession {
    const session: IntakeSession = {
      userId,
      currentStep: 0,
      answers: {},
      profile: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sessions.set(userId, session);
    return session;
  }

  updateSession(userId: string, updates: Partial<IntakeSession>): IntakeSession {
    const session = this.getSession(userId) || this.createSession(userId);
    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date()
    };
    this.sessions.set(userId, updatedSession);
    return updatedSession;
  }

  advanceStep(userId: string, answer: any): IntakeSession {
    const session = this.getSession(userId) || this.createSession(userId);
    const newAnswers = { ...session.answers, [session.currentStep]: answer };
    
    return this.updateSession(userId, {
      currentStep: session.currentStep + 1,
      answers: newAnswers
    });
  }

  completeIntake(userId: string): IntakeSession {
    const session = this.getSession(userId);
    if (!session) throw new Error('No session found');
    
    return this.updateSession(userId, {
      currentStep: -1 // Mark as complete
    });
  }

  clearSession(userId: string): void {
    this.sessions.delete(userId);
  }

  // Clean up old sessions (run periodically)
  cleanup(maxAgeHours = 24): void {
    const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    for (const [userId, session] of this.sessions.entries()) {
      if (session.updatedAt < cutoff) {
        this.sessions.delete(userId);
      }
    }
  }
}

export const sessionManager = new SessionManager();
export type { IntakeSession };
