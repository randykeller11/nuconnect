import type { Profile } from '../../shared/schema';

export interface MatchCandidate {
  profile: Profile;
  score: number;
  sharedTopics: string[];
  explanation: string;
  hasPriorityBoost?: boolean;
}

export interface MatchingOptions {
  maxMatches?: number;
  includeBoosts?: boolean;
  userId: string;
}

export class MatchingHeuristic {
  calculateMatch(
    userProfile: Profile, 
    candidateProfile: Profile,
    boosts: string[] = []
  ): MatchCandidate {
    let score = 0;
    const sharedTopics: string[] = [];
    const reasons: string[] = [];

    // 1. Interest overlap (+2 points each)
    const sharedInterests = userProfile.interests.filter(interest => 
      candidateProfile.interests.includes(interest)
    );
    score += sharedInterests.length * 2;
    sharedTopics.push(...sharedInterests);

    if (sharedInterests.length > 0) {
      reasons.push(`shared interests in ${sharedInterests.join(', ')}`);
    }

    // 2. Mentorship compatibility (+3 points)
    const mentorshipScore = this.calculateMentorshipCompatibility(
      userProfile.mentorship_pref, 
      candidateProfile.mentorship_pref
    );
    score += mentorshipScore;

    if (mentorshipScore > 0) {
      if (userProfile.mentorship_pref === 'seeking' && candidateProfile.mentorship_pref === 'offering') {
        reasons.push(`${candidateProfile.name} offers mentorship in your areas of interest`);
      } else if (userProfile.mentorship_pref === 'offering' && candidateProfile.mentorship_pref === 'seeking') {
        reasons.push(`you can mentor ${candidateProfile.name} in their areas of interest`);
      } else if (userProfile.mentorship_pref === 'both' || candidateProfile.mentorship_pref === 'both') {
        reasons.push('mutual mentorship opportunity');
      }
    }

    // 3. Career goals compatibility (+2-4 points)
    const careerScore = this.calculateCareerGoalsCompatibility(
      userProfile.career_goals, 
      candidateProfile.career_goals
    );
    score += careerScore;

    if (careerScore > 0) {
      if (userProfile.career_goals === 'find-cofounder' && candidateProfile.career_goals === 'find-cofounder') {
        reasons.push('both seeking co-founders with complementary expertise');
      } else if (userProfile.career_goals === 'find-mentor' && candidateProfile.career_goals === 'mentor-others') {
        reasons.push('perfect mentor-mentee match');
      } else if (userProfile.career_goals === 'hire' && candidateProfile.career_goals === 'explore-jobs') {
        reasons.push('hiring opportunity alignment');
      }
    }

    // 4. Apply priority boost
    const hasPriorityBoost = boosts.includes('priority_visibility');
    if (hasPriorityBoost) {
      score *= 1.1; // Small boost to float to top
    }

    // Generate explanation
    const explanation = reasons.length > 0 
      ? `Great match! You both have ${reasons.join(' and ')}.`
      : `Potential connection based on your professional profiles.`;

    return {
      profile: candidateProfile,
      score,
      sharedTopics,
      explanation,
      hasPriorityBoost
    };
  }

  private calculateMentorshipCompatibility(
    userPref: string | undefined, 
    candidatePref: string | undefined
  ): number {
    if (!userPref || !candidatePref) return 0;

    // Perfect matches
    if (userPref === 'seeking' && candidatePref === 'offering') return 3;
    if (userPref === 'offering' && candidatePref === 'seeking') return 3;
    
    // Good matches with 'both'
    if (userPref === 'both' || candidatePref === 'both') {
      if (userPref !== 'none' && candidatePref !== 'none') return 2;
    }

    return 0;
  }

  private calculateCareerGoalsCompatibility(
    userGoal: string | undefined, 
    candidateGoal: string | undefined
  ): number {
    if (!userGoal || !candidateGoal) return 0;

    // High compatibility pairs
    const highCompatibility = [
      ['find-cofounder', 'find-cofounder'],
      ['find-mentor', 'mentor-others'],
      ['mentor-others', 'find-mentor'],
      ['hire', 'explore-jobs'],
      ['explore-jobs', 'hire'],
      ['investors', 'find-cofounder'],
      ['find-cofounder', 'investors']
    ];

    for (const [goal1, goal2] of highCompatibility) {
      if ((userGoal === goal1 && candidateGoal === goal2) || 
          (userGoal === goal2 && candidateGoal === goal1)) {
        return 4;
      }
    }

    // Medium compatibility
    const mediumCompatibility = [
      ['learn-ai', 'mentor-others'],
      ['portfolio-feedback', 'mentor-others'],
      ['hire', 'mentor-others']
    ];

    for (const [goal1, goal2] of mediumCompatibility) {
      if ((userGoal === goal1 && candidateGoal === goal2) || 
          (userGoal === goal2 && candidateGoal === goal1)) {
        return 2;
      }
    }

    return 0;
  }

  rankCandidates(
    userProfile: Profile, 
    candidates: Profile[], 
    options: MatchingOptions
  ): MatchCandidate[] {
    const matches = candidates
      .filter(candidate => candidate.user_id !== userProfile.user_id)
      .map(candidate => this.calculateMatch(userProfile, candidate))
      .sort((a, b) => {
        // Priority boost candidates float to top
        if (a.hasPriorityBoost && !b.hasPriorityBoost) return -1;
        if (!a.hasPriorityBoost && b.hasPriorityBoost) return 1;
        
        // Then sort by score
        return b.score - a.score;
      });

    // Apply match limits based on boosts
    const maxMatches = options.maxMatches || 3;
    const hasExtraMatches = options.includeBoosts; // In real implementation, check user's boosts
    const limit = hasExtraMatches ? maxMatches + 2 : maxMatches;

    return matches.slice(0, limit);
  }
}

export const matchingHeuristic = new MatchingHeuristic();
