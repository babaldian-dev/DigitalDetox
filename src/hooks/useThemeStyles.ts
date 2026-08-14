import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../theme/theme';

export function useThemeStyles() {
  const { colors, isDark, toggleTheme, mode } = useTheme();
  
  const getStyles = <T extends Record<string, any>>(
    styleCreator: (colors: ThemeColors, isDark: boolean) => T
  ): T => {
    return styleCreator(colors, isDark);
  };

  return {
    colors,
    isDark,
    toggleTheme,
    mode,
    getStyles,
  };
}
