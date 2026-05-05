import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UnifiedUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade: number;
}

interface UnifiedState {
  user: UnifiedUser | null;
  login: (u: UnifiedUser) => void;
  logout: () => void;
}

export const useUnifiedStore = create<UnifiedState>()(
  persist(
    (set) => ({
      user: null,
      login: (u) => set({ user: u }),
      logout: () => set({ user: null }),
    }),
    { name: 'school-trainer-session' }
  )
);
