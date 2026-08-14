import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore, getRandomQuote } from '../store/appStore';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const {
    isBlockingActive,
    blockedApps,
    streak,
    attemptsBlocked,
    selectedDuration,
    timerActive,
    currentQuote,
    setBlockingActive,
    setCurrentQuote,
    incrementStreak,
    startTimer,
    stopTimer,
    getRemainingTime,
  } = useAppStore();

  const [timeDisplay, setTimeDisplay] = useState('0h 0m');

  useEffect(() => {
    if (!currentQuote) {
      setCurrentQuote(getRandomQuote());
    }

    const quoteInterval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 30000);

    const timerInterval = setInterval(() => {
      if (timerActive) {
        const remaining = getRemainingTime();
        setTimeDisplay(remaining);
      }
    }, 1000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(timerInterval);
    };
  }, [timerActive]);

  const handleStartBlocking = () => {
    if (blockedApps.length === 0) {
      Alert.alert(
        'No Apps Selected',
        'Please select at least one app to block before starting.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Start Blocking',
      `You are about to block ${blockedApps.length} app(s) for ${selectedDuration} hours. Are you ready?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            setBlockingActive(true);
            startTimer();
            incrementStreak();
            Alert.alert('🔒 Blocking Started', `You're on a ${streak + 1} day streak! Stay focused!`);
          },
        },
      ]
    );
  };

  const handleStopBlocking = () => {
    Alert.alert(
      'Stop Blocking',
      'Are you sure you want to stop blocking? This will reset your progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            setBlockingActive(false);
            stopTimer();
          },
        },
      ]
    );
  };

  const navigateToAppSelection = () => router.push('/app-selection');
  const navigateToTimer = () => router.push('/timer');
  const navigateToAdultBlocking = () => router.push('/adult-blocking');

  const formatDuration = (hours: number) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      if (remainingHours === 0) {
        return `${days} day${days > 1 ? 's' : ''}`;
      }
      return `${days} day${days > 1 ? 's' : ''}, ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Banner */}
        <View style={[styles.statusCard, isBlockingActive && styles.activeCard]}>
          <Ionicons 
            name={isBlockingActive ? 'lock-closed' : 'lock-open'} 
            size={32} 
            color={isBlockingActive ? '#4CAF50' : '#FF6B6B'} 
          />
          <Text style={styles.statusText}>
            {isBlockingActive ? '🔒 Blocking Active' : '🔓 No Active Block'}
          </Text>
          {isBlockingActive && (
            <>
              <Text style={styles.remainingTime}>
                ⏱️ {getRemainingTime()} remaining
              </Text>
              <Text style={styles.durationText}>
                🎯 Goal: {formatDuration(selectedDuration)}
              </Text>
            </>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{blockedApps.length}</Text>
            <Text style={styles.statLabel}>Apps Blocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{attemptsBlocked}</Text>
            <Text style={styles.statLabel}>Blocked Attempts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{streak}d</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Quote Card */}
        <View style={styles.quoteCard}>
          <Ionicons name="chatbubble" size={20} color="#666" />
          <Text style={styles.quoteText}>"{currentQuote}"</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={navigateToAppSelection}
          >
            <Ionicons name="apps" size={24} color="#fff" />
            <Text style={styles.buttonText}>
              {blockedApps.length > 0 ? 'Manage Blocked Apps' : 'Select Apps to Block'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={navigateToAdultBlocking}
          >
            <Ionicons name="shield" size={24} color="#fff" />
            <Text style={styles.buttonText}>Adult Content Blocking</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={navigateToTimer}
          >
            <Ionicons name="time" size={24} color="#1a1a2e" />
            <Text style={styles.secondaryButtonText}>
              {timerActive ? `⏱️ ${timeDisplay}` : 'Set Timer'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.primaryButton, 
              isBlockingActive ? styles.stopButton : styles.startButton
            ]}
            onPress={isBlockingActive ? handleStopBlocking : handleStartBlocking}
          >
            <Ionicons 
              name={isBlockingActive ? 'stop' : 'play'} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.buttonText}>
              {isBlockingActive ? 'Stop Blocking' : 'Start Blocking'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Footer */}
        {isBlockingActive && (
          <View style={styles.motivationFooter}>
            <Text style={styles.motivationFooterText}>
              💪 You've blocked {attemptsBlocked} attempts today!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: Platform.OS === 'android' ? 120 : 80,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? 140 : 80,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#f0faf0',
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a2e',
    marginTop: 8,
  },
  remainingTime: {
    fontSize: 18,
    color: '#1a1a2e',
    marginTop: 4,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  quoteCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quoteText: {
    fontSize: 16,
    color: '#1a1a2e',
    flex: 1,
    fontStyle: 'italic',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#1a1a2e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    minHeight: 56,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 56,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '600',
  },
  motivationFooter: {
    margin: 16,
    padding: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    alignItems: 'center',
  },
  motivationFooterText: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
    fontWeight: '500',
  },
});
