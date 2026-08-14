import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRecoveryStore } from '../store/recoveryStore';
import SimpleBarChart from '../components/SimpleBarChart';

const moods = [
  { value: 1, label: '😢 Terrible', color: '#FF6B6B' },
  { value: 2, label: '😔 Low', color: '#FFA94D' },
  { value: 3, label: '😐 Okay', color: '#FFD93D' },
  { value: 4, label: '😊 Good', color: '#6BCB77' },
  { value: 5, label: '🌟 Great', color: '#4D96FF' },
];

const urgeLevels = [
  { value: 1, label: 'No urge', color: '#6BCB77' },
  { value: 2, label: 'Mild', color: '#FFD93D' },
  { value: 3, label: 'Moderate', color: '#FFA94D' },
  { value: 4, label: 'Strong', color: '#FF6B6B' },
  { value: 5, label: 'Very strong', color: '#FF0000' },
];

export default function RecoveryScreen() {
  const router = useRouter();
  const {
    journalEntries,
    currentStreak,
    longestStreak,
    milestones,
    relapseCount,
    addJournalEntry,
    logUrge,
    recordRelapse,
  } = useRecoveryStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [selectedUrge, setSelectedUrge] = useState<number>(1);
  const [journalNotes, setJournalNotes] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [relapseTrigger, setRelapseTrigger] = useState('');

  const commonTriggers = ['Stress', 'Loneliness', 'Boredom', 'Anxiety', 'Late night', 'Social media', 'Work pressure'];

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleCheckin = () => {
    if (selectedTriggers.length === 0) {
      Alert.alert('Add Triggers', 'Please select at least one trigger or note.');
      return;
    }

    addJournalEntry({
      date: new Date().toISOString(),
      mood: selectedMood as 1 | 2 | 3 | 4 | 5,
      urgeLevel: selectedUrge as 1 | 2 | 3 | 4 | 5,
      notes: journalNotes,
      triggers: selectedTriggers,
      resisted: selectedUrge <= 3,
    });

    logUrge(selectedUrge);

    setModalVisible(false);
    setJournalNotes('');
    setSelectedTriggers([]);
    setSelectedMood(3);
    setSelectedUrge(1);

    Alert.alert('✅ Check-in Complete', 'Your progress has been saved! Keep going! 💪');
  };

  const handleRelapse = () => {
    if (!relapseTrigger.trim()) {
      Alert.alert('Add Trigger', 'Please describe what triggered the relapse.');
      return;
    }
    recordRelapse(relapseTrigger);
    setShowRelapseModal(false);
    setRelapseTrigger('');
    Alert.alert(
      '🔄 Relapse Recorded',
      'It\'s okay to stumble. What matters is getting back up. You\'ve got this! 💪',
      [{ text: 'Keep Going' }]
    );
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toDateString());
    }
    return days;
  };

  const getUrgeData = () => {
    const last7Days = getLast7Days();
    return last7Days.map((day) => {
      const entry = journalEntries.find(e => new Date(e.date).toDateString() === day);
      return entry ? entry.urgeLevel : 0;
    });
  };

  const getMoodData = () => {
    const last7Days = getLast7Days();
    return last7Days.map((day) => {
      const entry = journalEntries.find(e => new Date(e.date).toDateString() === day);
      return entry ? entry.mood : 0;
    });
  };

  const getCompletedMilestones = () => milestones.filter(m => m.achieved).length;
  const getTotalMilestones = () => milestones.length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Recovery Journey</Text>
          <Text style={styles.subtitle}>Track your progress and celebrate your wins</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statNumber}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statNumber}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📓</Text>
            <Text style={styles.statNumber}>{journalEntries.length}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
        </View>

        {/* Urge Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>📊 Urge Levels (Last 7 Days)</Text>
          {journalEntries.length > 0 ? (
            <SimpleBarChart
              data={getUrgeData()}
              labels={['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']}
              maxValue={5}
              color="#FF6B6B"
            />
          ) : (
            <Text style={styles.noDataText}>Complete check-ins to see your progress</Text>
          )}
        </View>

        {/* Milestones */}
        <View style={styles.milestoneSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏅 Milestones</Text>
            <Text style={styles.sectionCount}>
              {getCompletedMilestones()}/{getTotalMilestones()}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.milestoneScroll}>
            {milestones.map((milestone) => (
              <View
                key={milestone.id}
                style={[
                  styles.milestoneCard,
                  milestone.achieved && styles.milestoneAchieved,
                ]}
              >
                <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <Text style={styles.milestoneDesc}>{milestone.description}</Text>
                {milestone.achieved && (
                  <View style={styles.milestoneBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.milestoneBadgeText}>Achieved!</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Journal Entries */}
        <View style={styles.journalSection}>
          <Text style={styles.sectionTitle}>📖 Recent Journal</Text>
          {journalEntries.slice(0, 3).map((entry) => (
            <View key={entry.id} style={styles.journalEntry}>
              <View style={styles.journalHeader}>
                <Text style={styles.journalDate}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                <View style={styles.journalMood}>
                  <Text style={styles.moodEmoji}>
                    {moods.find(m => m.value === entry.mood)?.label.split(' ')[0]}
                  </Text>
                </View>
              </View>
              <Text style={styles.journalNotes}>{entry.notes || 'No notes'}</Text>
              <View style={styles.journalTriggers}>
                {entry.triggers.map((trigger) => (
                  <View key={trigger} style={styles.triggerTag}>
                    <Text style={styles.triggerTagText}>{trigger}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
          {journalEntries.length === 0 && (
            <Text style={styles.noDataText}>Start your first check-in to track your journey</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.buttonText}>Daily Check-in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowRelapseModal(true)}
          >
            <Ionicons name="refresh" size={24} color="#FF6B6B" />
            <Text style={[styles.buttonText, { color: '#FF6B6B' }]}>
              Record Relapse (Honesty is strength)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Check-in Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Daily Check-in</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.modalLabel}>How are you feeling today?</Text>
              <View style={styles.moodGrid}>
                {moods.map((mood) => (
                  <TouchableOpacity
                    key={mood.value}
                    style={[
                      styles.moodButton,
                      selectedMood === mood.value && styles.moodSelected,
                      { borderColor: mood.color },
                    ]}
                    onPress={() => setSelectedMood(mood.value)}
                  >
                    <Text style={styles.moodEmojiLarge}>{mood.label.split(' ')[0]}</Text>
                    <Text style={styles.moodLabel}>{mood.label.split(' ')[1]}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Urge level today?</Text>
              <View style={styles.urgeGrid}>
                {urgeLevels.map((urge) => (
                  <TouchableOpacity
                    key={urge.value}
                    style={[
                      styles.urgeButton,
                      selectedUrge === urge.value && styles.urgeSelected,
                    ]}
                    onPress={() => setSelectedUrge(urge.value)}
                  >
                    <Text style={styles.urgeLabel}>{urge.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>What triggered you today?</Text>
              <View style={styles.triggerGrid}>
                {commonTriggers.map((trigger) => (
                  <TouchableOpacity
                    key={trigger}
                    style={[
                      styles.triggerButton,
                      selectedTriggers.includes(trigger) && styles.triggerSelected,
                    ]}
                    onPress={() => toggleTrigger(trigger)}
                  >
                    <Text style={styles.triggerText}>{trigger}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Additional notes</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="How was your day? Any challenges?"
                multiline
                numberOfLines={3}
                value={journalNotes}
                onChangeText={setJournalNotes}
              />

              <TouchableOpacity
                style={styles.checkinButton}
                onPress={handleCheckin}
              >
                <Text style={styles.checkinButtonText}>Save Check-in</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Relapse Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRelapseModal}
        onRequestClose={() => setShowRelapseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.relapseModal]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#FF6B6B' }]}>Record Relapse</Text>
              <TouchableOpacity onPress={() => setShowRelapseModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.relapseMessage}>
              Relapse is part of recovery. Being honest about it is a sign of strength, not weakness.
            </Text>

            <Text style={styles.modalLabel}>What triggered the relapse?</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Be honest with yourself..."
              multiline
              numberOfLines={3}
              value={relapseTrigger}
              onChangeText={setRelapseTrigger}
            />

            <View style={styles.relapseButtons}>
              <TouchableOpacity
                style={[styles.checkinButton, { backgroundColor: '#FF6B6B' }]}
                onPress={handleRelapse}
              >
                <Text style={styles.checkinButtonText}>Record Relapse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.checkinButton, { backgroundColor: '#f0f0f5' }]}
                onPress={() => setShowRelapseModal(false)}
              >
                <Text style={{ color: '#666', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginTop: 10,
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
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  statEmoji: {
    fontSize: 24,
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
  chartCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
  milestoneSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  sectionCount: {
    fontSize: 14,
    color: '#666',
  },
  milestoneScroll: {
    flexDirection: 'row',
  },
  milestoneCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  milestoneAchieved: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#f0faf0',
  },
  milestoneIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  milestoneTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  milestoneDesc: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  milestoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  milestoneBadgeText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  journalSection: {
    marginBottom: 16,
  },
  journalEntry: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  journalDate: {
    fontSize: 14,
    color: '#666',
  },
  journalMood: {
    flexDirection: 'row',
  },
  moodEmoji: {
    fontSize: 20,
  },
  journalNotes: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  journalTriggers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  triggerTag: {
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  triggerTagText: {
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    gap: 12,
    marginTop: 8,
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
    backgroundColor: '#fff5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '95%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  relapseModal: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginTop: 16,
    marginBottom: 8,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodButton: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 60,
    backgroundColor: '#f8f9fa',
  },
  moodSelected: {
    backgroundColor: '#f0f0f5',
  },
  moodEmojiLarge: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  urgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  urgeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  urgeSelected: {
    borderColor: '#1a1a2e',
    backgroundColor: '#f0f0f5',
  },
  urgeLabel: {
    fontSize: 12,
    color: '#666',
  },
  triggerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  triggerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  triggerSelected: {
    borderColor: '#1a1a2e',
    backgroundColor: '#f0f0f5',
  },
  triggerText: {
    fontSize: 13,
    color: '#333',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  checkinButton: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  checkinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  relapseMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  relapseButtons: {
    gap: 8,
    marginTop: 8,
  },
});
