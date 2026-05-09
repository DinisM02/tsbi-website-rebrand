# TSBI Cloud Functions Implementation Checklist

## Phase 1: Local Development Setup ✅

- [x] Review Cloud Functions requirements
- [x] Update Firebase config with Functions integration
- [x] Create Cloud Functions template file
- [x] Create deployment guide
- [x] Create testing guide
- [ ] Test config imports locally
- [ ] Verify emulator connectivity

## Phase 2: Initialize Cloud Functions

- [ ] Run: `firebase init functions`
  - [ ] Select your Firebase project
  - [ ] Choose Node.js runtime
  - [ ] Choose JavaScript
  - [ ] Install dependencies

- [ ] Verify `functions/` directory created with:
  - [ ] `package.json` ✓
  - [ ] `.eslintrc.js` ✓
  - [ ] `index.js` ✓

- [ ] Update `functions/.gitignore`:
  ```
  node_modules/
  .env
  .env.local
  *.log
  ```

## Phase 3: Install Dependencies

```bash
cd functions
npm install firebase-admin firebase-functions express cors
npm install --save-dev firebase-functions-test
cd ..
```

- [ ] Verify `firebase-admin` installed
- [ ] Verify `firebase-functions` installed
- [ ] Verify `express` installed
- [ ] Verify `cors` installed

## Phase 4: Add Cloud Functions Code

- [ ] Copy code from `functions/index.js.template` to `functions/index.js`
- [ ] Replace placeholder ProjectID with actual project ID
- [ ] Update region if not `us-central1`
- [ ] Review error handling
- [ ] Review rate limiting logic
- [ ] Test syntax: `node functions/index.js` (should not error)

## Phase 5: Local Testing

### Setup

- [ ] Start emulator suite:
  ```bash
  firebase emulators:start
  ```

- [ ] Set environment variable:
  ```bash
  VITE_USE_EMULATOR=true
  ```

- [ ] Start dev server:
  ```bash
  pnpm dev
  ```

### Tests for validateFloodAlert

- [ ] Test as unauthenticated user → Should get 'unauthenticated' error
- [ ] Test as resident user → Should get 'permission-denied' error
- [ ] Test as responder with valid data → Should succeed
- [ ] Test as responder with empty location → Should get 'invalid-argument'
- [ ] Test as responder with invalid severity → Should get 'invalid-argument'
- [ ] Test as responder with too-short message → Should get 'invalid-argument'

### Tests for updateUserRole

- [ ] Test as non-admin user → Should get 'permission-denied'
- [ ] Test as admin with invalid role → Should get 'invalid-argument'
- [ ] Test as admin with valid user and new role → Should succeed
- [ ] Verify user role updated in Firestore
- [ ] Test preventing admin from removing own status → Should fail

### Tests for submitIncidentReport

- [ ] Test as unauthenticated user → Should fail
- [ ] Test as any authenticated user → Should succeed
- [ ] Submit 6 reports in quick succession → 6th should get 'resource-exhausted'
- [ ] Verify rate limit resets after 1 hour
- [ ] Verify incident data saved to Firestore

### Firestore Verification

- [ ] Open Firestore Emulator UI: http://localhost:4000
- [ ] Navigate to Firestore tab
- [ ] Verify collections created:
  - [ ] `floodAlerts` collection exists
  - [ ] `incidentReports` collection exists
  - [ ] `users` collection exists
  - [ ] `auditLogs` collection exists
- [ ] Verify document structure matches schema
- [ ] Verify timestamps are server-generated
- [ ] Verify status fields are correct

## Phase 6: Update Client Code

- [ ] Verify `src/firebase/config.js` has Functions initialized
- [ ] Verify `VITE_USE_EMULATOR` environment handling
- [ ] Review `src/api/roleValidation.js` function calls
- [ ] Add error handling for CloudFunctionsError
- [ ] Test import paths resolve correctly

### Client Components Using Functions

- [ ] Create flood alert component
- [ ] Create incident report component
- [ ] Create user role management component
- [ ] Add error display for function errors
- [ ] Add loading states for async operations
- [ ] Add success notifications

## Phase 7: Firestore Security Rules Update

- [ ] Add rule allowing Cloud Functions service account:
  ```firestore
  // Allow Cloud Functions to read/write
  match /{document=**} {
    allow read, write: if request.auth.token.iss.contains('firebaseserviceaccount');
  }
  ```

- [ ] Deploy rules:
  ```bash
  firebase deploy --only firestore:rules
  ```

- [ ] Verify rules deployed successfully

## Phase 8: Pre-Deployment Testing

- [ ] Run full test suite locally
- [ ] Load test with multiple concurrent requests
- [ ] Benchmark response times
- [ ] Verify error messages are user-friendly
- [ ] Check audit logs are being created
- [ ] Verify no sensitive data in logs
- [ ] Test with different user roles
- [ ] Test error scenarios comprehensively

## Phase 9: Production Deployment

### Pre-Deployment Checklist

