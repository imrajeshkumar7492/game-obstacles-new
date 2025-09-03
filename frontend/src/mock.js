// Mock data for the Flappy Bird game
export const mockHighScores = [
  { id: 1, score: 45, playerName: 'FlappyMaster', date: '2024-12-20T10:30:00Z' },
  { id: 2, score: 38, playerName: 'SkyNavigator', date: '2024-12-19T15:45:00Z' },
  { id: 3, score: 32, playerName: 'BirdBrain', date: '2024-12-18T09:20:00Z' },
  { id: 4, score: 28, playerName: 'WingWarrior', date: '2024-12-17T14:15:00Z' },
  { id: 5, score: 22, playerName: 'FeatheredFly', date: '2024-12-16T11:00:00Z' },
  { id: 6, score: 19, playerName: 'AerialAce', date: '2024-12-15T16:30:00Z' },
  { id: 7, score: 16, playerName: 'GlideMaster', date: '2024-12-14T13:45:00Z' },
  { id: 8, score: 12, playerName: 'PipeDodger', date: '2024-12-13T08:20:00Z' },
  { id: 9, score: 10, playerName: 'FlightRookie', date: '2024-12-12T12:10:00Z' },
  { id: 10, score: 8, playerName: 'Beginner', date: '2024-12-11T17:55:00Z' }
];

export const mockGameStats = {
  totalGamesPlayed: 156,
  totalTimeSpent: '4h 32m',
  averageScore: 18.7,
  bestStreak: 5,
  favoritePlayTime: 'Evening'
};

export const mockAchievements = [
  { id: 1, name: 'First Flight', description: 'Complete your first game', unlocked: true },
  { id: 2, name: 'Pipe Master', description: 'Pass through 10 pipes in one game', unlocked: true },
  { id: 3, name: 'Sky High', description: 'Reach a score of 25', unlocked: true },
  { id: 4, name: 'Legendary Bird', description: 'Reach a score of 50', unlocked: false },
  { id: 5, name: 'Marathon Flyer', description: 'Play for 30 minutes straight', unlocked: false },
  { id: 6, name: 'Speed Demon', description: 'Survive at 2x speed', unlocked: false }
];

// Mock API functions for future backend integration
export const mockAPI = {
  // Get high scores
  getHighScores: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockHighScores });
      }, 300);
    });
  },

  // Submit new score
  submitScore: (score, playerName = 'Anonymous') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newScore = {
          id: Date.now(),
          score,
          playerName,
          date: new Date().toISOString()
        };
        resolve({ success: true, data: newScore, isNewRecord: score > mockHighScores[0].score });
      }, 500);
    });
  },

  // Get game statistics
  getGameStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockGameStats });
      }, 200);
    });
  },

  // Get achievements
  getAchievements: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockAchievements });
      }, 250);
    });
  }
};