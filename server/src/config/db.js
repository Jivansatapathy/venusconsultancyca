// server/src/config/db.js
// Re-export Firestore connection for backward compatibility
export { db, connectDB, isConnected } from "./firebase.js";
export { connectDB as default } from "./firebase.js";
