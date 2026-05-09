# Firestore Security Rules - Implementation Guide

## Overview

This document explains the role-based security rules implemented in `firestore.rules`. These rules enforce:

- **Data Privacy**: Users only access their own data
- **Role-Based Access Control (RBAC)**: Different permissions for resident, responder, and admin roles
- **Data Validation**: Ensures data integrity at the database level
- **Audit Trail**: All writes are authenticated and traceable

## Security Model

### User Roles

1. **resident** - Local citizen/resident
2. **responder** - Emergency responder/government official
3. **admin** - System administrator
4. **user** - Default role (deprecated, use resident)

### Access Patterns

| Resource | Resident | Responder | Admin |
|----------|----------|-----------|-------|
| Own Profile | Read/Write | Read/Write | Read/Write |
| Flood Alerts | Read | Read/Write | Read/Write |
| Shelters | Read | Read/Write | Read/Write |
| Incident Reports | Report/Read | Read/Write | Read/Write |
| Hazard Reports | Report/Read | Read | Read/Write |
| Training Programs | Read | Read | Write |
| Operational Teams | — | Read/Write | Read/Write |
| Contact Forms | Write | — | Read |
| Blog Posts | Read | Read | Write |

## How to Deploy

### Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your TSBI project
3. Navigate to **Firestore Database** → **Rules**

### Step 2: Copy Security Rules

1. Open `firestore.rules` from this repository
2. Copy the entire JSON content
3. Paste into Firebase Console's Rules editor

### Step 3: Publish Rules

1. Click **Publish** button
2. Firebase will validate the rules
3. If successful, rules are live immediately

### Step 4: Test Rules (Optional)

Use the **Rules Playground** in Firebase Console to test:

```
// Test as resident user
{
  "uid": "test-resident-uid",
  "token": { "role": "resident" }
}

// Test as responder user
{
  "uid": "test-responder-uid",
  "token": { "role": "responder" }
}
```

## Rule Breakdown

### 1. User Profiles

```firestore
"users": {
  "{userId}": {
    ".read": "auth.uid === $userId",  // Only own profile
    ".write": "auth.uid === $userId"   // Only own profile
  }
}
```

**Allows:**
- Users to read/write their own profile
- Stores: `uid`, `email`, `displayName`, `role`, `createdAt`

---

### 2. Flood Alerts (Public Read, Responder Write)

```firestore
"floodAlerts": {
  ".read": "auth != null",  // All authenticated users
  "{alertId}": {
    ".write": "...responder or admin"  // Only responders/admins
  }
}
```

**Allows:**
- All authenticated users to see active flood alerts
- Responders/admins to create flood alerts
- Real-time alert distribution to all residents

---

### 3. Shelters (Public Read, Responder Manage)

```firestore
"shelters": {
  ".read": "auth != null",  // All authenticated users
  "{shelterId}": {
    ".write": "...responder or admin"  // Only responders/admins
  }
}
```

**Allows:**
- All users to find nearby shelters
- Responders to manage capacity and status
- Real-time occupancy updates

---

### 4. Operational Teams (Responder Only)

```firestore
"operationalTeams": {
  ".read": "...responder or admin",  // Only responders/admins
  ".write": "...responder or admin"
}
```

**Allows:**
- Responders to manage squad assignments and status
- Restricted from residents (privacy/security)
- Real-time team coordination

---

### 5. Incident Reports (Authenticated Read, Role-Based Write)

```firestore
"incidentReports": {
  ".read": "auth != null",  // All authenticated users
  ".write": "owner or responder or admin"
}
```

**Allows:**
- Users to report incidents
- Responders to coordinate responses
- Public visibility of incidents (for safety)

---

### 6. Training Progress (User + Admin)

```firestore
"userTrainingProgress": {
  "{userId}": {
    ".read": "auth.uid === $userId or admin",
    ".write": "auth.uid === $userId or admin"
  }
}
```

**Allows:**
- Users to track their training completion
- Admins to view progress analytics

---

### 7. Contact/Partnership Forms (Public Write, Admin Read)

```firestore
"contactSubmissions": {
  ".read": "admin only",  // Admins only
  ".write": "not exists()"  // New submissions only
}
```

**Allows:**
- Public contact form submissions
- Admins to review inquiries
- Prevents duplicate/update attacks

---

## Validation Rules

### Firestore Automatically Validates:

- **Flood Alerts**: Must have `location`, `severity`, `message`, `timestamp`
  - `severity` must be: low, medium, high, critical

- **Shelters**: Must have `name`, `location`, `capacity`
  - `capacity` must be positive number

- **Incident Reports**: Must have `type`, `location`, `description`, `timestamp`
  - Only reporter or responder can modify

- **Training Progress**: Must have `completedAt` or `startedAt`

---

## Common Operations & Permissions

### A Resident User Can:

✅ View their own profile
✅ View active flood alerts
✅ Find nearby shelters
✅ Report hazards
✅ See volunteer opportunities
✅ Submit contact forms
✅ Track training progress

❌ View operational teams
❌ Modify alerts or shelters
❌ Access incident data

### A Responder Can:

✅ All resident permissions
✅ Create/update flood alerts
✅ Manage shelter capacity
✅ View operational teams
✅ Coordinate incident response
✅ Access real-time flood data

❌ Write blog posts
❌ View contact form submissions

### An Admin Can:

✅ All responder permissions
✅ Manage users
✅ Write blog posts
✅ Manage training programs
✅ View analytics

---

## Testing Guide

### Test Case 1: Resident Alert View

**Setup:**
```
- User role: resident
- Collection: floodAlerts
```

**Test:**
```
// Should SUCCEED (read allowed)
db.collection('floodAlerts').get()

// Should FAIL (write not allowed)
db.collection('floodAlerts').doc('alert-1').set({...})
```

---

### Test Case 2: Responder Can Manage Teams

**Setup:**
```
- User role: responder
- Collection: operationalTeams
```

**Test:**
```
// Should SUCCEED (read allowed)
db.collection('operationalTeams').get()

// Should SUCCEED (write allowed)
db.collection('operationalTeams').doc('squad-1').update({status: 'active'})
```

---

### Test Case 3: Resident Cannot Edit Other Profiles

**Setup:**
```
- User ID: resident-123
- User role: resident
- Target: users/resident-456/profile
```

**Test:**
```
// Should FAIL (not own profile)
db.collection('users').doc('resident-456').update({role: 'responder'})
```

---

## Deployment Checklist

- [ ] Review `firestore.rules` file
- [ ] Copy rules to Firebase Console
- [ ] Test with Rules Playground
- [ ] Test with actual app authentication
- [ ] Monitor Firestore for any denied writes (Dashboard → Usage → Denied Writes)
- [ ] Document any custom rules needed

---

## Emergency Procedures

### If Rules Break Production:

1. Go to Firebase Console → Firestore → Rules
2. Click **Revert** to previous version
3. Debug issue locally
4. Re-test before re-deploying

### Monitoring Rules Violations:

1. Firebase Console → Firestore Dashboard
2. Monitor "Denied Writes" metric
3. Check Cloud Logging for detailed failures

---

## Future Enhancements

- [ ] Add rate limiting for API calls
- [ ] Implement time-based access (emergency overrides)
- [ ] Add geographic restrictions (by region)
- [ ] Implement audit logging for sensitive operations
- [ ] Add data retention policies

---

## References

- [Firestore Security Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Rules Language](https://firebase.google.com/docs/database/security)
- [Security Best Practices](https://firebase.google.com/docs/firestore/security/rules-structure)
