/**
 * HydroBeacon Role-Based API Validation Layer
 * 
 * This file demonstrates how to validate role-based operations.
 * In production, deploy these as Firebase Cloud Functions.
 * 
 * Installation:
 * firebase deploy --only functions
 * 
 * To use in your React app:
 * import { roleValidationAPI } from '@/api/roleValidation'
 * 
 * Reference: https://firebase.google.com/docs/functions
 */

import { auth, db, functions, isFirebaseEnabled } from '@/firebase/config';
import { httpsCallable } from 'firebase/functions';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

/**
 * CLOUD FUNCTION 1: Validate Flood Alert Creation
 * 
 * exports.validateFloodAlert = functions.https.onCall(async (data, context) => {
 *   // Ensure user is authenticated
 *   if (!context.auth) {
 *     throw new functions.https.HttpsError('unauthenticated', 'User not authenticated');
 *   }
 * 
 *   // Get user role from Firestore
 *   const userDoc = await admin.firestore()
 *     .collection('users')
 *     .doc(context.auth.uid)
 *     .get();
 *   
 *   const userRole = userDoc.data()?.role;
 * 
 *   // Check if user is responder or admin
 *   if (userRole !== 'responder' && userRole !== 'admin') {
 *     throw new functions.https.HttpsError(
 *       'permission-denied',
 *       'Only responders and admins can create flood alerts'
 *     );
 *   }
 * 
 *   // Validate flood alert data
 *   const { location, severity, message } = data;
 *   if (!location || !severity || !message) {
 *     throw new functions.https.HttpsError(
 *       'invalid-argument',
 *       'Missing required fields: location, severity, message'
 *     );
 *   }
 * 
 *   if (!['low', 'medium', 'high', 'critical'].includes(severity)) {
 *     throw new functions.https.HttpsError(
 *       'invalid-argument',
 *       'Invalid severity level'
 *     );
 *   }
 * 
 *   // Create flood alert in Firestore
 *   const alertRef = admin.firestore().collection('floodAlerts').doc();
 *   await alertRef.set({
 *     location,
 *     severity,
 *     message,
 *     createdBy: context.auth.uid,
 *     timestamp: admin.firestore.FieldValue.serverTimestamp(),
 *     status: 'active'
 *   });
 * 
 *   return {
 *     success: true,
 *     alertId: alertRef.id,
 *     message: 'Flood alert created successfully'
 *   };
 * });
 */

/**
 * CLOUD FUNCTION 2: Validate User Role Update
 * 
 * exports.updateUserRole = functions.https.onCall(async (data, context) => {
 *   if (!context.auth) {
 *     throw new functions.https.HttpsError('unauthenticated', 'User not authenticated');
 *   }
 * 
 *   // Only admins can update user roles
 *   const adminDoc = await admin.firestore()
 *     .collection('users')
 *     .doc(context.auth.uid)
 *     .get();
 * 
 *   if (adminDoc.data()?.role !== 'admin') {
 *     throw new functions.https.HttpsError(
 *       'permission-denied',
 *       'Only admins can update user roles'
 *     );
 *   }
 * 
 *   const { userId, newRole } = data;
 *   if (!['resident', 'responder', 'admin'].includes(newRole)) {
 *     throw new functions.https.HttpsError(
 *       'invalid-argument',
 *       'Invalid role value'
 *     );
 *   }
 * 
 *   // Update user role
 *   await admin.firestore()
 *     .collection('users')
 *     .doc(userId)
 *     .update({
 *       role: newRole,
 *       roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
 *       roleUpdatedBy: context.auth.uid
 *     });
 * 
 *   return {
 *     success: true,
 *     message: `User role updated to ${newRole}`
 *   };
 * });
 */

