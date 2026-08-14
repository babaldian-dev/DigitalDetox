import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const isBlockingActive = false;
  const remainingTime = '2d 4h';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={styles.statusCard}>
          <Ionicons 
            name={isBlockingActive ? 'lock-closed' : 'lock-open'} 
            size={32} 
            color={isBlockingActive ? '#4CAF50' : '#FF6B6B'} 
          />
          <Text style={styles.statusText}>
            {isBlockingActive ? '🔒 Blocking Active' : '🔓 No Active Block'}
          </Text>
          {isBlockingActive && (
            <Text style={styles.remainingTime}>
              {remainingTime} remaining
            </Text>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Apps Blocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Blocked Attempts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0d</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Link href="/app-selection" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="apps" size={24} color="#fff" />
              <Text style={styles.buttonText}>Select Apps to Block</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/timer" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="time" size={24} color="#1a1a2e" />
              <Text style={styles.secondaryButtonText}>Set Timer</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity 
            style={[styles.primaryButton, styles.startButton]}
            onPress={() => {
              console.log('Start blocking');
            }}
          >
            <Ionicons name="play" size={24} color="#fff" />
            <Text style={styles.buttonText}>Start Blocking</Text>
          </TouchableOpacity>
        </View>

        {/* Motivation */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            "Small steps lead to big changes. You've got this! 💪"
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a2e',
    marginTop: 8,
  },
  remainingTime: {
    fontSize: 16,
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
  actionsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#1a1a2e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
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
  },
  startButton: {
    backgroundColor: '#4CAF50',
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
  motivationCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
  },
  motivationText: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
