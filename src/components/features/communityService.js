import { db, isFirebaseEnabled } from '../../firebase/config';
import {
  doc, setDoc, deleteDoc, collection,
  onSnapshot, serverTimestamp
} from 'firebase/firestore';

// Join the community network (write user doc to community collection)
export async function joinCommunity(userId, userData) {
  if (!isFirebaseEnabled || !db) {
    return;
  }
  await setDoc(doc(db, 'community', userId), {
    displayName: userData.displayName || 'Anonymous',
    role: userData.role || 'neighbor',
    joinedAt: serverTimestamp(),
    location: userData.location || null,
  });
}

// Leave the community network
export async function leaveCommunity(userId) {
  if (!isFirebaseEnabled || !db) {
    return;
  }
  await deleteDoc(doc(db, 'community', userId));
}

// Get real-time community member count
export function subscribeToCommunityCount(callback) {
  if (!isFirebaseEnabled || !db) {
    callback({ responders: 0, neighbors: 0, total: 0 });
    return () => {};
  }

  return onSnapshot(collection(db, 'community'), (snapshot) => {
    let responders = 0;
    let neighbors = 0;
    snapshot.forEach((doc) => {
      const d = doc.data();
      if (d.role === 'responder') responders++;
      else neighbors++;
    });
    callback({ responders, neighbors, total: snapshot.size });
  });
}
