import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BlockedApp {
  packageName: string;
  name: string;
  icon?: string;
}

interface AppState {
  // Blocking state
  isBlockingActive: boolean;
  blockedApps: BlockedApp[];
  blockingStartTime: string | null;
  blockingDuration: number; // in hours (NOT days anymore)
  
  // Timer state
  timerActive: boolean;
  timerStartTime: string | null;
  timerEndTime: string | null;
  selectedDuration: number; // in hours
  
  // Statistics
  streak: number;
  attemptsBlocked: number;
  totalBlocks: number;
  lastBlockDate: string | null;
  currentQuote: string;
  
  // Actions
  setBlockingActive: (active: boolean) => void;
  setBlockedApps: (apps: BlockedApp[]) => void;
  setSelectedDuration: (hours: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  getRemainingTime: () => string;
  incrementAttempts: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  setCurrentQuote: (quote: string) => void;
  resetAll: () => void;
}

// Motivational quotes
const quotes = [
  "Small steps lead to big changes. 💪",
  "You're stronger than your excuses. 🧘",
  "Every second you resist is a victory. ⚡",
  "Focus on progress, not perfection. 🌱",
  "Your future self will thank you. 🙏",
  "Discipline is choosing between what you want now and what you want most. 🎯",
  "You have power over your mind, not outside events. 🧠",
  "The best time to start was yesterday. The next best time is now. ⏰",
  "Success is the sum of small efforts repeated daily. 📈",
  "You didn't come this far to only come this far. 🚀",
];

const defaultState = {
  isBlockingActive: false,
  blockedApps: [],
  blockingStartTime: null,
  blockingDuration: 24, // 24 hours (1 day) default
  timerActive: false,
  timerStartTime: null,
  timerEndTime: null,
  selectedDuration: 24, // 24 hours default
  streak: 0,
  attemptsBlocked: 0,
  totalBlocks: 0,
  lastBlockDate: null,
  currentQuote: quotes[0],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setBlockingActive: (active) => set({ isBlockingActive: active }),
      
      setBlockedApps: (apps) => set({ blockedApps: apps }),
      
      setSelectedDuration: (hours) => set({ selectedDuration: hours }),
      
      startTimer: () => {
        const now = new Date().toISOString();
        const duration = get().selectedDuration;
        const endTime = new Date(Date.now() + duration * 60 * 60 * 1000).toISOString();
        set({
          timerActive: true,
          timerStartTime: now,
          timerEndTime: endTime,
        });
      },
      
      stopTimer: () => {
        set({
          timerActive: false,
          timerStartTime: null,
          timerEndTime: null,
        });
      },
      
      getRemainingTime: () => {
        const { timerEndTime } = get();
        if (!timerEndTime) return '0h 0m';
        
        const now = new Date();
        const end = new Date(timerEndTime);
        const diff = Math.max(0, end.getTime() - now.getTime());
        
        if (diff === 0) {
          get().stopTimer();
          return '0h 0m';
        }
        
        const hours = Math.floor(diff / (60 * 60 * 1000));
        const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        
        if (hours >= 24) {
          const days = Math.floor(hours / 24);
          const remainingHours = hours % 24;
          if (remainingHours === 0) {
            return `${days}d 0h`;
          }
          return `${days}d ${remainingHours}h`;
        }
        
        return `${hours}h ${minutes}m`;
      },
      
      incrementAttempts: () => {
        set((state) => ({
          attemptsBlocked: state.attemptsBlocked + 1,
          totalBlocks: state.totalBlocks + 1,
        }));
      },
      
      incrementStreak: () => {
        const today = new Date().toDateString();
        const lastDate = get().lastBlockDate;
        
        if (lastDate === today) return;
        
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        if (lastDate === yesterday) {
          set((state) => ({
            streak: state.streak + 1,
            lastBlockDate: today,
          }));
        } else {
          set({
            streak: 1,
            lastBlockDate: today,
          });
        }
      },
      
      resetStreak: () => set({ streak: 0 }),
      
      setCurrentQuote: (quote) => set({ currentQuote: quote }),
      
      resetAll: () => {
        set({
          ...defaultState,
          currentQuote: quotes[Math.floor(Math.random() * quotes.length)],
        });
        AsyncStorage.removeItem('app-storage');
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};
