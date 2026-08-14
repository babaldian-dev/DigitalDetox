import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Switch, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { usePasswordStore } from '../store/passwordStore';
import * as Haptics from 'expo-haptics';

export default function PasswordSetupScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { isEnabled, setPassword, disable } = usePasswordStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const styles = getStyles(colors, isDark);

  const handleSavePassword = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Please enter a password.');
      return;
    }

    if (newPassword.length < 4) {
      Alert.alert('Error', 'Password must be at least 4 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    await setPassword(newPassword);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      '✅ Password Set',
      'Your app is now password protected. You will be prompted for your password when you open the app.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleDisable = async () => {
    Alert.alert(
      'Disable Password',
      'Are you sure you want to remove password protection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            await disable();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('✅ Password Disabled', 'Password protection has been removed.');
            router.back();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🔒 Password Protection</Text>
        <Text style={styles.subtitle}>
          Protect your app with a PIN or password to keep your recovery data private and prevent disabling blocking features.
        </Text>

        <View style={styles.card}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View style={[styles.statusBadge, isEnabled ? styles.enabledBadge : styles.disabledBadge]}>
              <Text style={styles.statusBadgeText}>
                {isEnabled ? '✅ Enabled' : '❌ Disabled'}
              </Text>
            </View>
          </View>
        </View>

        {isEnabled ? (
          // Disable Password Section
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Manage Password</Text>
            <Text style={styles.sectionSubtitle}>
              Your app is currently password protected.
            </Text>
            <TouchableOpacity style={styles.disableButton} onPress={handleDisable}>
              <Ionicons name="trash" size={24} color="#FF6B6B" />
              <Text style={styles.disableButtonText}>Remove Password</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Set Password Section
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Set Password</Text>
            <Text style={styles.sectionSubtitle}>
              Choose a PIN or password (minimum 4 characters)
            </Text>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Ionicons 
                    name={showNew ? 'eye-off' : 'eye'} 
                    size={24} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons 
                    name={showConfirm ? 'eye-off' : 'eye'} 
                    size={24} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSavePassword}
            >
              <Ionicons name="lock-closed" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Set Password</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            💡 Password protection helps keep your recovery data private and adds an extra barrier if you're tempted to disable blocking features.
          </Text>
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
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 4,
      marginBottom: 20,
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
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    statusLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
    },
    enabledBadge: {
      backgroundColor: '#e8f5e9',
    },
    disabledBadge: {
      backgroundColor: '#f5f5f5',
    },
    statusBadgeText: {
      fontSize: 14,
      fontWeight: '500',
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
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 6,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.inputBg,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 12,
      color: colors.text,
    },
    saveButton: {
      backgroundColor: '#1a1a2e',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      gap: 8,
      marginTop: 8,
    },
    saveButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    disableButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      gap: 8,
      borderWidth: 1,
      borderColor: '#FF6B6B',
      backgroundColor: '#fff5f5',
    },
    disableButtonText: {
      color: '#FF6B6B',
      fontSize: 16,
      fontWeight: '600',
    },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1a1a2a' : '#f0f4ff',
      padding: 16,
      borderRadius: 12,
      gap: 12,
      marginTop: 8,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
}
