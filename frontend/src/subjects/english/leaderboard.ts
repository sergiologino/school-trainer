import type { LeaderboardEntry, UserStats, User } from './store/useStore';

export function buildEnglishLeaderboard(leaderboard: LeaderboardEntry[], user: User | null, stats: UserStats) {
  if (!user) return [...leaderboard].sort((a, b) => b.xp - a.xp);

  return [
    ...leaderboard.filter((entry) => entry.id !== user.id),
    {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      xp: stats.totalXP,
      grade: user.grade,
      streak: stats.streakDays,
    },
  ].sort((a, b) => b.xp - a.xp);
}

