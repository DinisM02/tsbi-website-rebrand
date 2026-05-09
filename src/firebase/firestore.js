import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "./config";

const ensureDb = () => {
  if (!isFirebaseEnabled || !db) {
    const err = new Error("Firestore is not configured in this deployment");
    err.code = "firestore/not-configured";
    throw err;
  }
};

// Generic add document
export const addDocument = async (collectionName, data) => {
  ensureDb();
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Generic get all documents
export const getDocuments = async (
  collectionName,
  orderField = "createdAt",
  orderDirection = "desc"
) => {
  if (!isFirebaseEnabled || !db) {
    return [];
  }
  const q = query(collection(db, collectionName), orderBy(orderField, orderDirection));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get documents with filter
export const getDocumentsWhere = async (collectionName, field, operator, value) => {
  if (!isFirebaseEnabled || !db) {
    return [];
  }
  const q = query(
    collection(db, collectionName),
    where(field, operator, value),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get single document
export const getDocument = async (collectionName, docId) => {
  if (!isFirebaseEnabled || !db) {
    return null;
  }
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

// Update document
export const updateDocument = async (collectionName, docId, data) => {
  ensureDb();
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

// Delete document
export const deleteDocument = async (collectionName, docId) => {
  ensureDb();
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

// === SPECIFIC COLLECTIONS ===

// Contact messages
export const submitContact = (data) => addDocument("contacts", { ...data, status: "new" });
export const getContacts = () => getDocuments("contacts");
export const updateContactStatus = (id, status, adminResponse = "") =>
  updateDocument("contacts", id, { status, adminResponse });

// Hazard reports
export const submitHazardReport = (data) => addDocument("hazardReports", { ...data, status: "pending" });
export const getHazardReports = () => getDocuments("hazardReports");
export const updateHazardReportStatus = (id, status, adminResponse = "") =>
  updateDocument("hazardReports", id, { status, adminResponse });

// Incident reports (Cloud Functions flow)
export const getIncidentReports = () => getDocuments("incidentReports", "timestamp", "desc");
export const updateIncidentReportStatus = (id, status, adminResponse = "") =>
  updateDocument("incidentReports", id, { status, adminResponse });

// Training requests
export const submitTrainingRequest = (data) => addDocument("trainingRequests", { ...data, status: "new" });
export const getTrainingRequests = () => getDocuments("trainingRequests");
export const updateTrainingRequestStatus = (id, status, adminResponse = "") =>
  updateDocument("trainingRequests", id, { status, adminResponse });

// Volunteer applications
export const submitVolunteerApplication = (data) => addDocument("volunteerApplications", { ...data, status: "new" });
export const getVolunteerApplications = () => getDocuments("volunteerApplications");
export const updateVolunteerApplicationStatus = (id, status, adminResponse = "") =>
  updateDocument("volunteerApplications", id, { status, adminResponse });

// Partner inquiries
export const submitPartnerInquiry = (data) => addDocument("partnerInquiries", { ...data, status: "new" });
export const getPartnerInquiries = () => getDocuments("partnerInquiries");
export const updatePartnerInquiryStatus = (id, status, adminResponse = "") =>
  updateDocument("partnerInquiries", id, { status, adminResponse });

// Blog posts
export const createBlogPost = (data) => addDocument("blogPosts", { ...data, published: true });
export const getBlogPosts = () => getDocuments("blogPosts");
export const getPublishedBlogPosts = () => getDocumentsWhere("blogPosts", "published", "==", true);
export const updateBlogPost = (id, data) => updateDocument("blogPosts", id, data);
export const deleteBlogPost = (id) => deleteDocument("blogPosts", id);

// Users
export const getUsers = () => getDocuments("users");
export const updateUserRole = (uid, role) => {
  ensureDb();
  const docRef = doc(db, "users", uid);
  return updateDoc(docRef, { role });
};

// Flood alerts
export const getFloodAlerts = () => getDocuments("floodAlerts", "createdAt", "desc");
export const getActiveFloodAlerts = () => getDocumentsWhere("floodAlerts", "active", "==", true);
export const createFloodAlert = (data) => addDocument("floodAlerts", { ...data, active: true });
export const resolveFloodAlert = (id) => updateDocument("floodAlerts", id, { active: false });

// Shelters
export const getShelters = () => getDocuments("shelters", "createdAt", "desc");
export const getActiveShelters = () => getDocumentsWhere("shelters", "active", "==", true);
export const createShelter = (data) => addDocument("shelters", { ...data, active: true });
export const updateShelterCapacity = (id, currentOccupancy) =>
  updateDocument("shelters", id, { currentOccupancy });

// Operational teams (for responder dashboard)
export const getOperationalTeams = () => getDocuments("operationalTeams", "createdAt", "desc");
