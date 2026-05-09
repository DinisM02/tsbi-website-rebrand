import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions, isFirebaseEnabled } from "./config";

const assertFirebaseEnabled = () => {
  if (!isFirebaseEnabled || !auth || !db) {
    const err = new Error("Firebase is not configured in this deployment");
    err.code = "firebase/not-configured";
    throw err;
  }
};

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const getRoleForEmail = (email) =>
  email && adminEmails.includes(email.toLowerCase()) ? "admin" : "user";

const buildProfile = (firebaseUser, role) => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email || "",
  displayName: firebaseUser.displayName || "",
  role,
});

export const registerUser = async (
  email,
  password,
  displayName,
  userRole = "user",
  extraProfile = {}
) => {
  assertFirebaseEnabled();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  try {
    const role =
      userRole === "responder" || userRole === "resident" || userRole === "helper"
        ? userRole
        : getRoleForEmail(email);

    const helperProfile =
      role === "helper"
        ? {
            organization: extraProfile.organization || "",
            skills: Array.isArray(extraProfile.skills) ? extraProfile.skills : [],
            availability: Array.isArray(extraProfile.availability) ? extraProfile.availability : [],
            verificationStatus: "pending",
            helperOnboardingCompleted: false,
          }
        : {};

    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      displayName,
      role,
      ...helperProfile,
      createdAt: serverTimestamp(),
    });
  } catch (firestoreErr) {
    console.warn("User created in Auth but Firestore profile write failed:", firestoreErr.message);
  }
  return userCredential.user;
};

export const loginUser = async (email, password) => {
  assertFirebaseEnabled();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  assertFirebaseEnabled();
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  await ensureUserProfile(userCredential.user);
  return userCredential.user;
};

export const logoutUser = async () => {
  if (!isFirebaseEnabled || !auth) {
    return;
  }
  await signOut(auth);
};

export const resetPassword = async (email) => {
  assertFirebaseEnabled();
  await sendPasswordResetEmail(auth, email);
};

export const requestPasswordResetOtp = async (email) => {
  assertFirebaseEnabled();
  if (!functions) {
    const err = new Error("Cloud Functions not configured");
    err.code = "functions/not-configured";
    throw err;
  }

  const callable = httpsCallable(functions, "requestPasswordResetOtp");
  const result = await callable({ email });
  return result.data;
};

export const resetPasswordWithOtp = async (email, otp, newPassword) => {
  assertFirebaseEnabled();
  if (!functions) {
    const err = new Error("Cloud Functions not configured");
    err.code = "functions/not-configured";
    throw err;
  }

  const callable = httpsCallable(functions, "resetPasswordWithOtp");
  const result = await callable({ email, otp, newPassword });
  return result.data;
};

export const getUserProfile = async (uid) => {
  if (!isFirebaseEnabled || !db) {
    return null;
  }
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

export const onAuthChange = (callback) => {
  if (!isFirebaseEnabled || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const ensureUserProfile = async (firebaseUser) => {
  if (!isFirebaseEnabled || !db) {
    return buildProfile(firebaseUser, getRoleForEmail(firebaseUser.email));
  }

  const docRef = doc(db, "users", firebaseUser.uid);
  const docSnap = await getDoc(docRef);
  const desiredRole = getRoleForEmail(firebaseUser.email);

  if (!docSnap.exists()) {
    const profile = buildProfile(firebaseUser, desiredRole);
    await setDoc(docRef, {
      ...profile,
      createdAt: serverTimestamp(),
    });
    return profile;
  }

  const currentProfile = docSnap.data();
  const updates = {};

  if (!currentProfile.email && firebaseUser.email) {
    updates.email = firebaseUser.email;
  }

  if (!currentProfile.displayName && firebaseUser.displayName) {
    updates.displayName = firebaseUser.displayName;
  }

  if (desiredRole === "admin" && currentProfile.role !== "admin") {
    updates.role = "admin";
  }

  if (Object.keys(updates).length > 0) {
    await setDoc(
      docRef,
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return {
    ...buildProfile(firebaseUser, desiredRole),
    ...currentProfile,
    ...updates,
  };
};

export const completeHelperOnboarding = async (uid) => {
  if (!uid || !isFirebaseEnabled || !db) {
    return;
  }

  await setDoc(
    doc(db, "users", uid),
    {
      helperOnboardingCompleted: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