/**
 * CLOUD FUNCTION 3: Validate Incident Report Creation
 * 
 * exports.submitIncidentReport = functions.https.onCall(async (data, context) => {
 *   if (!context.auth) {
 *     throw new functions.https.HttpsError('unauthenticated', 'User not authenticated');
 *   }
 * 
 *   const { type, location, description, severity } = data;
 * 
 *   // Validate required fields
 *   const requiredFields = ['type', 'location', 'description'];
 *   for (const field of requiredFields) {
 *     if (!data[field]) {
 *       throw new functions.https.HttpsError(
 *         'invalid-argument',
 *         `Missing required field: ${field}`
 *       );
 *     }
 *   }
 * 
 *   // Optional: Rate limit - check if user reported too many incidents recently
 *   const recentReports = await admin.firestore()
 *     .collection('incidentReports')
 *     .where('reportedByUid', '==', context.auth.uid)
 *     .where('timestamp', '>', Date.now() - 3600000) // Last hour
 *     .get();
 * 
 *   if (recentReports.size > 5) {
 *     throw new functions.https.HttpsError(
 *       'resource-exhausted',
 *       'Too many reports submitted recently. Please wait before submitting another.'
 *     );
 *   }
 * 
 *   // Create incident report
 *   const reportRef = admin.firestore().collection('incidentReports').doc();
 *   await reportRef.set({
 *     type,
 *     location,
 *     description,
 *     severity: severity || 'medium',
 *     status: 'reported',
 *     reportedByUid: context.auth.uid,
 *     timestamp: admin.firestore.FieldValue.serverTimestamp()
 *   });
 * 
 *   // Notify responders (push notification)
 *   // In production, use Firebase Cloud Messaging
 * 
 *   return {
 *     success: true,
 *     reportId: reportRef.id,
 *     message: 'Incident reported. Responders are being notified.'
 *   };
 * });
 */

/**
 * CLIENT-SIDE FUNCTION: Call validateFloodAlert Cloud Function
 */
const callableCreateFloodAlert =
  isFirebaseEnabled && functions
    ? httpsCallable(functions, 'validateFloodAlert')
    : null;
const callableUpdateUserRole =
  isFirebaseEnabled && functions
    ? httpsCallable(functions, 'updateUserRole')
    : null;
const callableSubmitIncidentReport =
  isFirebaseEnabled && functions
    ? httpsCallable(functions, 'submitIncidentReport')
    : null;

const shouldUseFirestoreFallback = (error) => {
  const fallbackCodes = [
    'functions/unavailable',
    'functions/not-found',
    'functions/internal',
    'functions/failed-precondition',
  ];

  return fallbackCodes.includes(error?.code);
};

const ensureAuthenticated = () => {
  if (!auth.currentUser) {
    const authError = new Error('User must be authenticated');
    authError.code = 'auth/unauthenticated';
    throw authError;
  }
};

const ensureFirestoreFallbackAvailable = () => {
  if (!isFirebaseEnabled || !db) {
    const err = new Error('Firestore is not configured in this deployment');
    err.code = 'firestore/not-configured';
    throw err;
  }
};

export const validateAndCreateFloodAlert = async (payload) => {
  try {
    if (callableCreateFloodAlert) {
      return await callableCreateFloodAlert(payload);
    }
    throw { code: 'functions/unavailable' };
  } catch (error) {
    if (!shouldUseFirestoreFallback(error)) {
      throw error;
    }

    ensureFirestoreFallbackAvailable();
    ensureAuthenticated();

    const { location, severity, message } = payload;
    const docRef = await addDoc(collection(db, 'floodAlerts'), {
      location,
      severity,
      message,
      createdBy: auth.currentUser.uid,
      createdByRole: 'unknown',
      status: 'active',
      timestamp: serverTimestamp(),
      views: 0,
    });

    return {
      data: {
        success: true,
        alertId: docRef.id,
        fallback: true,
      },
    };
  }
};

/**
 * CLIENT-SIDE FUNCTION: Call updateUserRole Cloud Function
 */
