import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchGlobalLeaderboard, fetchSubjectLeaderboard, submitSubjectScore } from './leaderboardApi';

describe('leaderboardApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits a subject score to the shared backend leaderboard', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await submitSubjectScore({ userId: 'u1', subject: 'english', name: 'Иван', avatar: '🦊', score: 1200 });

    expect(fetchMock).toHaveBeenCalledWith('/api/leaderboard/score', expect.objectContaining({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    }));
  });

  it('loads subject and global leaderboards', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ entries: [{ id: 'u1', score: 10 }] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ entries: [{ id: 'u1', totalScore: 30 }] }), { status: 200 }));

    await expect(fetchSubjectLeaderboard('math')).resolves.toEqual([{ id: 'u1', score: 10 }]);
    await expect(fetchGlobalLeaderboard()).resolves.toEqual([{ id: 'u1', totalScore: 30 }]);
    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/leaderboard?subject=math');
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/leaderboard?subject=global');
  });
});

