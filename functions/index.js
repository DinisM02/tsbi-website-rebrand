const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();
app.use(cors({ origin: true }));

const db = admin.firestore();
const { FieldValue } = admin.firestore;
const PASSWORD_RESET_OTP_TTL_MS = 10 * 60 * 1000;
const PASSWORD_RESET_OTP_MAX_ATTEMPTS = 5;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function passwordResetDocId(email) {
  return crypto.createHash("sha256").update(email).digest("hex");
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashOtp(otp, salt) {
  return crypto.createHash("sha256").update(`${otp}:${salt}`).digest("hex");
}

async function sendOtpEmail(email, otp) {
  const sendgridApiKey =
    process.env.SENDGRID_API_KEY || functions.config()?.sendgrid?.api_key || "";
  const fromEmail =
    process.env.PASSWORD_RESET_FROM_EMAIL ||
    functions.config()?.notifications?.from_email ||
    "";

  if (!sendgridApiKey || !fromEmail) {
    const err = new Error("OTP email provider is not configured");
    err.code = "otp-email-not-configured";
    throw err;
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sendgridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: fromEmail, name: "TSBI Security" },
      subject: "TSBI Password Reset OTP",
      content: [
        {
          type: "text/plain",
          value:
            `Your TSBI password reset code is: ${otp}\n\n` +
            "This code expires in 10 minutes. If you did not request this, ignore this email.",
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send OTP email (${response.status}): ${body}`);
  }
}

function assertAuthenticated(context, message) {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", message);
  }
}

async function getUserRole(userId) {
  const userDoc = await db.collection("users").doc(userId).get();
  return userDoc.data()?.role ?? null;
}

function assertRole(userRole, allowedRoles, message) {
  if (!allowedRoles.includes(userRole)) {
    throw new functions.https.HttpsError("permission-denied", message);
  }
}

function assertRequiredString(value, fieldName, minLength, maxLength) {
  if (typeof value !== "string") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      `${fieldName} must be a string`
    );
  }

  const trimmedValue = value.trim();
  if (trimmedValue.length < minLength || trimmedValue.length > maxLength) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      `${fieldName} must be between ${minLength} and ${maxLength} characters`
    );
  }

  return trimmedValue;
}

exports.validateFloodAlert = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context, "User must be authenticated to create flood alerts");

  const userRole = await getUserRole(context.auth.uid);
  assertRole(
    userRole,
    ["responder", "admin"],
    "Only emergency responders and admins can create flood alerts"
  );

  const location = assertRequiredString(data?.location, "location", 3, 100);
  const message = assertRequiredString(data?.message, "message", 10, 500);
  const severity = data?.severity;
  const validSeverities = ["low", "medium", "high", "critical"];

  if (!validSeverities.includes(severity)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      `Invalid severity level. Must be one of: ${validSeverities.join(", ")}`
    );
  }

  const alertRef = db.collection("floodAlerts").doc();

  await alertRef.set({
    location,
    message,
    severity,
    createdBy: context.auth.uid,
    createdByRole: userRole,
    status: "active",
    active: true,
    views: 0,
    createdAt: FieldValue.serverTimestamp(),
    timestamp: FieldValue.serverTimestamp(),
  });

  await db.collection("auditLogs").add({
    action: "FLOOD_ALERT_CREATED",
    resourceId: alertRef.id,
    userId: context.auth.uid,
    userRole,
    timestamp: FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    alertId: alertRef.id,
    message: "Flood alert created and distributed to residents",
  };
});

exports.updateUserRole = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context, "Admin authentication required");

  const adminRole = await getUserRole(context.auth.uid);
  assertRole(adminRole, ["admin"], "Only system admins can manage user roles");

  const userId = assertRequiredString(data?.userId, "userId", 3, 128);
  const newRole = data?.newRole;
  const validRoles = ["resident", "responder", "admin"];

  if (!validRoles.includes(newRole)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      `Invalid role. Must be one of: ${validRoles.join(", ")}`
    );
  }

  if (userId === context.auth.uid && newRole !== "admin") {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Cannot remove your own admin status"
    );
  }

  await db.collection("users").doc(userId).update({
    role: newRole,
    roleUpdatedAt: FieldValue.serverTimestamp(),
    roleUpdatedBy: context.auth.uid,
  });

  await db.collection("auditLogs").add({
    action: "USER_ROLE_UPDATED",
    adminId: context.auth.uid,
    newRole,
    targetUserId: userId,
    timestamp: FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    message: `User role updated to ${newRole}`,
  };
});

exports.submitIncidentReport = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context, "User must be authenticated to report incidents");

  const type = assertRequiredString(data?.type, "type", 3, 80);
  const location = assertRequiredString(data?.location, "location", 3, 100);
  const description = assertRequiredString(data?.description, "description", 10, 500);
  const severity = data?.severity ?? "medium";
  const validSeverities = ["low", "medium", "high", "critical"];

  if (!validSeverities.includes(severity)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      `Invalid severity level. Must be one of: ${validSeverities.join(", ")}`
    );
  }

  const oneHourAgo = admin.firestore.Timestamp.fromMillis(Date.now() - 3600000);
  const recentReports = await db
    .collection("incidentReports")
    .where("reportedByUid", "==", context.auth.uid)
    .where("timestamp", ">", oneHourAgo)
    .get();

  if (recentReports.size >= 5) {
    throw new functions.https.HttpsError(
      "resource-exhausted",
      "Too many reports in the last hour. Please wait before submitting another."
    );
  }

  const reportRef = db.collection("incidentReports").doc();
  await reportRef.set({
    type,
    location,
    description,
    severity,
    status: "reported",
    reportedByUid: context.auth.uid,
    views: 0,
    timestamp: FieldValue.serverTimestamp(),
  });

  await db.collection("auditLogs").add({
    action: "INCIDENT_REPORT_SUBMITTED",
    resourceId: reportRef.id,
    userId: context.auth.uid,
    timestamp: FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    reportId: reportRef.id,
    message: "Incident reported successfully. Responders are being notified.",
  };
});

exports.getUserStatistics = functions.https.onCall(async (_data, context) => {
  assertAuthenticated(context, "Authentication required");

  const adminRole = await getUserRole(context.auth.uid);
  assertRole(adminRole, ["admin"], "Only admins can view statistics");

  const totalUsersSnapshot = await db.collection("users").count().get();
  const residentsSnapshot = await db
    .collection("users")
    .where("role", "==", "resident")
    .count()
    .get();
  const respondersSnapshot = await db
    .collection("users")
    .where("role", "==", "responder")
    .count()
    .get();

  const totalUsers = totalUsersSnapshot.data().count;
  const residents = residentsSnapshot.data().count;
  const responders = respondersSnapshot.data().count;

  return {
    success: true,
    statistics: {
      totalUsers,
      residents,
      responders,
      admins: totalUsers - residents - responders,
    },
  };
});

exports.requestPasswordResetOtp = functions.https.onCall(async (data) => {
  const email = normalizeEmail(data?.email);
  if (!email || !email.includes("@")) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "A valid email address is required"
    );
  }

  const nowMs = Date.now();
  const docId = passwordResetDocId(email);
  const otpDocRef = db.collection("passwordResetOtps").doc(docId);
  const existing = await otpDocRef.get();

  if (existing.exists) {
    const existingData = existing.data();
    const resendLockedUntil = existingData?.resendLockedUntil?.toMillis?.() || 0;
    if (resendLockedUntil > nowMs) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Please wait before requesting another code"
      );
    }
  }

  let userExists = true;
  try {
    await admin.auth().getUserByEmail(email);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      userExists = false;
    } else {
      throw new functions.https.HttpsError("internal", "Unable to process reset request");
    }
  }

  if (!userExists) {
    return {
      success: true,
      message: "If this email is registered, an OTP has been sent.",
    };
  }

  const otp = generateOtpCode();
  const salt = crypto.randomBytes(16).toString("hex");
  const otpHash = hashOtp(otp, salt);

  try {
    await sendOtpEmail(email, otp);
  } catch (error) {
    if (error.code === "otp-email-not-configured") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "OTP email is not configured on the server"
      );
    }
    throw new functions.https.HttpsError("internal", "Failed to deliver OTP email");
  }

  await otpDocRef.set(
    {
      email,
      otpHash,
      salt,
      attemptsLeft: PASSWORD_RESET_OTP_MAX_ATTEMPTS,
      expiresAt: admin.firestore.Timestamp.fromMillis(nowMs + PASSWORD_RESET_OTP_TTL_MS),
      resendLockedUntil: admin.firestore.Timestamp.fromMillis(nowMs + 60 * 1000),
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: existing.exists ? existing.data()?.createdAt || FieldValue.serverTimestamp() : FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return {
    success: true,
    message: "If this email is registered, an OTP has been sent.",
  };
});

exports.resetPasswordWithOtp = functions.https.onCall(async (data) => {
  const email = normalizeEmail(data?.email);
  const otp = String(data?.otp || "").trim();
  const newPassword = String(data?.newPassword || "");

  if (!email || !email.includes("@")) {
    throw new functions.https.HttpsError("invalid-argument", "A valid email address is required");
  }
  if (!/^\d{6}$/.test(otp)) {
    throw new functions.https.HttpsError("invalid-argument", "OTP must be a 6-digit code");
  }
  if (newPassword.length < 8) {
    throw new functions.https.HttpsError("invalid-argument", "Password must be at least 8 characters");
  }

  const nowMs = Date.now();
  const docId = passwordResetDocId(email);
  const otpDocRef = db.collection("passwordResetOtps").doc(docId);
  const otpDoc = await otpDocRef.get();

  if (!otpDoc.exists) {
    throw new functions.https.HttpsError("failed-precondition", "No active OTP request found");
  }

  const otpData = otpDoc.data();
  const expiresAtMs = otpData?.expiresAt?.toMillis?.() || 0;
  const attemptsLeft = Number(otpData?.attemptsLeft || 0);

  if (expiresAtMs <= nowMs) {
    await otpDocRef.delete();
    throw new functions.https.HttpsError("deadline-exceeded", "OTP has expired");
  }

  if (attemptsLeft <= 0) {
    await otpDocRef.delete();
    throw new functions.https.HttpsError("resource-exhausted", "OTP attempts exceeded");
  }

  const incomingHash = hashOtp(otp, otpData.salt);
  if (incomingHash !== otpData.otpHash) {
    await otpDocRef.update({
      attemptsLeft: attemptsLeft - 1,
      updatedAt: FieldValue.serverTimestamp(),
    });
    throw new functions.https.HttpsError("permission-denied", "Invalid OTP code");
  }

  let userRecord;
  try {
    userRecord = await admin.auth().getUserByEmail(email);
  } catch {
    throw new functions.https.HttpsError("not-found", "User not found");
  }

  await admin.auth().updateUser(userRecord.uid, { password: newPassword });
  await otpDocRef.delete();

  return {
    success: true,
    message: "Password updated successfully",
  };
});

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

exports.api = functions.https.onRequest(app);

exports.cleanupExpiredAlerts = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const thirtyDaysAgo = admin.firestore.Timestamp.fromMillis(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    const expiredAlerts = await db
      .collection("floodAlerts")
      .where("timestamp", "<", thirtyDaysAgo)
      .where("status", "==", "active")
      .get();

    if (expiredAlerts.empty) {
      return null;
    }

    const batch = db.batch();
    expiredAlerts.docs.forEach((doc) => {
      batch.update(doc.ref, { status: "archived" });
    });

    await batch.commit();
    console.log(`Archived ${expiredAlerts.size} expired flood alerts`);
    return null;
  });