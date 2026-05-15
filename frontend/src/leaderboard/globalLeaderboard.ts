import type { UnifiedUser } from '@/store/useUnifiedStore';

export interface GlobalLeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  totalScore: number;
  mathScore: number;
  russianScore: number;
  englishScore: number;
}

const GLOBAL_PEERS: GlobalLeaderboardEntry[] = [
  { id: 'peer-1', name: 'Алиса К.', avatar: '👧', totalScore: 6120, mathScore: 1850, russianScore: 2400, englishScore: 1870 },
  { id: 'peer-2', name: 'Миша П.', avatar: '👦', totalScore: 5360, mathScore: 1620, russianScore: 2100, englishScore: 1640 },
  { id: 'peer-3', name: 'Даша С.', avatar: '🧒', totalScore: 4890, mathScore: 1480, russianScore: 1800, englishScore: 1610 },
  { id: 'peer-4', name: 'Артем В.', avatar: '👦', totalScore: 4210, mathScore: 1200, russianScore: 1720, englishScore: 1290 },
  { id: 'peer-5', name: 'Соня М.', avatar: '👧', totalScore: 3680, mathScore: 980, russianScore: 1500, englishScore: 1200 },
];

export function buildGlobalLeaderboard(user: UnifiedUser | null): GlobalLeaderboardEntry[] {
  const local = user ? buildCurrentUserEntry(user) : null;
  return [...GLOBAL_PEERS.filter((entry) => entry.id !== user?.id), ...(local ? [local] : [])].sort((a, b) => b.totalScore - a.totalScore);
}

export function buildCurrentUserEntry(user: UnifiedUser): GlobalLeaderboardEntry {
  const mathScore = readMathScore();
  const russianScore = readRussianScore();
  const englishScore = readEnglishScore();
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    totalScore: mathScore + russianScore + englishScore,
    mathScore,
    russianScore,
    englishScore,
  };
}

function readEnglishScore() {
  const state = readPersistedState<{ stats?: { totalXP?: number } }>('english-app-store');
  return numberOrZero(state?.stats?.totalXP);
}

function readRussianScore() {
  const state = readPersistedState<{ user?: { xp?: number } }>('rusyaz-storage');
  return numberOrZero(state?.user?.xp);
}

function readMathScore() {
  try {
    const raw = localStorage.getItem('mathapp_user');
    const user = raw ? JSON.parse(raw) as { totalScore?: number } : null;
    return numberOrZero(user?.totalScore);
  } catch {
    return 0;
  }
}

function readPersistedState<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as { state?: T } : null;
    return parsed?.state ?? null;
  } catch {
    return null;
  }
}

function numberOrZero(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

