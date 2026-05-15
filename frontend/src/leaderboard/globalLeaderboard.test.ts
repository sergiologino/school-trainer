import { beforeEach, describe, expect, it } from 'vitest';
import { buildGlobalLeaderboard } from './globalLeaderboard';

describe('buildGlobalLeaderboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('includes the current student with scores from all subject stores', () => {
    localStorage.setItem('english-app-store', JSON.stringify({ state: { stats: { totalXP: 900 } } }));
    localStorage.setItem('rusyaz-storage', JSON.stringify({ state: { user: { xp: 700 } } }));
    localStorage.setItem('mathapp_user', JSON.stringify({ totalScore: 500 }));

    const board = buildGlobalLeaderboard({
      id: 'student-1',
      name: 'Иван',
      email: '',
      avatar: '🦊',
      grade: 5,
    });

    const me = board.find((entry) => entry.id === 'student-1');
    expect(me).toMatchObject({
      name: 'Иван',
      avatar: '🦊',
      totalScore: 2100,
      mathScore: 500,
      russianScore: 700,
      englishScore: 900,
    });
  });
});

