import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RussianItemStat } from '../lib/russianAdaptive';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  lastActivity: string;
  badges: string[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
}

export interface TaskResult {
  taskId: string;
  score: number;
  total: number;
  date: string;
  mode: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentMode: string;
  taskResults: TaskResult[];
  leaderboard: LeaderboardEntry[];
  /** Счётчики верно/неверно по ключам `mcq|…`, `dict|…` — для частоты повторов. */
  russianPracticeStats: Record<string, RussianItemStat>;
  login: (user: User) => void;
  logout: () => void;
  addXP: (amount: number) => void;
  addTaskResult: (result: TaskResult) => void;
  recordRussianPracticeOutcome: (practiceKey: string, correct: boolean) => void;
  setCurrentMode: (mode: string) => void;
  incrementStreak: () => void;
  addBadge: (badge: string) => void;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Аня Смирнова', avatar: '👧', xp: 4820, level: 12, streak: 15 },
  { id: '2', name: 'Миша Козлов', avatar: '👦', xp: 4200, level: 11, streak: 8 },
  { id: '3', name: 'Даша Новикова', avatar: '🧒', xp: 3950, level: 10, streak: 22 },
  { id: '4', name: 'Ваня Петров', avatar: '👦', xp: 3600, level: 9, streak: 5 },
  { id: '5', name: 'Катя Иванова', avatar: '👧', xp: 3100, level: 8, streak: 12 },
  { id: '6', name: 'Саша Попов', avatar: '🧒', xp: 2800, level: 7, streak: 3 },
  { id: '7', name: 'Лена Воронова', avatar: '👧', xp: 2400, level: 7, streak: 9 },
  { id: '8', name: 'Дима Орлов', avatar: '👦', xp: 2100, level: 6, streak: 1 },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      currentMode: 'home',
      taskResults: [],
      leaderboard: MOCK_LEADERBOARD,
      russianPracticeStats: {},

      login: (user: User) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      addXP: (amount: number) => {
        const { user } = get();
        if (!user) return;
        const newXP = user.xp + amount;
        const newLevel = Math.floor(newXP / 500) + 1;
        set({ user: { ...user, xp: newXP, level: newLevel } });
      },

      addTaskResult: (result: TaskResult) => {
        set((state) => ({
          taskResults: [...state.taskResults, result],
        }));
        get().addXP(Math.floor((result.score / result.total) * 100));
      },

      recordRussianPracticeOutcome: (practiceKey: string, correct: boolean) => {
        set((state) => {
          const prev = state.russianPracticeStats[practiceKey] ?? { wrong: 0, right: 0 };
          return {
            russianPracticeStats: {
              ...state.russianPracticeStats,
              [practiceKey]: {
                wrong: prev.wrong + (correct ? 0 : 1),
                right: prev.right + (correct ? 1 : 0),
              },
            },
          };
        });
      },

      setCurrentMode: (mode: string) => set({ currentMode: mode }),

      incrementStreak: () => {
        const { user } = get();
        if (!user) return;
        const today = new Date().toDateString();
        if (user.lastActivity !== today) {
          set({ user: { ...user, streak: user.streak + 1, lastActivity: today } });
        }
      },

      addBadge: (badge: string) => {
        const { user } = get();
        if (!user) return;
        if (!user.badges.includes(badge)) {
          set({ user: { ...user, badges: [...user.badges, badge] } });
        }
      },
    }),
    {
      name: 'rusyaz-storage',
    }
  )
);
