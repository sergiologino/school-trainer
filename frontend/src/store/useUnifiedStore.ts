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
  updateProfile: (patch: Partial<Pick<UnifiedUser, 'avatar' | 'grade' | 'name' | 'email'>>) => void;
  logout: () => void;
}

export const useUnifiedStore = create<UnifiedState>()(
  persist(
    (set) => ({
      user: null,
      login: (u) => set({ user: u }),
      updateProfile: (patch) => set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),
      logout: () => set({ user: null }),
    }),
    { name: 'school-trainer-session' }
  )
);
