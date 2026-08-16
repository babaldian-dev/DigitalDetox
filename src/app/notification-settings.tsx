import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useNotificationStore } from '../store/notificationStore';
import { useState, useEffect } from 'react';
import Constants from 'expo-constants';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const {
    isEnabled,
    dailyReminder,
    eveningReminder,
    streakReminder,
    completionReminder,
    setIsEnabled,
    setDailyReminder,
    setEveningReminder,
    setStreakReminder,
    setCompletionReminder,
    toggleAll,
  } = useNotificationStore();

  const [isExpoGo, setIsExpoGo] = useState(false);

  const styles = getStyles(colors, isDark);

  useEffect(() => {
    // Check if running in Expo Go
    const isExpoGoApp = Constants.appOwnership === 'expo';
    setIsExpoGo(isExpoGoApp);
  }, []);

  const handleToggleAll = (value: boolean) => {
    if (isExpoGo) {
      Alert.alert(
        '⚠️ Expo Go Limitation',
        'Notifications only work in a standalone app or development build.\n\n' +
        'You can still configure your preferences now. They will work when you build the app.',
        [{ text: 'OK' }]
      );
    }
    toggleAll(value);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🔔 Notifications</Text>
        <Text style={styles.subtitle}>
          Stay motivated with daily reminders and progress alerts
        </Text>

        {/* Expo Go Warning */}
        {isExpoGo && (
          <View style={styles.warningCard}>
            <Ionicons name="warning" size={24} color="#FF9800" />
            <Text style={styles.warningText}>
              ⚠️ You're in Expo Go. Notifications will work in a standalone build or development build.
            </Text>
          </View>
        )}

        {/* Master Switch */}
        <View style={styles.card}>
          <View style={styles.masterRow}>
            <View style={styles.masterInfo}>
              <Ionicons 
                name={isEnabled ? 'notifications' : 'notifications-off'} 
                size={28} 
                color={isEnabled ? colors.success : colors.textSecondary} 
              />
              <View>
                <Text style={styles.masterText}>
                  {isEnabled ? '✅ Notifications On' : '❌ Notifications Off'}
                </Text>
                <Text style={styles.masterSubtext}>
                  {isEnabled ? 'You will receive reminders and alerts' : 'All notifications are disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={isEnabled}
              onValueChange={handleToggleAll}
              trackColor={{ false: colors.switchTrack, true: colors.success }}
              thumbColor={isEnabled ? colors.switchThumb : colors.switchThumb}
            />
          </View>
        </View>

        {/* Notification Types */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reminder Types</Text>
          <Text style={styles.sectionSubtitle}>
            Choose what notifications you want to receive
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="sunny" size={24} color={colors.text} />
              <View>
                <Text style={styles.settingText}>Morning Check-in</Text>
                <Text style={styles.settingSubtext}>Daily reminder to check in (9 AM)</Text>
              </View>
            </View>
            <Switch
              value={dailyReminder && isEnabled}
              onValueChange={() => {
                if (isExpoGo) {
                  Alert.alert('💡 Reminder', 'Notifications will work when you build a standalone APK or development build.', [{ text: 'OK' }]);
                }
                setDailyReminder(!dailyReminder);
              }}
              trackColor={{ false: colors.switchTrack, true: colors.success }}
              thumbColor={dailyReminder && isEnabled ? colors.switchThumb : colors.switchThumb}
              disabled={!isEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={24} color={colors.text} />
              <View>
                <Text style={styles.settingText}>Evening Reflection</Text>
                <Text style={styles.settingSubtext}>Evening reminder to reflect (9 PM)</Text>
              </View>
            </View>
            <Switch
              value={eveningReminder && isEnabled}
              onValueChange={() => {
                if (isExpoGo) {
                  Alert.alert('💡 Reminder', 'Notifications will work when you build a standalone APK or development build.', [{ text: 'OK' }]);
                }
                setEveningReminder(!eveningReminder);
              }}
              trackColor={{ false: colors.switchTrack, true: colors.success }}
              thumbColor={eveningReminder && isEnabled ? colors.switchThumb : colors.switchThumb}
              disabled={!isEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="flame" size={24} color={colors.text} />
              <View>
                <Text style={styles.settingText}>Streak Alerts</Text>
                <Text style={styles.settingSubtext}>Motivation when you're on a streak</Text>
              </View>
            </View>
            <Switch
              value={streakReminder && isEnabled}
              onValueChange={() => setStreakReminder(!streakReminder)}
              trackColor={{ false: colors.switchTrack, true: colors.success }}
              thumbColor={streakReminder && isEnabled ? colors.switchThumb : colors.switchThumb}
              disabled={!isEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="checkmark-circle" size={24} color={colors.text} />
              <View>
                <Text style={styles.settingText}>Blocking Complete</Text>
                <Text style={styles.settingSubtext}>Alert when a blocking session ends</Text>
              </View>
            </View>
            <Switch
              value={completionReminder && isEnabled}
              onValueChange={() => setCompletionReminder(!completionReminder)}
              trackColor={{ false: colors.switchTrack, true: colors.success }}
              thumbColor={completionReminder && isEnabled ? colors.switchThumb : colors.switchThumb}
              disabled={!isEnabled}
            />
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            💡 Notifications work even when the app is closed. You can customize which reminders you receive.
          </Text>
        </View>

        {!isExpoGo && (
          <View style={styles.standaloneNote}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.standaloneText}>
              ✅ Notifications will work in this build!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingBottom: 120,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 10,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 4,
      marginBottom: 20,
    },
    warningCard: {
      backgroundColor: '#fff3e0',
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    warningText: {
      flex: 1,
      fontSize: 14,
      color: '#E65100',
    },
    card: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    masterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    masterInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    masterText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    masterSubtext: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    settingText: {
      fontSize: 16,
      color: colors.text,
    },
    settingSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1a1a2a' : '#f0f4ff',
      padding: 16,
      borderRadius: 12,
      gap: 12,
      marginBottom: 16,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
    },
    standaloneNote: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#e8f5e9',
      padding: 16,
      borderRadius: 12,
      gap: 12,
      marginTop: 8,
    },
    standaloneText: {
      fontSize: 14,
      color: '#2e7d32',
      fontWeight: '500',
    },
  });
}