export const validateAndUpdateUserRole = async (payload) => {
  try {
    if (callableUpdateUserRole) {
      return await callableUpdateUserRole(payload);
    }
    throw { code: 'functions/unavailable' };
  } catch (error) {
    if (!shouldUseFirestoreFallback(error)) {
      throw error;
    }

    ensureFirestoreFallbackAvailable();
    ensureAuthenticated();

    const { userId, newRole } = payload;
    await updateDoc(doc(db, 'users', userId), {
      role: newRole,
      roleUpdatedAt: serverTimestamp(),
      roleUpdatedBy: auth.currentUser.uid,
    });

    return {
      data: {
        success: true,
        message: `User role updated to ${newRole}`,
        fallback: true,
      },
    };
  }
};

/**
 * CLIENT-SIDE FUNCTION: Call submitIncidentReport Cloud Function
 */
export const validateAndSubmitIncidentReport = async (payload) => {
  try {
    if (callableSubmitIncidentReport) {
      return await callableSubmitIncidentReport(payload);
    }
    throw { code: 'functions/unavailable' };
  } catch (error) {
    if (!shouldUseFirestoreFallback(error)) {
      throw error;
    }

    ensureFirestoreFallbackAvailable();
    ensureAuthenticated();

    const { type, location, description, severity = 'medium' } = payload;
    const reportRef = await addDoc(collection(db, 'incidentReports'), {
      type,
      location,
      description,
      severity,
      status: 'reported',
      reportedByUid: auth.currentUser.uid,
      timestamp: serverTimestamp(),
      views: 0,
    });

    return {
      data: {
        success: true,
        reportId: reportRef.id,
        fallback: true,
      },
    };
  }
};

/**
 * USAGE EXAMPLE IN REACT COMPONENT:
 * 
 * import { validateAndCreateFloodAlert } from '@/api/roleValidation'
 * 
 * const handleCreateAlert = async () => {
 *   try {
 *     const result = await validateAndCreateFloodAlert({
 *       location: 'Downtown Area',
 *       severity: 'high',
 *       message: 'Flash flood warning issued'
 *     });
 *     console.log('Alert created:', result.data);
 *   } catch (error) {
 *     console.error('Error:', error.message);
 *     // error.code contains:
 *     // - 'permission-denied': User lacks required role
 *     // - 'invalid-argument': Data validation failed
 *     // - 'unauthenticated': User not logged in
 *   }
 * }
 */

/**
 * ALTERNATIVE: Client-Side Role Validation Helper
 * 
 * For less sensitive operations, you can validate roles on client:
 */

import { useAuth } from '@/contexts/AuthContext';

export const useRoleValidation = () => {
  const { userProfile } = useAuth();

  return {
    // Check if user can create flood alerts
    canCreateFloodAlert: () => 
      ['responder', 'admin'].includes(userProfile?.role),

    // Check if user can manage shelters
    canManageShelters: () =>
      ['responder', 'admin'].includes(userProfile?.role),

    // Check if user can manage teams
    canManageTeams: () =>
      ['responder', 'admin'].includes(userProfile?.role),

    // Check if user can write blog posts
    canWriteBlogPosts: () =>
      userProfile?.role === 'admin',

    // Check if user can manage users
    canManageUsers: () =>
      userProfile?.role === 'admin',

    // Check if user can report incidents
    canReportIncident: () =>
      userProfile != null,

    // Check if user can view all incidents
    canViewAllIncidents: () =>
      ['responder', 'admin'].includes(userProfile?.role)
  };
};

/**
 * DEPLOYMENT INSTRUCTIONS
 * 
 * 1. Create Firebase Functions project (if not done):
 *    firebase init functions
 * 
 * 2. Copy cloud functions to functions/index.js
 * 
 * 3. Deploy functions:
 *    firebase deploy --only functions
 * 
 * 4. Test with Rules Playground or React component
 * 
 * 5. Monitor function execution:
 *    firebase functions:log
 * 
 * ENVIRONMENT VARIABLES
 * 
 * Set in firebase.json:
 * {
 *   "functions": {
 *     "RATE_LIMIT_REPORTS": "5",
 *     "RATE_LIMIT_WINDOW": "3600000"
 *   }
 * }
 */
