import { create } from 'zustand';

interface AppState {
  isBlockingActive: boolean;
  blockedApps: string[];
  remainingTime: string;
  streak: number;
  attemptsBlocked: number;
  
  setBlockingActive: (active: boolean) => void;
  setBlockedApps: (apps: string[]) => void;
  setRemainingTime: (time: string) => void;
  incrementAttempts: () => void;
  resetStreak: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isBlockingActive: false,
  blockedApps: [],
  remainingTime: '0d 0h',
  streak: 0,
  attemptsBlocked: 0,
  
  setBlockingActive: (active) => set({ isBlockingActive: active }),
  setBlockedApps: (apps) => set({ blockedApps: apps }),
  setRemainingTime: (time) => set({ remainingTime: time }),
  incrementAttempts: () => 
    set((state) => ({ attemptsBlocked: state.attemptsBlocked + 1 })),
  resetStreak: () => set({ streak: 0 }),
}));
