// server/src/models/Recruiter.js
import { db } from "../config/firebase.js";
import bcrypt from "bcryptjs";

const COLLECTION_NAME = "recruiters";

// Helper function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Helper function to compare password
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Create recruiter
const createRecruiter = async (recruiterData) => {
  const { password, ...rest } = recruiterData;
  const hashedPassword = await hashPassword(password);
  
  const recruiterRef = db.collection(COLLECTION_NAME).doc();
  const recruiter = {
    ...rest,
    password: hashedPassword,
    role: rest.role || "recruiter",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await recruiterRef.set(recruiter);
  return { id: recruiterRef.id, ...recruiter };
};

// Find recruiter by email
const findRecruiterByEmail = async (email) => {
  const snapshot = await db.collection(COLLECTION_NAME)
    .where("email", "==", email)
    .limit(1)
    .get();
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

// Find recruiter by ID
const findRecruiterById = async (id) => {
  const doc = await db.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Update recruiter
const updateRecruiter = async (id, updateData) => {
  const { password, ...rest } = updateData;
  const update = {
    ...rest,
    updatedAt: new Date()
  };
  
  if (password) {
    update.password = await hashPassword(password);
  }
  
  await db.collection(COLLECTION_NAME).doc(id).update(update);
  return findRecruiterById(id);
};

// Delete recruiter
const deleteRecruiter = async (id) => {
  await db.collection(COLLECTION_NAME).doc(id).delete();
};

// Find all recruiters
const findAllRecruiters = async (filters = {}) => {
  const snapshot = await db.collection(COLLECTION_NAME).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Delete all recruiters (for seeding)
const deleteAllRecruiters = async () => {
  const snapshot = await db.collection(COLLECTION_NAME).get();
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
};

const Recruiter = {
  create: createRecruiter,
  findByEmail: findRecruiterByEmail,
  findById: findRecruiterById,
  find: findAllRecruiters,
  update: updateRecruiter,
  delete: deleteRecruiter,
  deleteAll: deleteAllRecruiters,
  comparePassword,
  hashPassword
};

export default Recruiter;
