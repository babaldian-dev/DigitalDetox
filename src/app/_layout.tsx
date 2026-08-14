import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';
import { usePasswordStore } from '../store/passwordStore';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

function RootLayoutContent() {
  const { colors, isDark } = useTheme();
  const { isEnabled, isLocked, checkLockStatus } = usePasswordStore();
  const [shouldLock, setShouldLock] = useState(false);

  useEffect(() => {
    const checkLock = async () => {
      if (isEnabled) {
        const locked = checkLockStatus();
        setShouldLock(locked);
      }
    };
    checkLock();
  }, [isEnabled, isLocked]);

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
        {shouldLock ? (
          <Stack.Screen 
            name="password-lock" 
            options={{ 
              headerShown: false,
              title: 'Lock Screen',
            }}
          />
        ) : null}
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
        <Stack.Screen 
          name="password-setup" 
          options={{ title: 'Password Protection' }}
        />
        <Stack.Screen 
          name="password-lock" 
          options={{ 
            headerShown: false,
            title: 'Lock Screen',
          }}
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
