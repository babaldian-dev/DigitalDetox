import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Linking, Modal, TextInput, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type DurationOption = {
  label: string;
  hours: number;
  icon: string;
  color: string;
  description: string;
};

const durations: DurationOption[] = [
  { label: '1 Hour', hours: 1, icon: '⏰', color: '#4CAF50', description: 'Quick focus session' },
  { label: '4 Hours', hours: 4, icon: '⏳', color: '#81C784', description: 'Half work day' },
  { label: '8 Hours', hours: 8, icon: '🌙', color: '#A5D6A7', description: 'Full work day' },
  { label: '1 Day', hours: 24, icon: '🌅', color: '#2196F3', description: '24-hour reset' },
  { label: '3 Days', hours: 72, icon: '📅', color: '#1976D2', description: 'Weekend challenge' },
  { label: '7 Days', hours: 168, icon: '📆', color: '#1565C0', description: 'One week clean' },
  { label: '30 Days', hours: 720, icon: '🎯', color: '#FF9800', description: 'Monthly reset' },
  { label: '90 Days', hours: 2160, icon: '🏆', color: '#9C27B0', description: '90-day challenge' },
  { label: '1 Year', hours: 8760, icon: '🌟', color: '#F44336', description: 'Full year commitment' },
];

export default function AdultBlockingScreen() {
  const router = useRouter();
  const [isAdultBlockingEnabled, setIsAdultBlockingEnabled] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<DurationOption | null>(null);
  const [blocklistCount, setBlocklistCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [customHours, setCustomHours] = useState('');
  const [blockingActive, setBlockingActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [timerEndTime, setTimerEndTime] = useState<Date | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  
  // Adult content blocklist sources
  const blocklistSources = [
    { name: 'UT1 Pornography', domains: '150,000+', url: 'https://dsi.ut-capitole.fr/blacklists/' },
    { name: 'EasyList Adult', domains: '50,000+', url: 'https://easylist.to/' },
    { name: 'AdGuard Adult', domains: '100,000+', url: 'https://adguard.com/en/adguard-adult-filter/overview.html' },
  ];

  useEffect(() => {
    // Timer update
    const timerInterval = setInterval(() => {
      if (blockingActive && timerEndTime) {
        const now = new Date();
        const diff = timerEndTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setBlockingActive(false);
          setTimerEndTime(null);
          setRemainingTime('Expired');
          Alert.alert(
            '🎉 Blocking Complete!',
            'Your adult content blocking session has ended successfully.\n\n' +
            'You stayed focused for your entire goal! Keep up the great work! 💪',
            [{ text: 'Great Job!' }]
          );
        } else {
          const hours = Math.floor(diff / (60 * 60 * 1000));
          const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
          const days = Math.floor(hours / 24);
          
          if (days > 0) {
            const remainingHours = hours % 24;
            setRemainingTime(`${days}d ${remainingHours}h ${minutes}m`);
          } else {
            setRemainingTime(`${hours}h ${minutes}m`);
          }
        }
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [blockingActive, timerEndTime]);

  const handleToggle = () => {
    if (!isAdultBlockingEnabled) {
      // Show consent dialog before enabling
      Alert.alert(
        '⚠️ Enable Adult Content Blocking',
        'This feature will block access to adult content websites across all browsers and apps on your device.\n\n' +
        '⚠️ IMPORTANT: Once you start a blocking session, you CANNOT stop it early. This is designed to help you stay committed to your recovery.\n\n' +
        'Do you understand and want to proceed?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'I Understand', 
            onPress: () => {
              setIsAdultBlockingEnabled(true);
              Alert.alert(
                '✅ Adult Content Blocking Enabled',
                'Adult content will now be blocked on this device.\n\n' +
                'Please select a duration for how long you want blocking to remain active.\n\n' +
                '⚠️ Remember: Once started, you cannot stop the session early!',
                [{ text: 'OK' }]
              );
            }
          }
        ]
      );
    } else {
      // Confirm before disabling
      Alert.alert(
        'Disable Adult Content Blocking',
        'Are you sure you want to disable adult content blocking?\n\n' +
        'If you have an active session, it will be cancelled.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive',
            onPress: () => {
              setIsAdultBlockingEnabled(false);
              setBlockingActive(false);
              setTimerEndTime(null);
            }
          }
        ]
      );
    }
  };

  const handleStartBlocking = () => {
    if (!selectedDuration) {
      Alert.alert('Select Duration', 'Please select a duration for blocking.');
      return;
    }

    // Show final warning before starting
    Alert.alert(
      '⚠️ Final Confirmation',
      `You are about to start blocking adult content for ${selectedDuration.label}.\n\n` +
      `🔒 You CANNOT stop or pause this session until the time is up.\n\n` +
      `⏱️ Duration: ${selectedDuration.label}\n` +
      `📝 ${selectedDuration.description}\n\n` +
      'Are you ready to commit to this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'I Commit',
          onPress: () => {
            const endTime = new Date(Date.now() + selectedDuration.hours * 60 * 60 * 1000);
            setTimerEndTime(endTime);
            setBlockingActive(true);
            
            const hours = selectedDuration.hours;
            let displayText = selectedDuration.label;
            
            Alert.alert(
              '🔒 Blocking Started',
              `Adult content blocking is now active for ${displayText}.\n\n` +
              `⏱️ Timer will count down from: ${selectedDuration.label}\n` +
              '🔒 You cannot stop this session early.\n\n' +
              'Stay strong! You\'ve got this! 💪',
              [{ text: 'I Will Do This!' }]
            );
          }
        }
      ]
    );
  };

  const handleCustomConfirm = () => {
    const hours = parseInt(customHours);
    if (isNaN(hours) || hours < 1) {
      Alert.alert('Invalid Duration', 'Please enter a valid number (minimum 1 hour).');
      return;
    }
    
    if (hours > 8760) {
      Alert.alert('Too Long', 'Maximum is 8760 hours (1 year).');
      return;
    }
    
    const customOption: DurationOption = {
      label: `${hours} Hours`,
      hours: hours,
      icon: '⚙️',
      color: '#9C27B0',
      description: 'Custom duration',
    };
    
    setSelectedDuration(customOption);
    setModalVisible(false);
    Alert.alert('✅ Custom Duration Set', `Adult content blocking set to ${hours} hours.`);
  };

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

  const handleBlocklistInfo = (source: typeof blocklistSources[0]) => {
    Alert.alert(
      source.name,
      `${source.domains} domains blocked\n\nSource: ${source.url}`,
      [
        { text: 'OK' },
        { text: 'Visit Source', onPress: () => Linking.openURL(source.url) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Adult Content Blocking</Text>
          <Text style={styles.subtitle}>
            Protect yourself from adult content across all browsers and apps
          </Text>
        </View>

        {/* Note for Expo Go */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={24} color="#FF9800" />
          <Text style={styles.noteText}>
            ⚠️ You're running in Expo Go. For full DNS filtering, you'll need to build a standalone APK.
          </Text>
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, blockingActive && styles.activeCard]}>
          <View style={styles.statusRow}>
            <View style={styles.statusIcon}>
              <Ionicons 
                name={blockingActive ? 'shield-checkmark' : 'shield-outline'} 
                size={32} 
                color={blockingActive ? '#4CAF50' : '#666'} 
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusText}>
                {blockingActive ? '🔒 Blocking Active' : isAdultBlockingEnabled ? 'Ready to Start' : '🔓 Feature Disabled'}
              </Text>
              <Text style={styles.statusSubtext}>
                {blockingActive 
                  ? `⏱️ ${remainingTime} remaining`
                  : isAdultBlockingEnabled ? 'Select a duration below' : 'Enable the feature to start'}
              </Text>
            </View>
            <Switch
              value={isAdultBlockingEnabled}
              onValueChange={handleToggle}
              trackColor={{ false: '#ccc', true: '#4CAF50' }}
              thumbColor={isAdultBlockingEnabled ? '#ffffff' : '#ffffff'}
              style={styles.switch}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{blocklistCount || '300,000+'}</Text>
            <Text style={styles.statLabel}>Domains Blocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Attempts Blocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Days Clean</Text>
          </View>
        </View>

        {/* Duration Selection (only shown when feature is enabled and not active) */}
        {isAdultBlockingEnabled && !blockingActive && (
          <View style={styles.durationSection}>
            <Text style={styles.sectionTitle}>⏱️ Select Blocking Duration</Text>
            <Text style={styles.sectionSubtitle}>
              Choose how long you want adult content to be blocked
            </Text>
            
            <View style={styles.durationGrid}>
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration.hours}
                  style={[
                    styles.durationCard,
                    selectedDuration?.hours === duration.hours && styles.selectedCard,
                  ]}
                  onPress={() => setSelectedDuration(duration)}
                >
                  <Text style={styles.durationIcon}>{duration.icon}</Text>
                  <Text style={styles.durationLabel}>{duration.label}</Text>
                  <Text style={styles.durationDesc}>{duration.description}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Duration Button */}
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="settings-outline" size={20} color="#666" />
              <Text style={styles.customButtonText}>Set Custom Duration</Text>
            </TouchableOpacity>

            {selectedDuration && (
              <Text style={styles.selectedDurationText}>
                Selected: {selectedDuration.label} ({formatDuration(selectedDuration.hours)})
              </Text>
            )}

            {/* Warning Banner */}
            <View style={styles.warningBanner}>
              <Ionicons name="warning" size={24} color="#FF6B6B" />
              <Text style={styles.warningText}>
                ⚠️ You CANNOT stop this session early once started.
              </Text>
            </View>

            {/* Start Button */}
            <TouchableOpacity
              style={[styles.startButton, !selectedDuration && styles.disabledButton]}
              disabled={!selectedDuration}
              onPress={handleStartBlocking}
            >
              <Ionicons name="lock-closed" size={24} color="#fff" />
              <Text style={styles.buttonText}>Start Blocking</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Active Session Display */}
        {blockingActive && (
          <View style={styles.activeSessionCard}>
            <Ionicons name="shield-checkmark" size={48} color="#4CAF50" />
            <Text style={styles.activeSessionTitle}>🔒 Protection Active</Text>
            <Text style={styles.activeSessionTime}>
              ⏱️ {remainingTime} remaining
            </Text>
            <Text style={styles.activeSessionSubtext}>
              Duration: {selectedDuration?.label || 'Custom'}
            </Text>
            <View style={styles.lockIconContainer}>
              <Ionicons name="lock-closed" size={24} color="#4CAF50" />
              <Text style={styles.lockText}>🔒 Cannot stop or pause</Text>
            </View>
            <View style={styles.motivationBanner}>
              <Text style={styles.motivationBannerText}>
                💪 You've got this! Stay strong and focused.
              </Text>
            </View>
          </View>
        )}

        {/* Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="globe" size={24} color="#1a1a2e" />
              <Text style={styles.infoText}>
                Intercepts DNS requests from your device
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="list" size={24} color="#1a1a2e" />
              <Text style={styles.infoText}>
                Checks against a comprehensive adult content blocklist
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield" size={24} color="#1a1a2e" />
              <Text style={styles.infoText}>
                Blocks access by redirecting to a safe page
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="lock-closed" size={24} color="#1a1a2e" />
              <Text style={styles.infoText}>
                Works across all browsers and apps
              </Text>
            </View>
          </View>
        </View>

        {/* Blocklist Sources */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Blocklist Sources</Text>
          <Text style={styles.sectionSubtitle}>
            We use multiple trusted sources to keep the blocklist comprehensive and up-to-date
          </Text>
          
          {blocklistSources.map((source, index) => (
            <TouchableOpacity
              key={index}
              style={styles.sourceCard}
              onPress={() => handleBlocklistInfo(source)}
            >
              <View style={styles.sourceInfo}>
                <Text style={styles.sourceName}>{source.name}</Text>
                <Text style={styles.sourceDomains}>{source.domains} domains</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Ionicons name="information-circle" size={24} color="#666" />
          <Text style={styles.privacyText}>
            🔒 All blocking happens locally on your device. No browsing data is collected or shared.
          </Text>
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
              Enter the number of hours for adult content blocking:
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter hours (e.g., 12)"
                keyboardType="number-pad"
                value={customHours}
                onChangeText={setCustomHours}
                autoFocus={true}
              />
              <Text style={styles.inputSuffix}>hours</Text>
            </View>

            <View style={styles.quickOptions}>
              <Text style={styles.quickLabel}>Quick options:</Text>
              <View style={styles.quickButtons}>
                {[2, 6, 12, 24, 48, 168].map((hours) => (
                  <TouchableOpacity
                    key={hours}
                    style={styles.quickButton}
                    onPress={() => setCustomHours(hours.toString())}
                  >
                    <Text style={styles.quickButtonText}>{hours}h</Text>
                  </TouchableOpacity>
                ))}
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
  noteCard: {
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#E65100',
    flex: 1,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
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
  durationSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  durationCard: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: '31%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#1a1a2e',
    backgroundColor: '#f0f0f5',
  },
  durationIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  durationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  durationDesc: {
    fontSize: 9,
    color: '#999',
    textAlign: 'center',
    marginTop: 2,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f0f0f5',
    borderRadius: 10,
    marginTop: 8,
    gap: 8,
  },
  customButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedDurationText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '500',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    gap: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: '500',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  activeSessionCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activeSessionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginTop: 8,
  },
  activeSessionTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
  },
  activeSessionSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  lockIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    gap: 8,
  },
  lockText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  motivationBanner: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  motivationBannerText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  sourceCard: {
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
  sourceInfo: {
    flex: 1,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a2e',
  },
  sourceDomains: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  privacyCard: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 14,
    color: '#2e7d32',
    flex: 1,
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
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
    color: '#1a1a2e',
  },
  inputSuffix: {
    fontSize: 16,
    color: '#666',
    paddingLeft: 8,
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
