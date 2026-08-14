import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data - we'll replace with real app list later
const mockApps = [
  { id: '1', name: 'Instagram', packageName: 'com.instagram.android' },
  { id: '2', name: 'Facebook', packageName: 'com.facebook.android' },
  { id: '3', name: 'Twitter', packageName: 'com.twitter.android' },
  { id: '4', name: 'TikTok', packageName: 'com.tiktok.android' },
  { id: '5', name: 'YouTube', packageName: 'com.youtube.android' },
  { id: '6', name: 'Snapchat', packageName: 'com.snapchat.android' },
];

export default function AppSelectionScreen() {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const router = useRouter();

  const toggleApp = (appId: string) => {
    setSelectedApps(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Apps to Block</Text>
      <Text style={styles.subtitle}>
        Choose the apps you want to restrict access to
      </Text>

      <FlatList
        data={mockApps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.appItem}
            onPress={() => toggleApp(item.id)}
          >
            <View style={styles.appInfo}>
              <Text style={styles.appName}>{item.name}</Text>
              <Text style={styles.appPackage}>{item.packageName}</Text>
            </View>
            <Ionicons
              name={selectedApps.includes(item.id) ? 'checkbox' : 'square-outline'}
              size={24}
              color={selectedApps.includes(item.id) ? '#1a1a2e' : '#ccc'}
            />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[
          styles.confirmButton,
          selectedApps.length === 0 && styles.disabledButton,
        ]}
        disabled={selectedApps.length === 0}
        onPress={() => {
          console.log('Selected apps:', selectedApps);
          router.back();
        }}
      >
        <Text style={styles.confirmText}>
          Block {selectedApps.length} App{selectedApps.length !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 24,
  },
  appItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a2e',
  },
  appPackage: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  confirmButton: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
