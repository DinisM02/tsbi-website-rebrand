# Cloud Functions Testing Guide

## Local Testing with Firebase Emulator Suite

### Prerequisites

```bash
npm install -g firebase-tools
firebase login
```

### Step 1: Start the Emulator Suite

```bash
# In your project root, start all emulators
firebase emulators:start --import=./emulator-export

# Output should show:
# ✓ functions emulator started at http://localhost:5001
# ✓ firestore emulator started at http://localhost:8080
# ✓ auth emulator started at http://localhost:9099
```

### Step 2: Set Environment Variable for Development

Create/update `.env.local`:

```bash
VITE_USE_EMULATOR=true
VITE_FIREBASE_PROJECT_ID=demo  # Default emulator ID
```

### Step 3: Start Development Server

```bash
# Terminal 2
pnpm dev
```

### Step 4: Test Cloud Functions from React

#### Test 1: Create Flood Alert (Responder Only)

```javascript
// In React component
import { validateAndCreateFloodAlert } from '@/api/roleValidation';

try {
  const result = await validateAndCreateFloodAlert({
    location: 'Downtown Area',
    severity: 'high',
    message: 'Flash flood warning'
  });
  console.log('✓ Alert created:', result.data);
} catch (error) {
  console.error('✗ Error:', error.code, error.message);
  // Expected error for residents: 'permission-denied'
}
```

#### Test 2: Update User Role (Admin Only)

```javascript
import { validateAndUpdateUserRole } from '@/api/roleValidation';

try {
  const result = await validateAndUpdateUserRole({
    userId: 'user-id-to-update',
    newRole: 'responder'
  });
  console.log('✓ Role updated:', result.data);
} catch (error) {
  console.error('✗ Error:', error.code, error.message);
  // Expected error for non-admins: 'permission-denied'
}
```

#### Test 3: Submit Incident Report

```javascript
import { validateAndSubmitIncidentReport } from '@/api/roleValidation';

try {
  const result = await validateAndSubmitIncidentReport({
    type: 'flood',
    location: 'Market Street',
    description: 'Significant water accumulation at intersection',
    severity: 'medium'
  });
  console.log('✓ Report submitted:', result.data);
} catch (error) {
  console.error('✗ Error:', error.code, error.message);
}
```

### Step 5: Monitor Function Execution

In browser console or terminal:

```bash
# Terminal 3: Watch function logs
firebase functions:log
```

Expected output:

```
[validateFloodAlert]: 2024-01-15 10:23:45.123 - Function called
[validateFloodAlert]: 2024-01-15 10:23:45.234 - User role: responder
[validateFloodAlert]: 2024-01-15 10:23:45.345 - Alert created: alert-id-123
```

### Step 6: Test Different User Roles

#### Setup Test Users

```javascript
// Create test users via Auth Emulator

const users = [
  { email: 'resident@test.com', password: 'test123', role: 'resident' },
  { email: 'responder@test.com', password: 'test123', role: 'responder' },
  { email: 'admin@test.com', password: 'test123', role: 'admin' }
];
```

#### Then test each user:

```javascript
// 1. Login as resident
await signInWithEmailAndPassword(auth, 'resident@test.com', 'test123');
// Try to create alert → Should fail with 'permission-denied'

// 2. Login as responder
await signInWithEmailAndPassword(auth, 'responder@test.com', 'test123');
// Try to create alert → Should succeed

// 3. Login as admin
await signInWithEmailAndPassword(auth, 'admin@test.com', 'test123');
// Try to update user role → Should succeed
```

### Step 7: Test Error Scenarios

#### Scenario 1: Unauthenticated Request

```javascript
// Logout first
await signOut(auth);

// Try to call function without auth
try {
  await validateAndCreateFloodAlert({...});
} catch (error) {
  console.log(error.code); // 'unauthenticated'
}
```

#### Scenario 2: Invalid Data

```javascript
try {
  await validateAndCreateFloodAlert({
    location: '', // Empty location
    severity: 'very_high', // Invalid severity
    message: 'Too short' // Message too short
  });
} catch (error) {
  console.log(error.code); // 'invalid-argument'
}
```

#### Scenario 3: Rate Limiting

```javascript
// Submit 6 reports in succession
for (let i = 0; i < 6; i++) {
  try {
    await validateAndSubmitIncidentReport({
      type: 'flood',
      location: `Location ${i}`,
      description: `Description for incident ${i}`
    });
    console.log(`✓ Report ${i} submitted`);
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      console.log(`✗ Rate limited at report ${i}`);
      break;
    }
  }
}
```

### Step 8: Inspect Firestore Data

Access Firestore Emulator UI:

1. Go to http://localhost:4000
2. Navigate to "Firestore" tab
3. View collections and documents created by functions
4. Verify data structure and field values

### Step 9: Export Emulator Data

