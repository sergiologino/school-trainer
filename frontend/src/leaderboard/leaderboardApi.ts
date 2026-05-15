export type SubjectSlug = 'math' | 'russian' | 'english';

export interface SubjectScoreInput {
  userId: string;
  subject: SubjectSlug;
  name: string;
  avatar: string;
  score: number;
  level?: number;
  streak?: number;
}

export interface RemoteSubjectEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  streak: number;
  updatedAt: string;
}

export interface RemoteGlobalEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  totalScore: number;
  mathScore: number;
  russianScore: number;
  englishScore: number;
  level: number;
  streak: number;
  updatedAt: string;
}

export async function submitSubjectScore(input: SubjectScoreInput) {
  const response = await fetch('/api/leaderboard/score', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      ...input,
      score: Math.max(0, Math.floor(input.score)),
      level: Math.max(1, Math.floor(input.level ?? 1)),
      streak: Math.max(0, Math.floor(input.streak ?? 0)),
    }),
  });
  if (!response.ok) throw new Error('leaderboard score sync failed');
}

export function submitSubjectScoreBestEffort(input: SubjectScoreInput) {
  submitSubjectScore(input).catch(() => {
    // Offline-first: local progress is authoritative until the next successful sync.
  });
}

export async function fetchSubjectLeaderboard(subject: SubjectSlug): Promise<RemoteSubjectEntry[]> {
  const response = await fetch(`/api/leaderboard?subject=${encodeURIComponent(subject)}`);
  if (!response.ok) throw new Error('leaderboard unavailable');
  const payload = await response.json() as { entries: RemoteSubjectEntry[] };
  return payload.entries;
}

export async function fetchGlobalLeaderboard(): Promise<RemoteGlobalEntry[]> {
  const response = await fetch('/api/leaderboard?subject=global');
  if (!response.ok) throw new Error('global leaderboard unavailable');
  const payload = await response.json() as { entries: RemoteGlobalEntry[] };
  return payload.entries;
}
