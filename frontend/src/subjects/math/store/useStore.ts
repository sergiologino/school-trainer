import { create } from 'zustand';
import { submitSubjectScoreBestEffort } from '@/leaderboard/leaderboardApi';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  totalScore: number;
  level: number;
  xp: number;
  badges: string[];
  completedTopics: string[];
  topicScores: Record<string, number>;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  totalScore: number;
  level: number;
}

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  currentScreen: string;
  currentTopic: string | null;
  currentLesson: string | null;
  leaderboard: LeaderboardEntry[];
  showConfetti: boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  setScreen: (screen: string) => void;
  setCurrentTopic: (topic: string | null) => void;
  setCurrentLesson: (lesson: string | null) => void;
  addScore: (topicId: string, score: number) => void;
  addXP: (amount: number) => void;
  addBadge: (badge: string) => void;
  markTopicComplete: (topicId: string) => void;
  setShowConfetti: (show: boolean) => void;
  updateLeaderboard: () => void;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '2', name: 'Алиса К.', avatar: '👧', totalScore: 1850, level: 8 },
  { id: '3', name: 'Миша П.', avatar: '👦', totalScore: 1620, level: 7 },
  { id: '4', name: 'Даша С.', avatar: '👧', totalScore: 1480, level: 6 },
  { id: '5', name: 'Артём В.', avatar: '👦', totalScore: 1200, level: 5 },
  { id: '6', name: 'Соня М.', avatar: '👧', totalScore: 980, level: 4 },
  { id: '7', name: 'Кирилл О.', avatar: '👦', totalScore: 750, level: 3 },
  { id: '8', name: 'Лена Б.', avatar: '👧', totalScore: 640, level: 3 },
];

const getSavedUser = (): User | null => {
  try {
    const saved = localStorage.getItem('mathapp_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem('mathapp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mathapp_user');
    }
  } catch {}
};

const savedUser = getSavedUser();

export const useStore = create<AppState>((set, get) => ({
  user: savedUser,
  isLoggedIn: !!savedUser,
  currentScreen: savedUser ? 'home' : 'landing',
  currentTopic: null,
  currentLesson: null,
  leaderboard: MOCK_LEADERBOARD,
  showConfetti: false,

  login: (userData) => {
    const existingUser = getSavedUser();
    const newUser: User = {
      id: userData.id || '1',
      name: userData.name || 'Ученик',
      avatar: userData.avatar || '🎒',
      email: userData.email || '',
      totalScore: existingUser?.totalScore || 0,
      level: existingUser?.level || 1,
      xp: existingUser?.xp || 0,
      badges: existingUser?.badges || [],
      completedTopics: existingUser?.completedTopics || [],
      topicScores: existingUser?.topicScores || {},
    };
    saveUser(newUser);
    set({ user: newUser, isLoggedIn: true, currentScreen: 'home' });
    get().updateLeaderboard();
  },

  logout: () => {
    saveUser(null);
    set({ user: null, isLoggedIn: false, currentScreen: 'landing' });
  },

  setScreen: (screen) => set({ currentScreen: screen }),
  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

  addScore: (topicId, score) => {
    const { user } = get();
    if (!user) return;
    const prevScore = user.topicScores[topicId] || 0;
    const newTopicScores = { ...user.topicScores, [topicId]: Math.max(prevScore, score) };
    const totalScore = Object.values(newTopicScores).reduce((a, b) => a + b, 0);
    const updatedUser = { ...user, topicScores: newTopicScores, totalScore };
    saveUser(updatedUser);
    set({ user: updatedUser });
    submitSubjectScoreBestEffort({
      userId: updatedUser.id,
      subject: 'math',
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      score: updatedUser.totalScore,
      level: updatedUser.level,
    });
    get().updateLeaderboard();
  },

  addXP: (amount) => {
    const { user } = get();
    if (!user) return;
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 200) + 1;
    const updatedUser = { ...user, xp: newXP, level: newLevel };
    saveUser(updatedUser);
    set({ user: updatedUser });
    submitSubjectScoreBestEffort({
      userId: updatedUser.id,
      subject: 'math',
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      score: updatedUser.totalScore,
      level: updatedUser.level,
    });
  },

  addBadge: (badge) => {
    const { user } = get();
    if (!user || user.badges.includes(badge)) return;
    const updatedUser = { ...user, badges: [...user.badges, badge] };
    saveUser(updatedUser);
    set({ user: updatedUser });
  },

  markTopicComplete: (topicId) => {
    const { user } = get();
    if (!user) return;
    if (user.completedTopics.includes(topicId)) return;
    const updatedUser = { ...user, completedTopics: [...user.completedTopics, topicId] };
    saveUser(updatedUser);
    set({ user: updatedUser });
  },

  setShowConfetti: (show) => set({ showConfetti: show }),

  updateLeaderboard: () => {
    const { user } = get();
    if (!user) return;
    const userEntry: LeaderboardEntry = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      totalScore: user.totalScore,
      level: user.level,
    };
    const filtered = MOCK_LEADERBOARD.filter(e => e.id !== user.id);
    const combined = [...filtered, userEntry].sort((a, b) => b.totalScore - a.totalScore);
    set({ leaderboard: combined });
  },
}));
