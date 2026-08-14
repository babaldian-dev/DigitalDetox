import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { usePasswordStore } from '../store/passwordStore';
import * as Haptics from 'expo-haptics';

export default function PasswordLockScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { verifyPassword, attempts, maxAttempts, lockUntil, checkLockStatus, unlock } = usePasswordStore();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');

  const styles = getStyles(colors, isDark);

  useEffect(() => {
    const checkLock = () => {
      const locked = checkLockStatus();
      setIsLocked(locked);
      
      if (locked && lockUntil) {
        const lockTime = new Date(lockUntil);
        const now = new Date();
        const diff = Math.max(0, Math.floor((lockTime.getTime() - now.getTime()) / 1000));
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        setRemainingTime(`${minutes}m ${seconds}s`);
      }
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [lockUntil]);

  const handleVerify = async () => {
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (isLocked) {
      setError(`Too many attempts. Please wait ${remainingTime}.`);
      return;
    }

    setLoading(true);
    setError('');

    const isValid = await verifyPassword(password);
    setLoading(false);

    if (isValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      unlock();
      router.replace('/');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const remainingAttempts = maxAttempts - (attempts + 1);
      if (remainingAttempts > 0) {
        setError(`Incorrect password. ${remainingAttempts} attempt(s) remaining.`);
      } else {
        setError('Too many attempts. Locked for 5 minutes.');
        setIsLocked(true);
      }
      setPassword('');
    }
  };

  if (isLocked) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.lockedContainer}>
          <Ionicons name="lock-closed" size={64} color={colors.danger} />
          <Text style={styles.lockedTitle}>Too Many Attempts</Text>
          <Text style={styles.lockedSubtitle}>
            Your app is locked for security reasons.
          </Text>
          <Text style={styles.lockedTime}>
            ⏱️ Wait {remainingTime} before trying again
          </Text>
          <TouchableOpacity 
            style={styles.exitButton}
            onPress={() => {
              // Exit app
              // On Android, this closes the app
            }}
          >
            <Text style={styles.exitButtonText}>Close App</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.lockContainer}>
        <Ionicons name="lock-closed" size={48} color={colors.text} />
        <Text style={styles.title}>🔒 Digital Detox</Text>
        <Text style={styles.subtitle}>Enter your password to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            autoFocus
            onSubmitEditing={handleVerify}
            autoCapitalize="none"
          />
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TouchableOpacity 
          style={styles.unlockButton} 
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="unlock" size={24} color="#fff" />
              <Text style={styles.unlockButtonText}>Unlock</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          💡 If you forgot your password, you can uninstall and reinstall the app, but you will lose your recovery data.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function getStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    lockContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    lockedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 16,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
      marginBottom: 32,
    },
    inputContainer: {
      width: '100%',
      maxWidth: 320,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.inputBg,
      marginBottom: 16,
    },
    input: {
      fontSize: 18,
      paddingVertical: 16,
      paddingHorizontal: 16,
      color: colors.text,
      textAlign: 'center',
      letterSpacing: 4,
    },
    errorText: {
      color: colors.danger,
      fontSize: 14,
      marginBottom: 16,
      textAlign: 'center',
    },
    unlockButton: {
      backgroundColor: '#1a1a2e',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      gap: 8,
      width: '100%',
      maxWidth: 320,
      minHeight: 56,
    },
    unlockButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    hint: {
      marginTop: 24,
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 320,
    },
    lockedTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 16,
    },
    lockedSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
    },
    lockedTime: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.danger,
      marginTop: 16,
    },
    exitButton: {
      marginTop: 32,
      backgroundColor: colors.surface,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    exitButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
  });
}
