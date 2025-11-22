// server/src/models/Contact.js
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "contacts";

// Validate email
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Create contact
const createContact = async (contactData) => {
  // Validate email
  if (!isValidEmail(contactData.email)) {
    throw new Error(`${contactData.email} is not a valid email address`);
  }
  
  const contactRef = db.collection(COLLECTION_NAME).doc();
  const contact = {
    name: contactData.name.trim(),
    email: contactData.email.trim().toLowerCase(),
    phone: contactData.phone.trim(),
    source: contactData.source?.trim() || "Not specified",
    message: contactData.message.trim(),
    status: contactData.status || "new",
    emailSent: contactData.emailSent || false,
    emailError: contactData.emailError || null,
    submittedAt: contactData.submittedAt || new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await contactRef.set(contact);
  return { id: contactRef.id, ...contact };
};

// Find contact by ID
const findContactById = async (id) => {
  const doc = await db.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Find contacts with filters
const findContacts = async (filters = {}) => {
  let query = db.collection(COLLECTION_NAME);
  
  if (filters.email) {
    query = query.where("email", "==", filters.email.toLowerCase());
  }
  
  if (filters.status) {
    query = query.where("status", "==", filters.status);
  }
  
  const snapshot = await query.orderBy("submittedAt", "desc").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update contact
const updateContact = async (id, updateData) => {
  const update = {
    ...updateData,
    updatedAt: new Date()
  };
  
  // Clean up string fields
  if (update.name) update.name = update.name.trim();
  if (update.email) {
    update.email = update.email.trim().toLowerCase();
    if (!isValidEmail(update.email)) {
      throw new Error(`${update.email} is not a valid email address`);
    }
  }
  if (update.phone) update.phone = update.phone.trim();
  if (update.source) update.source = update.source.trim();
  if (update.message) update.message = update.message.trim();
  
  await db.collection(COLLECTION_NAME).doc(id).update(update);
  return findContactById(id);
};

// Delete contact
const deleteContact = async (id) => {
  await db.collection(COLLECTION_NAME).doc(id).delete();
};

const Contact = {
  create: createContact,
  findById: findContactById,
  find: findContacts,
  update: updateContact,
  delete: deleteContact
};

export default Contact;
