import { db, isFirebaseEnabled } from '../../firebase/config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Save user alert preferences to Firestore
export async function saveAlertPreferences(userId, preferences) {
  if (!isFirebaseEnabled || !db) {
    return;
  }

  await setDoc(doc(db, 'alertPreferences', userId), {
    ...preferences,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// Load user alert preferences from Firestore
export async function loadAlertPreferences(userId) {
  if (!isFirebaseEnabled || !db) {
    return { sms: false, email: true, push: true, voice: false };
  }

  const snap = await getDoc(doc(db, 'alertPreferences', userId));
  if (snap.exists()) {
    const data = snap.data();
    return {
      sms: data.sms ?? false,
      email: data.email ?? true,
      push: data.push ?? true,
      voice: data.voice ?? false,
    };
  }
  return { sms: false, email: true, push: true, voice: false };
}

// Request browser push notification permission and send test notification
export async function sendTestNotification(weatherData, floodData) {
  if (!('Notification' in window)) {
    return { ok: false, type: 'error', message: 'Your browser does not support notifications.' };
  }

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') {
    return { ok: false, type: 'error', message: 'Notification permission denied. Please enable it in your browser settings.' };
  }

  const riverLevel = floodData?.daily?.river_discharge_mean?.[0] ?? 0;
  const temp = weatherData?.main?.temp ? Math.round(weatherData.main.temp) : 'N/A';

  new Notification('HydroBeacon Flood Alert — Test', {
    body: `Current conditions: ${temp}°C, River: ${riverLevel.toFixed(1)} m³/s. This is a test notification.`,
    icon: '/hydrobeacon-icon-192.png',
    tag: 'hydrobeacon-test-alert',
  });

  return { ok: true, type: 'success', message: 'Test notification sent successfully.' };
}
