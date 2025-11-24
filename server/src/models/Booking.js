// server/src/models/Booking.js
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "bookings";

// Create booking
const createBooking = async (bookingData) => {
  const bookingRef = db.collection(COLLECTION_NAME).doc();
  const booking = {
    name: bookingData.name.trim(),
    email: bookingData.email.trim().toLowerCase(),
    phone: bookingData.phone.trim(),
    company: bookingData.company?.trim() || "",
    callType: bookingData.callType || "consultation",
    preferredDate: bookingData.preferredDate,
    preferredTime: bookingData.preferredTime,
    timezone: bookingData.timezone || "EST",
    message: bookingData.message?.trim() || "",
    status: bookingData.status || "pending",
    adminNotes: bookingData.adminNotes?.trim() || "",
    confirmedDateTime: bookingData.confirmedDateTime || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await bookingRef.set(booking);
  return { id: bookingRef.id, ...booking };
};

// Find booking by ID
const findBookingById = async (id) => {
  const doc = await db.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Find bookings with filters
const findBookings = async (filters = {}) => {
  let query = db.collection(COLLECTION_NAME);
  
  if (filters.email) {
    query = query.where("email", "==", filters.email.toLowerCase());
  }
  
  if (filters.status) {
    query = query.where("status", "==", filters.status);
  }
  
  const snapshot = await query.orderBy("createdAt", "desc").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update booking
const updateBooking = async (id, updateData) => {
  const update = {
    ...updateData,
    updatedAt: new Date()
  };
  
  // Clean up string fields
  if (update.name) update.name = update.name.trim();
  if (update.email) update.email = update.email.trim().toLowerCase();
  if (update.phone) update.phone = update.phone.trim();
  if (update.company) update.company = update.company.trim();
  if (update.message) update.message = update.message.trim();
  if (update.adminNotes) update.adminNotes = update.adminNotes.trim();
  
  await db.collection(COLLECTION_NAME).doc(id).update(update);
  return findBookingById(id);
};

// Delete booking
const deleteBooking = async (id) => {
  await db.collection(COLLECTION_NAME).doc(id).delete();
};

const Booking = {
  create: createBooking,
  findById: findBookingById,
  find: findBookings,
  update: updateBooking,
  delete: deleteBooking
};

export default Booking;
