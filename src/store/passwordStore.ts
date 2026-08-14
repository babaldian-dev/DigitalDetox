import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface PasswordState {
  isEnabled: boolean;
  isLocked: boolean;
  attempts: number;
  maxAttempts: number;
  lockUntil: string | null;
  
  setPassword: (password: string) => Promise<void>;
  verifyPassword: (password: string) => Promise<boolean>;
  checkLockStatus: () => boolean;
  incrementAttempts: () => void;
  resetAttempts: () => void;
  unlock: () => void;
  lock: () => void;
  disable: () => Promise<void>;
}

// We store the password in SecureStore for extra security
const PASSWORD_KEY = 'app_password';

export const usePasswordStore = create<PasswordState>((set, get) => ({
  isEnabled: false,
  isLocked: false,
  attempts: 0,
  maxAttempts: 5,
  lockUntil: null,

  setPassword: async (password: string) => {
    await SecureStore.setItemAsync(PASSWORD_KEY, password);
    set({ isEnabled: true, isLocked: true, attempts: 0 });
  },

  verifyPassword: async (password: string): Promise<boolean> => {
    const state = get();
    
    // Check if locked out
    if (state.lockUntil) {
      const lockTime = new Date(state.lockUntil);
      if (new Date() < lockTime) {
        return false;
      }
      // Lock expired, reset
      set({ lockUntil: null, attempts: 0 });
    }

    const storedPassword = await SecureStore.getItemAsync(PASSWORD_KEY);
    if (!storedPassword) return false;

    if (password === storedPassword) {
      set({ isLocked: false, attempts: 0 });
      return true;
    } else {
      const newAttempts = state.attempts + 1;
      if (newAttempts >= state.maxAttempts) {
        // Lock for 5 minutes
        const lockTime = new Date();
        lockTime.setMinutes(lockTime.getMinutes() + 5);
        set({ 
          attempts: newAttempts, 
          lockUntil: lockTime.toISOString(),
          isLocked: true 
        });
      } else {
        set({ attempts: newAttempts });
      }
      return false;
    }
  },

  checkLockStatus: () => {
    const state = get();
    if (state.lockUntil) {
      const lockTime = new Date(state.lockUntil);
      if (new Date() < lockTime) {
        return true;
      }
      // Lock expired
      set({ lockUntil: null, attempts: 0 });
      return false;
    }
    return false;
  },

  incrementAttempts: () => {
    set((state) => ({ attempts: state.attempts + 1 }));
  },

  resetAttempts: () => set({ attempts: 0 }),

  unlock: () => set({ isLocked: false, attempts: 0 }),

  lock: () => set({ isLocked: true }),

  disable: async () => {
    await SecureStore.deleteItemAsync(PASSWORD_KEY);
    set({ isEnabled: false, isLocked: false, attempts: 0, lockUntil: null });
  },
}));
