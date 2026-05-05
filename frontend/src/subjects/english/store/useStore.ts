import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade: number;
}

export interface Achievement {
  id: string;
  title: string;
  titleRu: string;
  emoji: string;
  unlockedAt?: string;
}

export interface UserStats {
  totalXP: number;
  streakDays: number;
  lastStudyDate: string;
  wordsLearned: number;
  verbsLearned: number;
  perfectQuizzes: number;
  dictationsDone: number;
  achievements: Achievement[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  grade: number;
  streak: number;
}

export interface AppState {
  user: User | null;
  stats: UserStats;
  leaderboard: LeaderboardEntry[];
  currentSection: string;
  setUser: (user: User | null) => void;
  setCurrentSection: (section: string) => void;
  addXP: (amount: number) => void;
  incrementWordsLearned: () => void;
  incrementVerbsLearned: () => void;
  incrementPerfectQuizzes: () => void;
  incrementDictations: () => void;
  updateStreak: () => void;
  unlockAchievement: (id: string) => void;
  setGrade: (grade: number) => void;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Алёша К.', avatar: '🦊', xp: 2450, grade: 5, streak: 12 },
  { id: '2', name: 'Маша П.', avatar: '🦋', xp: 2100, grade: 6, streak: 8 },
  { id: '3', name: 'Игорь С.', avatar: '🐻', xp: 1890, grade: 4, streak: 15 },
  { id: '4', name: 'Аня Т.', avatar: '🐱', xp: 1650, grade: 5, streak: 5 },
  { id: '5', name: 'Дима В.', avatar: '🐯', xp: 1420, grade: 6, streak: 3 },
  { id: '6', name: 'Соня М.', avatar: '🦄', xp: 1200, grade: 4, streak: 7 },
  { id: '7', name: 'Коля Р.', avatar: '🦁', xp: 980, grade: 5, streak: 2 },
  { id: '8', name: 'Лера И.', avatar: '🐸', xp: 750, grade: 4, streak: 4 },
];

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_word', title: 'First Word', titleRu: 'Первое слово', emoji: '🌱' },
  { id: 'ten_words', title: 'Word Collector', titleRu: 'Коллекционер слов', emoji: '📚' },
  { id: 'fifty_words', title: 'Vocabulary Pro', titleRu: 'Мастер словаря', emoji: '🏆' },
  { id: 'first_verb', title: 'Verb Hunter', titleRu: 'Охотник за глаголами', emoji: '🎯' },
  { id: 'perfect_quiz', title: 'Perfect Score', titleRu: 'Отличник', emoji: '⭐' },
  { id: 'streak_7', title: '7-Day Streak', titleRu: '7 дней подряд', emoji: '🔥' },
  { id: 'dictation', title: 'Dictation Star', titleRu: 'Звезда диктанта', emoji: '🎤' },
  { id: 'xp_1000', title: 'XP Master', titleRu: 'Мастер опыта', emoji: '💫' },
];

const defaultStats: UserStats = {
  totalXP: 0,
  streakDays: 0,
  lastStudyDate: '',
  wordsLearned: 0,
  verbsLearned: 0,
  perfectQuizzes: 0,
  dictationsDone: 0,
  achievements: [],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      stats: defaultStats,
      leaderboard: MOCK_LEADERBOARD,
      currentSection: 'home',

      setUser: (user) => set({ user }),
      setCurrentSection: (section) => set({ currentSection: section }),

      addXP: (amount) => {
        const { stats, leaderboard, user } = get();
        const newXP = stats.totalXP + amount;
        set({ stats: { ...stats, totalXP: newXP } });

        if (user) {
          const existingIdx = leaderboard.findIndex(e => e.id === user.id);
          if (existingIdx >= 0) {
            const updated = [...leaderboard];
            updated[existingIdx] = { ...updated[existingIdx], xp: newXP };
            set({ leaderboard: updated.sort((a, b) => b.xp - a.xp) });
          } else {
            const newEntry: LeaderboardEntry = {
              id: user.id,
              name: user.name,
              avatar: '🦅',
              xp: newXP,
              grade: user.grade,
              streak: stats.streakDays,
            };
            set({ leaderboard: [...leaderboard, newEntry].sort((a, b) => b.xp - a.xp) });
          }
        }

        if (newXP >= 1000) get().unlockAchievement('xp_1000');
      },

      incrementWordsLearned: () => {
        const { stats } = get();
        const newCount = stats.wordsLearned + 1;
        set({ stats: { ...stats, wordsLearned: newCount } });
        if (newCount >= 1) get().unlockAchievement('first_word');
        if (newCount >= 10) get().unlockAchievement('ten_words');
        if (newCount >= 50) get().unlockAchievement('fifty_words');
      },

      incrementVerbsLearned: () => {
        const { stats } = get();
        const newCount = stats.verbsLearned + 1;
        set({ stats: { ...stats, verbsLearned: newCount } });
        if (newCount >= 1) get().unlockAchievement('first_verb');
      },

      incrementPerfectQuizzes: () => {
        const { stats } = get();
        set({ stats: { ...stats, perfectQuizzes: stats.perfectQuizzes + 1 } });
        get().unlockAchievement('perfect_quiz');
      },

      incrementDictations: () => {
        const { stats } = get();
        set({ stats: { ...stats, dictationsDone: stats.dictationsDone + 1 } });
        get().unlockAchievement('dictation');
      },

      updateStreak: () => {
        const { stats } = get();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (stats.lastStudyDate === today) return;
        
        const newStreak = stats.lastStudyDate === yesterday ? stats.streakDays + 1 : 1;
        set({ stats: { ...stats, streakDays: newStreak, lastStudyDate: today } });
        if (newStreak >= 7) get().unlockAchievement('streak_7');
      },

      unlockAchievement: (id) => {
        const { stats } = get();
        if (stats.achievements.find(a => a.id === id)) return;
        const achievement = ALL_ACHIEVEMENTS.find(a => a.id === id);
        if (!achievement) return;
        set({
          stats: {
            ...stats,
            achievements: [...stats.achievements, { ...achievement, unlockedAt: new Date().toISOString() }],
          },
        });
      },

      setGrade: (grade) => {
        const { user } = get();
        if (user) set({ user: { ...user, grade } });
      },
    }),
    { name: 'english-app-store' }
  )
);

export const ALL_ACHIEVEMENTS_LIST = ALL_ACHIEVEMENTS;
