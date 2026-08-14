import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { useAppStore } from '../store/appStore';
import { useRecoveryStore } from '../store/recoveryStore';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Schedule a notification
export async function scheduleNotification(
  title: string,
  body: string,
  seconds: number = 0,
  identifier?: string
) {
  try {
    const trigger = seconds > 0 
      ? { seconds: seconds }
      : null;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

// Schedule daily reminder
export async function scheduleDailyReminder() {
  const trigger = new Date();
  trigger.setHours(9, 0, 0, 0); // 9:00 AM
  
  if (trigger < new Date()) {
    trigger.setDate(trigger.getDate() + 1);
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Good Morning!',
        body: 'Time for your daily check-in. How are you feeling today?',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'daily-checkin' },
      },
      trigger,
      identifier: 'daily-reminder',
    });
    return true;
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
    return false;
  }
}

// Schedule evening reminder
export async function scheduleEveningReminder() {
  const trigger = new Date();
  trigger.setHours(21, 0, 0, 0); // 9:00 PM
  
  if (trigger < new Date()) {
    trigger.setDate(trigger.getDate() + 1);
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Evening Check-in',
        body: 'How did today go? Reflect on your progress.',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'evening-checkin' },
      },
      trigger,
      identifier: 'evening-reminder',
    });
    return true;
  } catch (error) {
    console.error('Error scheduling evening reminder:', error);
    return false;
  }
}

// Schedule streak reminder
export async function scheduleStreakReminder(streak: number) {
  if (streak === 0) return;

  const messages = [
    `🔥 You're on a ${streak}-day streak! Keep going!`,
    `💪 ${streak} days strong! You're doing amazing!`,
    `🌟 ${streak} days of progress! Stay focused!`,
    `🏆 ${streak} days and counting! You've got this!`,
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Streak Alert!',
        body: message,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'streak-reminder' },
      },
      trigger: { seconds: 3600 }, // 1 hour
      identifier: 'streak-reminder',
    });
    return true;
  } catch (error) {
    console.error('Error scheduling streak reminder:', error);
    return false;
  }
}

// Schedule blocking completion reminder
export async function scheduleBlockingCompletion(blockedApps: number, duration: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Blocking Complete!',
        body: `You successfully stayed focused for ${duration}! ${blockedApps} app(s) were blocked. Great job! 🎉`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'blocking-complete' },
      },
      trigger: { seconds: 5 },
      identifier: 'blocking-complete',
    });
    return true;
  } catch (error) {
    console.error('Error scheduling blocking completion:', error);
    return false;
  }
}

// Cancel all notifications
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch (error) {
    console.error('Error canceling notifications:', error);
    return false;
  }
}

// Cancel specific notification
export async function cancelNotification(identifier: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    return true;
  } catch (error) {
    console.error('Error canceling notification:', error);
    return false;
  }
}

// Request permissions
export async function requestNotificationPermissions() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Notifications Disabled',
        'Please enable notifications in your device settings to receive reminders and motivation alerts.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}
