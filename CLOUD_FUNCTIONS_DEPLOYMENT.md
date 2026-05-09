# Firebase Cloud Functions Deployment Guide

## Overview

This guide covers deploying the TSBI role-based validation functions to Firebase Cloud Functions.

## Prerequisites

- Firebase project initialized: `firebase init functions`
- Cloud Functions API enabled in Firebase Console
- `firebase-cli` installed: `npm install -g firebase-tools`
- Authenticated: `firebase login`

## Step 1: Initialize Cloud Functions (If Not Done)

```bash
firebase init functions

# Select options:
# - Choose your Firebase project
# - Runtime: Node.js 20 (LTS)
# - Language: JavaScript
# - Install dependencies: Yes
```

This creates a `functions/` directory with:
- `functions/package.json` - Dependencies
- `functions/index.js` - Main function file

## Step 2: Install Required Dependencies

```bash
cd functions

npm install \
  firebase-admin \
  firebase-functions \
  express \
  cors

npm install --save-dev firebase-functions-test
```

Or with pnpm (if using pnpm in repo):

```bash
cd functions
pnpm add firebase-admin firebase-functions express cors
pnpm add -D firebase-functions-test
```

## Step 3: Add Cloud Functions Code

Copy the following template code to `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

// ============================================================
// FUNCTION 1: validateFloodAlert
// ============================================================

exports.validateFloodAlert = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const userDoc = await admin
    .firestore()
    .collection('users')
    .doc(context.auth.uid)
    .get();

  const userRole = userDoc.data()?.role;

  if (!['responder', 'admin'].includes(userRole)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only responders can create alerts'
    );
  }

  const { location, severity, message } = data;
  
  if (!location || !severity || !message) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields'
    );
  }

  const alertRef = admin.firestore().collection('floodAlerts').doc();
  await alertRef.set({
    location,
    severity,
    message,
    createdBy: context.auth.uid,
    createdByRole: userRole,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    status: 'active',
  });

  return { success: true, alertId: alertRef.id };
});

// ============================================================
// FUNCTION 2: updateUserRole
// ============================================================

exports.updateUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Auth required');
  }

  const adminDoc = await admin
    .firestore()
    .collection('users')
    .doc(context.auth.uid)
    .get();

  if (adminDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Admin only'
    );
  }

  const { userId, newRole } = data;

  if (!['resident', 'responder', 'admin'].includes(newRole)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid role');
  }

  await admin
    .firestore()
    .collection('users')
    .doc(userId)
    .update({
      role: newRole,
      roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      roleUpdatedBy: context.auth.uid,
    });

  return { success: true, message: `Role updated to ${newRole}` };
});

// ============================================================
// FUNCTION 3: submitIncidentReport
// ============================================================

exports.submitIncidentReport = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Auth required'
      );
    }

    const { type, location, description, severity } = data;

    if (!type || !location || !description) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing fields'
      );
    }

    // Rate limiting
    const oneHourAgo = Date.now() - 3600000;
    const recentReports = await admin
      .firestore()
      .collection('incidentReports')
      .where('reportedByUid', '==', context.auth.uid)
      .where('timestamp', '>', new Date(oneHourAgo))
      .get();

    if (recentReports.size > 5) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Too many reports. Wait before submitting another.'
      );
    }

    const reportRef = admin.firestore().collection('incidentReports').doc();
    await reportRef.set({
      type,
      location,
      description,
      severity: severity || 'medium',
      status: 'reported',
      reportedByUid: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, reportId: reportRef.id };
  }
);

// ============================================================
// SCHEDULED FUNCTION: Cleanup Expired Alerts Daily
// ============================================================

exports.cleanupExpiredAlerts = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const expiredAlerts = await admin
      .firestore()
      .collection('floodAlerts')
      .where('timestamp', '<', new Date(thirtyDaysAgo))
      .where('status', '==', 'active')
      .get();

    let archivedCount = 0;
    expiredAlerts.forEach(async (doc) => {
      await doc.ref.update({ status: 'archived' });
      archivedCount++;
    });

    console.log(`Archived ${archivedCount} expired alerts`);
  });

// ============================================================
// HEALTH CHECK ENDPOINT
// ============================================================

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

exports.api = functions.https.onRequest(app);
```

## Step 4: Update functions/.gitignore

```bash
# Existing entries
node_modules/
.env
.env.local
*.log
```

## Step 5: Test Functions Locally

```bash
# Terminal 1: Start emulator suite
firebase emulators:start --only functions,firestore,auth

# Terminal 2: In another terminal, run tests
npm run test
```

