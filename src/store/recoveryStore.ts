import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface JournalEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1 = terrible, 5 = great
  urgeLevel: 1 | 2 | 3 | 4 | 5; // 1 = no urge, 5 = strong urge
  notes: string;
  triggers: string[];
  resisted: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  date: string | null;
  icon: string;
}

interface RecoveryState {
  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  
  // Streak
  currentStreak: number;
  longestStreak: number;
  lastCheckinDate: string | null;
  updateStreak: () => void;
  
  // Milestones
  milestones: Milestone[];
  checkMilestones: () => void;
  unlockMilestone: (id: string) => void;
  
  // Relapse
  lastRelapseDate: string | null;
  relapseCount: number;
  recordRelapse: (trigger: string) => void;
  
  // Urge tracking
  urgeLog: { date: string; level: number }[];
  logUrge: (level: number) => void;
}

const defaultMilestones: Milestone[] = [
  { id: 'first-day', title: 'First Day Clean', description: 'Completed your first full day without porn', achieved: false, date: null, icon: '🌟' },
  { id: 'three-days', title: '3 Days Clean', description: 'Three days of progress', achieved: false, date: null, icon: '🔥' },
  { id: 'one-week', title: '1 Week Clean', description: 'Seven days of commitment', achieved: false, date: null, icon: '💪' },
  { id: 'two-weeks', title: '2 Weeks Clean', description: 'Two weeks of strength', achieved: false, date: null, icon: '🏆' },
  { id: 'one-month', title: '1 Month Clean', description: '30 days of transformation', achieved: false, date: null, icon: '🎯' },
  { id: 'three-months', title: '3 Months Clean', description: '90 days of new habits', achieved: false, date: null, icon: '🚀' },
  { id: 'six-months', title: '6 Months Clean', description: 'Half a year of freedom', achieved: false, date: null, icon: '🌈' },
  { id: 'one-year', title: '1 Year Clean', description: 'Full year of recovery', achieved: false, date: null, icon: '🎉' },
];

export const useRecoveryStore = create<RecoveryState>()(
  persist(
    (set, get) => ({
      journalEntries: [],
      currentStreak: 0,
      longestStreak: 0,
      lastCheckinDate: null,
      milestones: defaultMilestones,
      lastRelapseDate: null,
      relapseCount: 0,
      urgeLog: [],

      addJournalEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: Date.now().toString(),
        };
        set((state) => ({
          journalEntries: [newEntry, ...state.journalEntries],
        }));
        get().updateStreak();
        get().checkMilestones();
      },

      updateStreak: () => {
        const today = new Date().toDateString();
        const { lastCheckinDate, currentStreak, longestStreak } = get();
        
        if (lastCheckinDate === today) return;
        
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        if (lastCheckinDate === yesterday) {
          const newStreak = currentStreak + 1;
          set({
            currentStreak: newStreak,
            lastCheckinDate: today,
            longestStreak: Math.max(newStreak, longestStreak),
          });
        } else if (lastCheckinDate !== today) {
          set({
            currentStreak: 1,
            lastCheckinDate: today,
          });
        }
        get().checkMilestones();
      },

      checkMilestones: () => {
        const { currentStreak, milestones } = get();
        const newMilestones = milestones.map((milestone) => {
          let shouldUnlock = false;
          switch (milestone.id) {
            case 'first-day': shouldUnlock = currentStreak >= 1; break;
            case 'three-days': shouldUnlock = currentStreak >= 3; break;
            case 'one-week': shouldUnlock = currentStreak >= 7; break;
            case 'two-weeks': shouldUnlock = currentStreak >= 14; break;
            case 'one-month': shouldUnlock = currentStreak >= 30; break;
            case 'three-months': shouldUnlock = currentStreak >= 90; break;
            case 'six-months': shouldUnlock = currentStreak >= 180; break;
            case 'one-year': shouldUnlock = currentStreak >= 365; break;
            default: return milestone;
          }
          if (shouldUnlock && !milestone.achieved) {
            return { ...milestone, achieved: true, date: new Date().toISOString() };
          }
          return milestone;
        });
        set({ milestones: newMilestones });
      },

      unlockMilestone: (id) => {
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, achieved: true, date: new Date().toISOString() } : m
          ),
        }));
      },

      recordRelapse: (trigger) => {
        set((state) => ({
          lastRelapseDate: new Date().toISOString(),
          relapseCount: state.relapseCount + 1,
          currentStreak: 0,
        }));
        // Log the relapse in journal
        get().addJournalEntry({
          date: new Date().toISOString(),
          mood: 1,
          urgeLevel: 5,
          notes: `Relapse triggered by: ${trigger}`,
          triggers: [trigger],
          resisted: false,
        });
      },

      logUrge: (level) => {
        set((state) => ({
          urgeLog: [...state.urgeLog, { date: new Date().toISOString(), level }],
        }));
      },
    }),
    {
      name: 'recovery-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
