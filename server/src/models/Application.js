// server/src/models/Application.js
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "applications";

// Create application
const createApplication = async (applicationData) => {
  const applicationRef = db.collection(COLLECTION_NAME).doc();
  const application = {
    jobId: applicationData.jobId,
    name: applicationData.name,
    email: applicationData.email,
    phone: applicationData.phone || "",
    coverMessage: applicationData.coverMessage || "",
    resumePath: applicationData.resumePath,
    resumeOriginalName: applicationData.resumeOriginalName,
    status: applicationData.status || "new",
    notes: applicationData.notes || "",
    appliedAt: applicationData.appliedAt || new Date(),
    updatedAt: new Date()
  };
  
  await applicationRef.set(application);
  return { id: applicationRef.id, ...application };
};

// Find application by ID
const findApplicationById = async (id) => {
  const doc = await db.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Find applications with filters
const findApplications = async (filters = {}) => {
  let query = db.collection(COLLECTION_NAME);
  
  if (filters.jobId) {
    query = query.where("jobId", "==", filters.jobId);
  }
  
  if (filters.status) {
    query = query.where("status", "==", filters.status);
  }
  
  if (filters.email) {
    query = query.where("email", "==", filters.email);
  }
  
  const snapshot = await query.orderBy("appliedAt", "desc").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update application
const updateApplication = async (id, updateData) => {
  const update = {
    ...updateData,
    updatedAt: new Date()
  };
  
  await db.collection(COLLECTION_NAME).doc(id).update(update);
  return findApplicationById(id);
};

// Delete application
const deleteApplication = async (id) => {
  await db.collection(COLLECTION_NAME).doc(id).delete();
};

const Application = {
  create: createApplication,
  findById: findApplicationById,
  find: findApplications,
  update: updateApplication,
  delete: deleteApplication
};

export default Application;