- [ ] Stop emulators: `firebase emulators:stop`
- [ ] Clean environment: Verify no sensitive data in code
- [ ] Final code review complete
- [ ] All tests passing locally
- [ ] Backup current Firestore data (if production)

### Deploy

- [ ] Deploy functions:
  ```bash
  firebase deploy --only functions
  ```

- [ ] Wait for deployment to complete
- [ ] Monitor logs for errors:
  ```bash
  firebase functions:log --tail
  ```

- [ ] Verify all functions deployed:
  ```bash
  firebase functions:list
  ```

- [ ] Expected output should show:
  - [ ] `validateFloodAlert` ✓
  - [ ] `updateUserRole` ✓
  - [ ] `submitIncidentReport` ✓
  - [ ] `cleanupExpiredAlerts` ✓
  - [ ] `api` ✓

### Post-Deployment

- [ ] Update `.env.production` with real function URLs
- [ ] Disable `VITE_USE_EMULATOR` in production
- [ ] Test real functions from deployed app
- [ ] Monitor error rates in GCP Console
- [ ] Check Cloud Functions logs
- [ ] Verify Firestore data is being written
- [ ] Test with real user authentication
- [ ] Monitor performance metrics

## Phase 10: Performance & Scaling

### Optimization

- [ ] Review cold start times
- [ ] Consider min instances if needed:
  ```bash
  gcloud functions deploy validateFloodAlert \
    --min-instances=1
  ```

- [ ] Set memory if needed:
  ```bash
  gcloud functions deploy validateFloodAlert \
    --memory=256MB
  ```

- [ ] Set timeout if needed:
  ```bash
  gcloud functions deploy validateFloodAlert \
    --timeout=60s
  ```

### Monitoring

- [ ] Setup Cloud Monitoring alerts
- [ ] Monitor execution count
- [ ] Monitor error rate
- [ ] Monitor average execution time
- [ ] Monitor memory usage
- [ ] Monitor costs

## Phase 11: Documentation

- [ ] Update README with deployment instructions
- [ ] Document function URLs for team
- [ ] Create runbooks for common issues
- [ ] Document rate limits and quotas
- [ ] Create troubleshooting guide
- [ ] Document cost estimates
- [ ] Create backup and restore procedures

## Phase 12: Maintenance

- [ ] Setup automated logs export
- [ ] Create monitoring dashboard
- [ ] Setup alerts for failures
- [ ] Plan regular security audits
- [ ] Track usage metrics
- [ ] Plan for scaling needs
- [ ] Setup audit log retention

## Verification Checklist Before Marking Complete

Production readiness:

- [ ] All 5 functions deployed successfully
- [ ] Error rates < 1%
- [ ] Response times < 500ms average
- [ ] Rate limiting working correctly
- [ ] Audit logs being created
- [ ] No sensitive data in logs
- [ ] Security rules verified
- [ ] Performance meets SLAs
- [ ] Cost under budget
- [ ] Documentation complete
- [ ] Team trained on functions
- [ ] Monitoring and alerts active

## Troubleshooting Matrix

| Issue | Solution |
|-------|----------|
| "Missing Cloud Functions API" | Enable: `gcloud services enable cloudfunctions.googleapis.com` |
| "Cannot find modules" | Run: `cd functions && npm install` |
| "Timeout errors" | Increase timeout in firebase.json or gcloud CLI |
| "Cold start slow" | Set min-instances: 1 for always-on |
| "Permission denied" | Check Cloud Functions service account permissions |
| "Emulator not starting" | Kill zombie processes and clear cache |
| "Rate limit not working" | Verify clock sync on local machine |
| "Functions not updating" | Clear cache: `firebase functions:delete && redeploy` |

## Timeline Estimate

- Phase 1-3: 2-3 hours (setup)
- Phase 4-5: 4-6 hours (development)
- Phase 6-7: 2-3 hours (integration)
- Phase 8-9: 3-4 hours (testing + deployment)
- Phase 10-12: 2-3 hours (optimization + docs)

**Total: 13-19 hours** to full production ready

---

## Status Tracking

| Phase | Status | Completed Date | Notes |
|-------|--------|-----------------|-------|
| 1 | ✅ | 2024-01-XX | Config updated with Functions support |
| 2 | ⏳ | - | Ready to initialize |
| 3 | ⏳ | - | Pending phase 2 |
| 4 | ⏳ | - | Template file ready |
| 5 | ⏳ | - | Testing guide created |
| 6 | ⏳ | - | Client code already configured |
| 7 | ⏳ | - | Firestore rules need update |
| 8 | ⏳ | - | Pending phase 4-7 |
| 9 | ⏳ | - | Deployment guide ready |
| 10 | ⏳ | - | Post-deployment phase |
| 11 | ⏳ | - | Documentation phase |
| 12 | ⏳ | - | Maintenance phase |

---

**Last Updated:** 2024-01-15  
**Created for:** TSBI Website Project  
**Target Completion:** TBD  
**Assigned to:** Development Team
