import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';

function RootLayoutContent() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600', color: colors.text },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Digital Detox',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen 
          name="app-selection" 
          options={{ title: 'Select Apps' }}
        />
        <Stack.Screen 
          name="timer" 
          options={{ title: 'Set Timer' }}
        />
        <Stack.Screen 
          name="adult-blocking" 
          options={{ title: 'Adult Content Blocking' }}
        />
        <Stack.Screen 
          name="recovery" 
          options={{ title: 'Recovery Journey' }}
        />
        <Stack.Screen 
          name="settings" 
          options={{ title: 'Settings' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
