import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#1a1a2e',
          headerTitleStyle: { fontWeight: '600' },
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
          name="settings" 
          options={{ title: 'Settings' }}
        />
      </Stack>
    </>
  );
}
