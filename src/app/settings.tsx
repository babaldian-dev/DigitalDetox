import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { usePasswordStore } from '../store/passwordStore';
import { useAppStore } from '../store/appStore';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Permissions from 'expo-permissions';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme, mode } = useTheme();
  const { resetAll } = useAppStore();
  const { isEnabled } = usePasswordStore();

  const styles = getStyles(colors, isDark);

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all your data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAll();
            Alert.alert('✅ Data Reset', 'All data has been reset successfully.');
          }
        }
      ]
    );
  };

  const handleToggle = () => {
    console.log('Toggle pressed, current mode:', mode);
    toggleTheme();
  };

  const navigateToPasswordSetup = () => {
    router.push('/password-setup');
  };

  const navigateToNotificationSettings = () => {
    router.push('/notification-settings');
  };

  const requestUsageAccess = async () => {
    try {
      // Open the system settings for usage access
      await Linking.openSettings();
      
      Alert.alert(
        'Enable Usage Access',
        'Please find "Digital Detox" in the list and toggle the switch ON.\n\n' +
        'This permission is required to detect when blocked apps are opened.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Unable to open settings. Please manually enable the permission.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>
        
        {/* Permissions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={requestUsageAccess}>
            <View style={styles.settingInfo}>
              <Ionicons name="stats-chart" size={24} color={colors.text} />
              <Text style={styles.settingText}>Enable Usage Access</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={colors.text} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleToggle}
              trackColor={{ false: colors.switchTrack, true: colors.success }}
              thumbColor={isDark ? colors.switchThumb : colors.switchThumb}
            />
          </View>

          <View style={[styles.settingItem, { marginTop: 4 }]}>
            <Text style={styles.themeStatus}>
              Current theme: {isDark ? '🌙 Dark' : '☀️ Light'}
            </Text>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={navigateToNotificationSettings}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color={colors.text} />
              <Text style={styles.settingText}>Notification Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={navigateToPasswordSetup}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed" size={24} color={colors.text} />
              <Text style={styles.settingText}>Password Protection</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={[styles.statusBadgeText, isEnabled ? styles.enabledText : styles.disabledText]}>
                {isEnabled ? '✅ Enabled' : '❌ Disabled'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle" size={24} color={colors.text} />
              <Text style={styles.settingText}>Version</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="heart" size={24} color={colors.danger} />
              <Text style={styles.settingText}>Made with ❤️ for recovery</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, styles.dangerSection]}>
          <Text style={[styles.sectionTitle, { color: colors.danger }]}>Danger Zone</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={handleReset}>
            <Ionicons name="trash" size={24} color={colors.danger} />
            <Text style={styles.dangerButtonText}>Reset All Data</Text>
          </TouchableOpacity>
        </View>
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
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    settingText: {
      fontSize: 16,
      color: colors.text,
    },
    settingValue: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    themeStatus: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusBadgeText: {
      fontSize: 12,
      fontWeight: '600',
    },
    enabledText: {
      color: '#4CAF50',
    },
    disabledText: {
      color: '#999',
    },
    dangerSection: {
      marginTop: 8,
    },
    dangerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff5f5',
      padding: 16,
      borderRadius: 12,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.danger,
    },
    dangerButtonText: {
      color: colors.danger,
      fontSize: 16,
      fontWeight: '600',
    },
  });
}
