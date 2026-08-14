import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store/appStore';

// Mock data for testing
const mockApps = [
  { packageName: 'com.instagram.android', name: 'Instagram' },
  { packageName: 'com.facebook.android', name: 'Facebook' },
  { packageName: 'com.twitter.android', name: 'Twitter' },
  { packageName: 'com.tiktok.android', name: 'TikTok' },
  { packageName: 'com.youtube.android', name: 'YouTube' },
  { packageName: 'com.snapchat.android', name: 'Snapchat' },
  { packageName: 'com.whatsapp', name: 'WhatsApp' },
  { packageName: 'com.reddit.frontpage', name: 'Reddit' },
  { packageName: 'com.pinterest', name: 'Pinterest' },
  { packageName: 'com.linkedin.android', name: 'LinkedIn' },
];

export default function AppSelectionScreen() {
  const { blockedApps, setBlockedApps } = useAppStore();
  const [selectedApps, setSelectedApps] = useState<string[]>(
    blockedApps.map(app => app.packageName)
  );
  const router = useRouter();

  const toggleApp = (packageName: string) => {
    setSelectedApps(prev =>
      prev.includes(packageName)
        ? prev.filter(id => id !== packageName)
        : [...prev, packageName]
    );
  };

  const handleConfirm = () => {
    const selectedAppObjects = mockApps
      .filter(app => selectedApps.includes(app.packageName))
      .map(app => ({
        packageName: app.packageName,
        name: app.name,
      }));
    
    setBlockedApps(selectedAppObjects);
    Alert.alert('✅ Apps Saved', `${selectedApps.length} app(s) selected for blocking.`);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Apps to Block</Text>
        <Text style={styles.subtitle}>
          Choose the apps you want to restrict access to
        </Text>
        <Text style={styles.selectedCount}>
          {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} selected
        </Text>
      </View>

      <FlatList
        data={mockApps}
        keyExtractor={(item) => item.packageName}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.appItem}
            onPress={() => toggleApp(item.packageName)}
          >
            <View style={styles.appInfo}>
              <View style={styles.appIconPlaceholder}>
                <Ionicons name="apps" size={20} color="#999" />
              </View>
              <View>
                <Text style={styles.appName}>{item.name}</Text>
                <Text style={styles.appPackage}>{item.packageName}</Text>
              </View>
            </View>
            <Ionicons
              name={selectedApps.includes(item.packageName) ? 'checkbox' : 'square-outline'}
              size={24}
              color={selectedApps.includes(item.packageName) ? '#1a1a2e' : '#ccc'}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={[
          styles.confirmButton,
          selectedApps.length === 0 && styles.disabledButton,
        ]}
        disabled={selectedApps.length === 0}
        onPress={handleConfirm}
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'android' ? 120 : 80,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginBottom: 4,
  },
  selectedCount: {
    fontSize: 14,
    color: '#1a1a2e',
    marginTop: 4,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: Platform.OS === 'android' ? 160 : 80,
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 40 : 20,
    left: 20,
    right: 20,
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
