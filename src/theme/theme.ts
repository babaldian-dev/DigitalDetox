import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleTheme: () => set((state) => ({
        mode: state.mode === 'light' ? 'dark' : 'light'
      })),
      setTheme: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Theme colors
export const colors = {
  light: {
    background: '#f8f9fa',
    surface: '#ffffff',
    surfaceAlt: '#f0f0f5',
    text: '#1a1a2e',
    textSecondary: '#666666',
    textInverse: '#ffffff',
    primary: '#1a1a2e',
    primaryLight: '#f0f0f5',
    border: '#e0e0e0',
    card: '#ffffff',
    cardShadow: '#000000',
    success: '#4CAF50',
    danger: '#FF6B6B',
    warning: '#FF9800',
    info: '#2196F3',
    quoteBg: '#f0f4ff',
    quoteText: '#1a1a2e',
    motivationBg: '#e8f5e9',
    motivationText: '#2e7d32',
    statusBg: '#ffffff',
    statusActiveBg: '#f0faf0',
    statusActiveBorder: '#4CAF50',
    switchTrack: '#ccc',
    switchThumb: '#ffffff',
    modalBg: '#ffffff',
    overlayBg: 'rgba(0,0,0,0.5)',
    inputBg: '#ffffff',
    inputBorder: '#ddd',
  },
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    surfaceAlt: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    textInverse: '#1a1a2e',
    primary: '#3a3a5e',
    primaryLight: '#2a2a3e',
    border: '#333333',
    card: '#1e1e1e',
    cardShadow: '#000000',
    success: '#4CAF50',
    danger: '#FF6B6B',
    warning: '#FF9800',
    info: '#2196F3',
    quoteBg: '#1a1a3e',
    quoteText: '#bbbbff',
    motivationBg: '#1a2a1a',
    motivationText: '#6bcb77',
    statusBg: '#1e1e1e',
    statusActiveBg: '#1a2a1a',
    statusActiveBorder: '#4CAF50',
    switchTrack: '#444',
    switchThumb: '#888',
    modalBg: '#1e1e1e',
    overlayBg: 'rgba(0,0,0,0.8)',
    inputBg: '#2a2a2a',
    inputBorder: '#444',
  },
};

export type ThemeColors = typeof colors.light;
