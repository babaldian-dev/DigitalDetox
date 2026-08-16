import { Platform, Alert } from 'react-native';
import { useAppStore } from '../store/appStore';
import { useRecoveryStore } from '../store/recoveryStore';

// Notifications are disabled in Expo Go
// They will work in standalone builds and development builds

export async function scheduleNotification(
  title: string,
  body: string,
  seconds: number = 0,
  identifier?: string
) {
  console.log('Notification would be scheduled:', { title, body });
  return null;
}

export async function scheduleDailyReminder() {
  console.log('Daily reminder would be scheduled');
  return true;
}

export async function scheduleEveningReminder() {
  console.log('Evening reminder would be scheduled');
  return true;
}

export async function scheduleStreakReminder(streak: number) {
  console.log('Streak reminder would be scheduled');
  return true;
}

export async function scheduleBlockingCompletion(blockedApps: number, duration: string) {
  console.log('Blocking completion notification would be scheduled');
  return true;
}

export async function cancelAllNotifications() {
  console.log('All notifications would be canceled');
  return true;
}

export async function cancelNotification(identifier: string) {
  console.log('Notification would be canceled:', identifier);
  return true;
}

export async function requestNotificationPermissions() {
  console.log('Notification permissions would be requested');
  return true;
}
