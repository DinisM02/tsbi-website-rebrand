let admin;

try {
  admin = require("firebase-admin");
} catch (_err) {
  admin = require("../functions/node_modules/firebase-admin");
}

const isDryRun = process.argv.includes("--dry-run");

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT,
  });
}

const db = admin.firestore();
const { FieldValue, Timestamp } = admin.firestore;

const now = Timestamp.now();

const USERS = [
  {
    id: "demo-admin",
    data: {
      uid: "demo-admin",
      email: "admin@thesafetybeacon.com",
      displayName: "TSBI Admin",
      role: "admin",
      createdAt: now,
    },
  },
  {
    id: "demo-responder",
    data: {
      uid: "demo-responder",
      email: "responder@thesafetybeacon.com",
      displayName: "Emergency Responder",
      role: "responder",
      createdAt: now,
    },
  },
  {
    id: "demo-resident",
    data: {
      uid: "demo-resident",
      email: "resident@thesafetybeacon.com",
      displayName: "Community Resident",
      role: "resident",
      createdAt: now,
    },
  },
];

const FLOOD_ALERTS = [
  {
    id: "seed-alert-info",
    data: {
      location: "Maputo Riverfront",
      message: "River levels are stable. Continue monitoring weather updates.",
      severity: "low",
      status: "active",
      active: true,
      views: 0,
      createdBy: "demo-responder",
      createdByRole: "responder",
      createdAt: now,
      timestamp: now,
    },
  },
  {
    id: "seed-alert-watch",
    data: {
      location: "Incomati Basin",
      message: "Heavy rainfall expected in the next 6 hours. Prepare evacuation kits.",
      severity: "medium",
      status: "active",
      active: true,
      views: 0,
      createdBy: "demo-responder",
      createdByRole: "responder",
      createdAt: now,
      timestamp: now,
    },
  },
];

const SHELTERS = [
  {
    id: "seed-shelter-central",
    data: {
      name: "Central High School Shelter",
      location: "Downtown",
      address: "Avenida 25 de Setembro",
      capacity: 350,
      currentOccupancy: 74,
      resources: ["water", "medical", "food", "power"],
      active: true,
      status: "open",
      createdAt: now,
    },
  },
  {
    id: "seed-shelter-riverside",
    data: {
      name: "Riverside Community Hall",
      location: "Riverside",
      address: "Rua da Marginal",
      capacity: 220,
      currentOccupancy: 98,
      resources: ["water", "food", "sanitation"],
      active: true,
      status: "open",
      createdAt: now,
    },
  },
  {
    id: "seed-shelter-north",
    data: {
      name: "North District Sports Center",
      location: "North District",
      address: "Rua da Esperanca",
      capacity: 180,
      currentOccupancy: 45,
      resources: ["water", "medical"],
      active: true,
      status: "open",
      createdAt: now,
    },
  },
];

const OPERATIONAL_TEAMS = [
  {
    id: "seed-team-alpha",
    data: {
      name: "Squad Alpha",
      location: "Downtown",
      status: "active",
      teams: 4,
      lead: "Officer M. Santos",
      createdAt: now,
    },
  },
  {
    id: "seed-team-bravo",
    data: {
      name: "Squad Bravo",
      location: "Riverside",
      status: "active",
      teams: 3,
      lead: "Officer N. Matola",
      createdAt: now,
    },
  },
  {
    id: "seed-team-charlie",
    data: {
      name: "Squad Charlie",
      location: "North District",
      status: "response",
      teams: 5,
      lead: "Officer L. Cossa",
      createdAt: now,
    },
  },
];

const BLOG_POSTS = [
  {
    id: "seed-blog-preparedness",
    data: {
      title: "Flood Preparedness: 10 Essentials Every Family Should Have",
      excerpt: "A practical checklist to prepare your home and family before flood season.",
      content:
        "Flood readiness starts before the rain. Build a household plan, secure documents, and prepare a go-bag with essentials for 72 hours.",
      category: "Preparedness",
      image:
        "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=1200&q=80",
      published: true,
      author: "TSBI Team",
      createdAt: now,
    },
  },
  {
    id: "seed-blog-community",
    data: {
      title: "How Community Response Teams Reduce Flood Risk",
      excerpt: "Why local coordination can save lives during heavy rainfall events.",
      content:
        "Neighborhood-level coordination improves response time and helps vulnerable residents evacuate safely during fast-changing conditions.",
      category: "Community",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      published: true,
      author: "TSBI Operations",
      createdAt: now,
    },
  },
];