```bash
# Save current emulator state
firebase emulators:export ./emulator-export
```

## Troubleshooting

### Issue: "Functions emulator not started"

**Solution:**
```bash
# Make sure functions are initialized
firebase init functions

# Check functions/package.json exists and has dependencies
cat functions/package.json

# If missing, create it
firebase deploy --only functions:validateFloodAlert --dry-run
```

### Issue: "Cannot find module 'firebase-admin'"

**Solution:**
```bash
cd functions
npm install firebase-admin firebase-functions express cors
cd ..
```

### Issue: "Cloud Functions API not enabled"

**Solution:**
```bash
# Enable in GCP Console or via CLI
gcloud services enable cloudfunctions.googleapis.com --project=your-project
```

### Issue: "Timeout waiting for emulator"

**Solution:**
```bash
# Kill and restart emulators
firebase emulators:stop
firebase emulators:start --inspect-functions
```

## Performance Testing

### Load Test: Multiple Concurrent Requests

```javascript
async function loadTest() {
  const promises = [];
  
  for (let i = 0; i < 50; i++) {
    promises.push(
      validateAndSubmitIncidentReport({
        type: 'flood',
        location: `Test Location ${i}`,
        description: `Test incident ${i}`,
      })
    );
  }

  const start = Date.now();
  const results = await Promise.allSettled(promises);
  const duration = Date.now() - start;

  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`
    Requests: 50
    Succeeded: ${succeeded}
    Failed: ${failed}
    Duration: ${duration}ms
    Average: ${(duration / 50).toFixed(2)}ms per request
  `);
}

loadTest();
```

### Response Time Benchmark

```javascript
async function benchmarkFunction() {
  const times = [];
  
  for (let i = 0; i < 10; i++) {
    const start = performance.now();
    
    try {
      await validateAndCreateFloodAlert({
        location: 'Test Location',
        severity: 'high',
        message: 'Test message for benchmark'
      });
      
      times.push(performance.now() - start);
    } catch (error) {
      console.error('Benchmark error:', error.message);
    }
  }

  const avg = times.reduce((a, b) => a + b) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`
    Response Time Benchmark:
    Average: ${avg.toFixed(2)}ms
    Min: ${min.toFixed(2)}ms
    Max: ${max.toFixed(2)}ms
  `);
}

benchmarkFunction();
```

## Security Testing

### Test 1: Verify Role Enforcement

```javascript
// Ensure residents cannot create alerts
async function testResidentRestriction() {
  await signInWithEmailAndPassword(auth, 'resident@test.com', 'test123');
  
  try {
    await validateAndCreateFloodAlert({
      location: 'Test',
      severity: 'high',
      message: 'Should fail'
    });
    console.log('✗ SECURITY ISSUE: Resident created alert!');
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.log('✓ Residents correctly restricted');
    }
  }
}

testResidentRestriction();
```

### Test 2: Verify Data Validation

```javascript
// Ensure invalid data is rejected
async function testDataValidation() {
  const testCases = [
    { location: '', severity: 'high', message: 'msg' }, // Empty location
    { location: 'x', severity: 'high', message: 'msg' }, // Too short
    { location: 'Test', severity: 'invalid', message: 'msg' }, // Invalid severity
    { location: 'Test', severity: 'high', message: 'x' } // Too short message
  ];

  for (const testCase of testCases) {
    try {
      await validateAndCreateFloodAlert(testCase);
      console.log('✗ Invalid data accepted:', testCase);
    } catch (error) {
      if (error.code === 'invalid-argument') {
        console.log('✓ Invalid data rejected:', testCase.message || testCase.location);
      }
    }
  }
}

testDataValidation();
```

## Deployment to Firebase

### Before Deploying

1. Stop emulators: `firebase emulators:stop`
2. Test with fresh state: `rm -rf emulator-export`
3. Run all test scenarios above with real functions
4. Monitor logs: `firebase functions:log --tail`

### Deploy Functions

```bash
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:validateFloodAlert

# Monitor execution
firebase functions:log --tail
```

### Post-Deployment Verification

```bash
# Test real function URL
curl https://us-central1-<PROJECT_ID>.cloudfunctions.net/validateFloodAlert \
  -H "Content-Type: application/json" \
  -d '{...}'

# Check function status
firebase functions:describe validateFloodAlert
```

## Key Metrics to Monitor

| Metric | Target | Check |
|--------|--------|-------|
| Response Time | <500ms | firebase functions:log |
| Error Rate | <1% | Errors count in logs |
| Memory Usage | <256MB | GCP Console |
| Execution Count | Matches requests | GCP Console |
| Data Size | <32MB | Firestore quotas |

## Next Steps

1. ✅ Test locally with emulator
2. 🔄 Fix any issues found
3. 🔄 Deploy to Firebase
4. 🔄 Monitor real-world usage
5. 🔄 Optimize based on metrics
