interface SessionData {
  user: any;
  timestamp: number;
  expiresIn: number;
}

const SESSION_KEY = 'matrimoney_user';
const DEFAULT_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const sessionManager = {
  store: (userData: any, expiresIn: number = DEFAULT_EXPIRY) => {
    const sessionData: SessionData = {
      user: userData,
      timestamp: Date.now(),
      expiresIn
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  },

  load: (): any | null => {
    try {
      const storedData = sessionStorage.getItem(SESSION_KEY);
      if (!storedData) return null;

      const sessionData: SessionData = JSON.parse(storedData);
      
      // Check expiration
      if (Date.now() - sessionData.timestamp > sessionData.expiresIn) {
        sessionManager.clear();
        return null;
      }

      return sessionData.user;
    } catch (error) {
      console.error('Failed to load session:', error);
      sessionManager.clear();
      return null;
    }
  },

  clear: () => {
    sessionStorage.removeItem(SESSION_KEY);
  },

  isValid: (): boolean => {
    return sessionManager.load() !== null;
  },

  // Legacy support for direct sessionStorage access
  loadLegacy: (): any | null => {
    try {
      const storedUser = sessionStorage.getItem(SESSION_KEY);
      if (!storedUser) return null;
      
      const userData = JSON.parse(storedUser);
      
      // If it's already in new format, return null to force validation
      if (userData.user && userData.timestamp) {
        return null;
      }
      
      // If it's old format, migrate it
      sessionManager.store(userData);
      return userData;
    } catch (error) {
      console.error('Failed to load legacy session:', error);
      sessionManager.clear();
      return null;
    }
  }
};
