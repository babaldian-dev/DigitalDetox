import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type DurationOption = {
  label: string;
  days: number;
};

const durations: DurationOption[] = [
  { label: '1 Day', days: 1 },
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
  { label: '1 Year', days: 365 },
];

export default function TimerScreen() {
  const [selectedDuration, setSelectedDuration] = useState<DurationOption | null>(null);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose Your Goal</Text>
      <Text style={styles.subtitle}>
        How long do you want to stay focused?
      </Text>

      <View style={styles.durationGrid}>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration.days}
            style={[
              styles.durationCard,
              selectedDuration?.days === duration.days && styles.selectedCard,
            ]}
            onPress={() => setSelectedDuration(duration)}
          >
            <Text style={styles.durationLabel}>{duration.label}</Text>
            <Text style={styles.durationSubtext}>
              {duration.days} day{duration.days > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          !selectedDuration && styles.disabledButton,
        ]}
        disabled={!selectedDuration}
        onPress={() => {
          if (selectedDuration) {
            router.back();
          }
        }}
      >
        <Text style={styles.confirmText}>
          Set Goal
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
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  durationCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#1a1a2e',
    backgroundColor: '#f0f0f5',
  },
  durationLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  durationSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
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
