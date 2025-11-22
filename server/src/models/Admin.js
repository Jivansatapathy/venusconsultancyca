// server/src/models/Admin.js
import { db } from "../config/firebase.js";
import bcrypt from "bcryptjs";

const COLLECTION_NAME = "admins";

// Helper function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Helper function to compare password
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Create admin
const createAdmin = async (adminData) => {
  const { password, ...rest } = adminData;
  const hashedPassword = await hashPassword(password);
  
  const adminRef = db.collection(COLLECTION_NAME).doc();
  const admin = {
    ...rest,
    password: hashedPassword,
    role: rest.role || "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await adminRef.set(admin);
  return { id: adminRef.id, ...admin };
};

// Find admin by email
const findAdminByEmail = async (email) => {
  const snapshot = await db.collection(COLLECTION_NAME)
    .where("email", "==", email)
    .limit(1)
    .get();
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

// Find admin by ID
const findAdminById = async (id) => {
  const doc = await db.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Update admin
const updateAdmin = async (id, updateData) => {
  const { password, ...rest } = updateData;
  const update = {
    ...rest,
    updatedAt: new Date()
  };
  
  if (password) {
    update.password = await hashPassword(password);
  }
  
  await db.collection(COLLECTION_NAME).doc(id).update(update);
  return findAdminById(id);
};

// Delete admin
const deleteAdmin = async (id) => {
  await db.collection(COLLECTION_NAME).doc(id).delete();
};

// Delete all admins (for seeding)
const deleteAllAdmins = async () => {
  const snapshot = await db.collection(COLLECTION_NAME).get();
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
};

const Admin = {
  create: createAdmin,
  findByEmail: findAdminByEmail,
  findById: findAdminById,
  update: updateAdmin,
  delete: deleteAdmin,
  deleteAll: deleteAllAdmins,
  comparePassword,
  hashPassword
};

export default Admin;
