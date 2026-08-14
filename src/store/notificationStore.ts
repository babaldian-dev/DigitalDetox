import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

interface NotificationState {
  isEnabled: boolean;
  dailyReminder: boolean;
  eveningReminder: boolean;
  streakReminder: boolean;
  completionReminder: boolean;
  
  setIsEnabled: (enabled: boolean) => void;
  setDailyReminder: (enabled: boolean) => void;
  setEveningReminder: (enabled: boolean) => void;
  setStreakReminder: (enabled: boolean) => void;
  setCompletionReminder: (enabled: boolean) => void;
  toggleAll: (enabled: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      isEnabled: true,
      dailyReminder: true,
      eveningReminder: false,
      streakReminder: true,
      completionReminder: true,
      
      setIsEnabled: (enabled) => set({ isEnabled: enabled }),
      
      setDailyReminder: (enabled) => set({ dailyReminder: enabled }),
      
      setEveningReminder: (enabled) => set({ eveningReminder: enabled }),
      
      setStreakReminder: (enabled) => set({ streakReminder: enabled }),
      
      setCompletionReminder: (enabled) => set({ completionReminder: enabled }),
      
      toggleAll: (enabled) => set({
        isEnabled: enabled,
        dailyReminder: enabled,
        eveningReminder: enabled,
        streakReminder: enabled,
        completionReminder: enabled,
      }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
