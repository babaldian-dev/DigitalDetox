import React, { createContext, useContext, ReactNode } from 'react';
import { useThemeStore, colors, ThemeColors } from '../theme/theme';

interface ThemeContextType {
  colors: ThemeColors;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { mode, toggleTheme } = useThemeStore();
  const isDark = mode === 'dark';
  const themeColors = colors[mode];

  return (
    <ThemeContext.Provider value={{
      colors: themeColors,
      mode,
      toggleTheme,
      isDark,
    }}>
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
