import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useThemeStore, colors, ThemeColors } from '../theme/theme';

interface ThemeContextType {
  colors: ThemeColors;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { mode, toggleTheme, setTheme } = useThemeStore();
  const isDark = mode === 'dark';
  const themeColors = colors[mode];

  // Debug logging
  useEffect(() => {
    console.log('ThemeProvider: Current mode is', mode);
  }, [mode]);

  const value = {
    colors: themeColors,
    mode,
    toggleTheme: () => {
      console.log('ThemeProvider: Toggle called, current mode:', mode);
      toggleTheme();
    },
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