const CONTACTS = [
  {
    id: "seed-contact-001",
    data: {
      name: "Maria Lopes",
      email: "maria.lopes@example.org",
      message: "Need printed preparedness materials for our school district.",
      status: "new",
      createdAt: now,
    },
  },
];

const TRAINING_REQUESTS = [
  {
    id: "seed-training-001",
    data: {
      organization: "Maputo Coastal School",
      contactName: "Andre Chaves",
      email: "andre.chaves@example.org",
      requestType: "VR simulation session",
      participants: 40,
      status: "new",
      createdAt: now,
    },
  },
];

const VOLUNTEER_APPLICATIONS = [
  {
    id: "seed-volunteer-001",
    data: {
      name: "Elisa Mucavele",
      email: "elisa.mucavele@example.org",
      availability: "weekends",
      skills: ["first-aid", "coordination"],
      status: "new",
      createdAt: now,
    },
  },
];

const PARTNER_INQUIRIES = [
  {
    id: "seed-partner-001",
    data: {
      organization: "Blue Delta Logistics",
      email: "partnerships@bluedelta.example",
      message: "We can provide transport support during evacuations.",
      status: "new",
      createdAt: now,
    },
  },
];

const HAZARD_REPORTS = [
  {
    id: "seed-hazard-001",
    data: {
      type: "Blocked drain",
      location: "Avenida Julius Nyerere",
      description: "Major blockage near market area, water accumulating quickly.",
      severity: "medium",
      status: "pending",
      createdAt: now,
    },
  },
];

const INCIDENT_REPORTS = [
  {
    id: "seed-incident-001",
    data: {
      type: "Street flooding",
      location: "Baixa district",
      description: "Water level above curb, traffic disrupted.",
      severity: "medium",
      status: "reported",
      reportedByUid: "demo-resident",
      timestamp: now,
      createdAt: now,
    },
  },
];

const ALERT_PREFERENCES = [
  {
    id: "demo-resident",
    data: {
      sms: true,
      email: true,
      push: true,
      voice: false,
      updatedAt: now,
    },
  },
];

const COMMUNITY = [
  {
    id: "demo-responder",
    data: {
      uid: "demo-responder",
      role: "responder",
      online: true,
      updatedAt: now,
    },
  },
];

const COLLECTIONS = [
  { name: "users", docs: USERS },
  { name: "floodAlerts", docs: FLOOD_ALERTS },
  { name: "shelters", docs: SHELTERS },
  { name: "operationalTeams", docs: OPERATIONAL_TEAMS },
  { name: "blogPosts", docs: BLOG_POSTS },
  { name: "contacts", docs: CONTACTS },
  { name: "trainingRequests", docs: TRAINING_REQUESTS },
  { name: "volunteerApplications", docs: VOLUNTEER_APPLICATIONS },
  { name: "partnerInquiries", docs: PARTNER_INQUIRIES },
  { name: "hazardReports", docs: HAZARD_REPORTS },
  { name: "incidentReports", docs: INCIDENT_REPORTS },
  { name: "alertPreferences", docs: ALERT_PREFERENCES },
  { name: "community", docs: COMMUNITY },
];

async function applySeed() {
  console.log(`Seed started for project: ${process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "(default)"}`);
  console.log(`Mode: ${isDryRun ? "DRY-RUN" : "WRITE"}`);

  let total = 0;
  for (const collectionConfig of COLLECTIONS) {
    for (const item of collectionConfig.docs) {
      total += 1;
      if (!isDryRun) {
        await db
          .collection(collectionConfig.name)
          .doc(item.id)
          .set(
            {
              ...item.data,
              seededAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
      }
      console.log(`${isDryRun ? "[dry-run]" : "[write]"} ${collectionConfig.name}/${item.id}`);
    }
  }

  console.log(`Seed completed. Documents processed: ${total}`);
}

applySeed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
  });
