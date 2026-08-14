import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store/appStore';

type DurationOption = {
  label: string;
  days: number;
  hours: number;
  totalHours: number;
  icon: string;
  color: string;
};

const durations: DurationOption[] = [
  // Hours
  { label: '1 Hour', days: 0, hours: 1, totalHours: 1, icon: '⏰', color: '#4CAF50' },
  { label: '2 Hours', days: 0, hours: 2, totalHours: 2, icon: '⏰', color: '#66BB6A' },
  { label: '4 Hours', days: 0, hours: 4, totalHours: 4, icon: '⏳', color: '#81C784' },
  { label: '8 Hours', days: 0, hours: 8, totalHours: 8, icon: '🌙', color: '#A5D6A7' },
  // Days
  { label: '1 Day', days: 1, hours: 0, totalHours: 24, icon: '🌅', color: '#2196F3' },
  { label: '3 Days', days: 3, hours: 0, totalHours: 72, icon: '📅', color: '#1976D2' },
  { label: '7 Days', days: 7, hours: 0, totalHours: 168, icon: '📆', color: '#1565C0' },
  { label: '30 Days', days: 30, hours: 0, totalHours: 720, icon: '🎯', color: '#FF9800' },
];

export default function TimerScreen() {
  const [selectedDuration, setSelectedDuration] = useState<DurationOption | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [customUnit, setCustomUnit] = useState<'hours' | 'days'>('hours');
  const [modalVisible, setModalVisible] = useState(false);
  const { setSelectedDuration: setStoreDuration, selectedDuration: currentDuration, timerActive } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    const current = durations.find(d => d.totalHours === currentDuration);
    if (current) {
      setSelectedDuration(current);
    }
  }, [currentDuration]);

  const handleConfirm = () => {
    if (selectedDuration) {
      console.log('Setting duration to:', selectedDuration.totalHours, 'hours');
      setStoreDuration(selectedDuration.totalHours);
      
      const displayText = selectedDuration.days > 0 
        ? `${selectedDuration.days} day${selectedDuration.days > 1 ? 's' : ''}`
        : `${selectedDuration.hours} hour${selectedDuration.hours > 1 ? 's' : ''}`;
      
      Alert.alert(
        '✅ Timer Set',
        `Blocking duration set to ${displayText}`,
        [{ text: 'OK' }]
      );
      
      router.back();
    }
  };

  const handleCustomConfirm = () => {
    const value = parseInt(customValue);
    if (isNaN(value) || value < 1) {
      Alert.alert('Invalid Duration', 'Please enter a valid number (minimum 1).');
      return;
    }
    
    let totalHours: number;
    let displayText: string;
    
    if (customUnit === 'hours') {
      if (value > 720) {
        Alert.alert('Too Long', 'Maximum is 720 hours (30 days).');
        return;
      }
      totalHours = value;
      displayText = `${value} hour${value > 1 ? 's' : ''}`;
    } else {
      if (value > 365) {
        Alert.alert('Too Long', 'Maximum is 365 days.');
        return;
      }
      totalHours = value * 24;
      displayText = `${value} day${value > 1 ? 's' : ''}`;
    }
    
    const customOption: DurationOption = {
      label: displayText,
      days: customUnit === 'days' ? value : 0,
      hours: customUnit === 'hours' ? value : 0,
      totalHours: totalHours,
      icon: '🎯',
      color: '#9C27B0',
    };
    
    setSelectedDuration(customOption);
    setModalVisible(false);
    Alert.alert('✅ Custom Duration Set', `Blocking duration set to ${displayText}.`);
  };

  const formatDuration = (totalHours: number) => {
    if (totalHours >= 24) {
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      if (hours === 0) {
        return `${days} day${days > 1 ? 's' : ''}`;
      }
      return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${totalHours} hour${totalHours > 1 ? 's' : ''}`;
  };

  const openCustomModal = () => {
    setCustomValue('');
    setCustomUnit('hours');
    setModalVisible(true);
  };

  const isDurationSelected = (duration: DurationOption) => {
    return selectedDuration?.totalHours === duration.totalHours;
  };

  const isDurationActive = (duration: DurationOption) => {
    return timerActive && currentDuration === duration.totalHours;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Goal</Text>
        <Text style={styles.subtitle}>
          How long do you want to stay focused?
        </Text>
        {timerActive && (
          <Text style={styles.activeTimer}>
            ⏱️ Timer active: {formatDuration(currentDuration)}
          </Text>
        )}
        <Text style={styles.currentSelection}>
          Current: {formatDuration(currentDuration)}
        </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hours Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⏰ Hours</Text>
        </View>
        <View style={styles.durationGrid}>
          {durations.slice(0, 4).map((duration) => (
            <TouchableOpacity
              key={duration.totalHours}
              style={[
                styles.durationCard,
                isDurationSelected(duration) && styles.selectedCard,
                isDurationActive(duration) && styles.activeCard,
              ]}
              onPress={() => setSelectedDuration(duration)}
            >
              <Text style={styles.durationIcon}>{duration.icon}</Text>
              <Text style={styles.durationLabel}>{duration.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Days Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📅 Days</Text>
        </View>
        <View style={styles.durationGrid}>
          {durations.slice(4).map((duration) => (
            <TouchableOpacity
              key={duration.totalHours}
              style={[
                styles.durationCard,
                isDurationSelected(duration) && styles.selectedCard,
                isDurationActive(duration) && styles.activeCard,
              ]}
              onPress={() => setSelectedDuration(duration)}
            >
              <Text style={styles.durationIcon}>{duration.icon}</Text>
              <Text style={styles.durationLabel}>{duration.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Duration Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚙️ Custom</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.customCard,
            selectedDuration && !durations.some(d => d.totalHours === selectedDuration.totalHours) && styles.selectedCard,
          ]}
          onPress={openCustomModal}
        >
          <View style={styles.customCardContent}>
            <Text style={styles.customIcon}>🎯</Text>
            <View>
              <Text style={styles.customTitle}>Set Custom Duration</Text>
              <Text style={styles.customSubtext}>
                Enter your own hours or days
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </View>
          {selectedDuration && !durations.some(d => d.totalHours === selectedDuration.totalHours) && (
            <View style={styles.customBadge}>
              <Text style={styles.customBadgeText}>✓ Selected</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedDuration && styles.disabledButton,
            ]}
            disabled={!selectedDuration}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>
              {selectedDuration 
                ? `Set Goal: ${selectedDuration.label}` 
                : 'Select a Duration'}
            </Text>
          </TouchableOpacity>
          
          {selectedDuration && (
            <Text style={styles.confirmSubtext}>
              You'll stay focused for {formatDuration(selectedDuration.totalHours)}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Custom Duration Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Custom Duration</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter the duration you want to stay focused:
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter number"
                keyboardType="number-pad"
                value={customValue}
                onChangeText={setCustomValue}
                autoFocus={true}
              />
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[styles.unitButton, customUnit === 'hours' && styles.unitButtonActive]}
                  onPress={() => setCustomUnit('hours')}
                >
                  <Text style={[styles.unitText, customUnit === 'hours' && styles.unitTextActive]}>
                    Hours
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitButton, customUnit === 'days' && styles.unitButtonActive]}
                  onPress={() => setCustomUnit('days')}
                >
                  <Text style={[styles.unitText, customUnit === 'days' && styles.unitTextActive]}>
                    Days
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.quickOptions}>
              <Text style={styles.quickLabel}>Quick options:</Text>
              <View style={styles.quickButtons}>
                {customUnit === 'hours' 
                  ? [1, 2, 4, 8, 12, 24].map((hours) => (
                      <TouchableOpacity
                        key={hours}
                        style={styles.quickButton}
                        onPress={() => setCustomValue(hours.toString())}
                      >
                        <Text style={styles.quickButtonText}>{hours}h</Text>
                      </TouchableOpacity>
                    ))
                  : [1, 3, 7, 14, 30, 90].map((days) => (
                      <TouchableOpacity
                        key={days}
                        style={styles.quickButton}
                        onPress={() => setCustomValue(days.toString())}
                      >
                        <Text style={styles.quickButtonText}>{days}d</Text>
                      </TouchableOpacity>
                    ))
                }
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleCustomConfirm}
              >
                <Text style={styles.confirmModalButtonText}>Set Duration</Text>
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
    padding: 20,
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
  activeTimer: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 6,
    fontWeight: '500',
  },
  currentSelection: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  durationCard: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    width: '23%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedCard: {
    borderColor: '#1a1a2e',
    backgroundColor: '#f0f0f5',
  },
  activeCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0faf0',
  },
  durationIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  durationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  // Custom Card
  customCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  customCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customIcon: {
    fontSize: 28,
  },
  customTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  customSubtext: {
    fontSize: 13,
    color: '#666',
  },
  customBadge: {
    marginTop: 8,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  customBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
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
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
    color: '#1a1a2e',
  },
  unitToggle: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f5',
    marginLeft: 4,
  },
  unitButtonActive: {
    backgroundColor: '#1a1a2e',
  },
  unitText: {
    fontSize: 14,
    color: '#666',
  },
  unitTextActive: {
    color: '#ffffff',
  },
  quickOptions: {
    marginBottom: 20,
  },
  quickLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickButton: {
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickButtonText: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: '#f0f0f5',
  },
  confirmModalButton: {
    backgroundColor: '#1a1a2e',
  },
  cancelModalButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmModalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
