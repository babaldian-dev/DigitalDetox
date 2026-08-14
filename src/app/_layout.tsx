import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Digital Detox',
          headerStyle: { backgroundColor: '#f8f9fa' },
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
    </Stack>
  );
}