Test endpoints:
- Health check: `http://localhost:5001/<PROJECT_ID>/us-central1/api/health`

## Step 6: Deploy to Firebase

```bash
# Deploy only functions
firebase deploy --only functions

# Deploy functions + database rules
firebase deploy

# Deploy specific function
firebase deploy --only functions:validateFloodAlert
```

Expected output:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/<PROJECT_ID>

Function URLs:
  validateFloodAlert: https://us-central1-<PROJECT_ID>.cloudfunctions.net/validateFloodAlert
  updateUserRole: https://us-central1-<PROJECT_ID>.cloudfunctions.net/updateUserRole
  submitIncidentReport: https://us-central1-<PROJECT_ID>.cloudfunctions.net/submitIncidentReport
  api: https://us-central1-<PROJECT_ID>.cloudfunctions.net/api
```

## Step 7: Monitor Function Execution

```bash
# View function logs (real-time)
firebase functions:log

# View specific function logs
firebase functions:log --function=validateFloodAlert

# Export logs to file
firebase functions:log > functions.log 2>&1
```

## Step 8: Using Functions from React Client

Update `src/api/roleValidation.js` with your deployed function URLs:

```javascript
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase/config';

// Create flood alert
export const createFloodAlert = async (alertData) => {
  try {
    const validateFloodAlert = httpsCallable(functions, 'validateFloodAlert');
    const response = await validateFloodAlert(alertData);
    return response.data;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId, newRole) => {
  try {
    const updateRole = httpsCallable(functions, 'updateUserRole');
    const response = await updateRole({ userId, newRole });
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

// Submit incident report
export const submitIncidentReport = async (reportData) => {
  try {
    const submitReport = httpsCallable(functions, 'submitIncidentReport');
    const response = await submitReport(reportData);
    return response.data;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
};
```

## Step 9: Ensure Firestore Rules Allow Function Access

Add this to `firestore.rules`:

```firestore
// Cloud Functions access (service account)
match /{document=**} {
  allow read, write: if request.auth != null && 
    request.auth.token.iss.contains('firebaseserviceaccount');
}
```

## Troubleshooting

### Issue: "Missing required Cloud Functions API"

**Solution:**
```bash
gcloud services enable cloudfunctions.googleapis.com --project=<PROJECT_ID>
gcloud services enable cloudbuild.googleapis.com --project=<PROJECT_ID>
```

### Issue: "Cannot READ functions/node_modules"

**Solution:**
```bash
# Add to functions/.gitignore
node_modules/

# Reinstall
cd functions && npm install --no-save
```

### Issue: "Unauthorized: Error: 403 Caller does not have permission"

**Solution:** Ensure your Firebase Auth user has Editor/Owner role in GCP project console.

### Issue: Function timeout

**Solution:** Increase timeout in `firebase.json`:

```json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs20",
    "timeoutSeconds": 60,
    "memory": "256MB"
  }
}
```

## Scaling Recommendations

| Metric | Limit | Notes |
|--------|-------|-------|
| Min instances | 1 | Prevents cold starts |
| Max instances | 100 | Default, adjust per needs |
| Memory | 256MB | Sufficient for validation |
| Timeout | 60s | Increase if needed |
| Concurrent executions | Unlimited | Scales automatically |

To configure:

```bash
gcloud functions deploy validateFloodAlert \
  --min-instances=1 \
  --max-instances=100 \
  --memory=256MB \
  --timeout=60s
```

## Security Best Practices

1. **Always validate authentication**: `if (!context.auth) throw ...`
2. **Always check user role**: Get from Firestore after auth
3. **Validate input size**: String lengths, array sizes
4. **Rate limiting**: Check recent submissions
5. **Audit logging**: Log all privileged operations
6. **Error handling**: Don't leak internal details

## Cost Estimate

- **First 2M invocations/month**: FREE
- **Beyond 2M**: $0.40 per invocation
- **Compute time**: $0.0000025 per GB-second (256MB = ~$0.000000625/s)

Example: 1M monthly invocations at 1s each = ~$0.47

## Next Steps

1. ✅ Create Cloud Functions code
2. ✅ Test locally with emulator
3. 🔄 **Deploy to Firebase**
4. 🔄 Monitor execution
5. 🔄 Optimize performance
6. 🔄 Set up alerts

## Additional Resources

- [Firebase Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Cloud Functions Pricing](https://firebase.google.com/pricing)
- [Callable Functions Best Practices](https://firebase.google.com/docs/functions/callable)
- [Security Rules Examples](https://firebase.google.com/docs/firestore/security/start)
