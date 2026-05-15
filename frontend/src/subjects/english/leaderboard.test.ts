import { describe, expect, it } from 'vitest';
import { buildEnglishLeaderboard } from './leaderboard';

const emptyStats = {
  totalXP: 1800,
  streakDays: 6,
  lastStudyDate: '',
  wordsLearned: 0,
  verbsLearned: 0,
  perfectQuizzes: 0,
  dictationsDone: 0,
  achievements: [],
};

describe('buildEnglishLeaderboard', () => {
  it('always includes the current student with real avatar and XP', () => {
    const board = buildEnglishLeaderboard(
      [{ id: 'peer', name: 'Peer', avatar: '👦', xp: 1200, grade: 5, streak: 2 }],
      { id: 'son', name: 'Иван', email: '', avatar: '🦊', grade: 5 },
      emptyStats
    );

    expect(board[0]).toMatchObject({
      id: 'son',
      name: 'Иван',
      avatar: '🦊',
      xp: 1800,
      streak: 6,
    });
  });
});

