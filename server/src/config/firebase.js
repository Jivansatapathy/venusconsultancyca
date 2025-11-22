// server/src/config/firebase.js
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "../../");

// Service account configuration
const serviceAccount = {
  type: "service_account",
  project_id: "venusglobal-847ea",
  private_key_id: "f9003683042055facfdae27da367b67f6da0b045",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQClB1/h0DhEYGWM\nsOGjV9fGweSsuJTxd6zindjLVnhKT6AZnNX2k62nXza9VgGCiErTiSH9txwppI9d\nYy8AKcZt490dgmELgtSuot3M5kxgZLS3sCuv10QZIKnzZfwqAFQDO/Q1NYEYK3PU\nQMHIW8SG/CuU0/K05cAv7Uwz/iS2sccnlNITtM14MtB7ORbmYHVbwQMBNrMBt96S\nasult4lfQPN3+mT0ipCt6eY8Yp1jH6ShbOmt+PGFuNK5sPf4Df14PLwC5dAoxftr\nZVXPNrU6L7Hq0cHGJ5xRQIxdVIvrVtNQmS95CQx8r6PaqAJj6T3b5G2KUpc79qrj\n7TOeQsSzAgMBAAECggEAFfYsxt7QVh0j9nylknjCsOMlvOyVears+X17F9hKis0c\n57us57MQdYkgvkKfUdE0cAE8YkjHeS06nPlxjEqC6yXbS62Jn6AKELGA5d8yA9Pz\nDszli3GQ0O09YLROQgKoK4QDhD86Dk7eC72QbEr2FOajIBuynWtDz7z7GqI0HZHF\nMHPTepwyVreNqNu6FPnqbJeffKLKQRjYLChrzC8mGJuWXYl//2zJB7NZmCCz9hdV\n5t1/MUvDHz+rPNAJWNQF0oE75Ed8ggN6rIFBL9v6eJ11qTfjc2KF9kxyaIaEJ7xu\nnYxJkq8wMZbNHAwo090Am7OwB2HMkwiBsGNA4yYoHQKBgQDcpLW6v7f8qq72GGGU\nVFkRo/sCW6NWi5CFF+/XlkWpXHaEBX5GYC83Fnwr3AQUJsnRudK0R+8SpZHl81Vy\nDlpYPtvkHpUauB+lcK4ZLHH0FMZbz8Et415K6SLKn7wLPp7X8sAwxl+rYdr9UqIR\nBMBgJCy73JYlQoJ+H7TbrjQTzQKBgQC/eTqG5lXQjkraiRO+XuV9cgAl40ganKlf\n0Y1upiS2jqp4kn96tJAr60c86KU3Ao9xiSXwzqryO8DhZrQa4c9Gz2nIxlmFVLTQ\n4TmZ+WX6u8XgoXv1siZP3vQZY4Or6yY/9uzRs3JNbinMCK7fINlG5bCgwTd6gZ5r\n78vCdjK6fwKBgQCtbqKSKkS6zIc+VafN6gchAJ47GkDntEhi9Y/HDA2xtEZMO+0n\n8E7spDXyW7yxAlQ9EC15G9nl9FMcRwrw3itRlgdN5mQZXoUxi8KtcuwXiYTpggI8\nya3CgEKitrAevpgo8lzzedqVYhO6b4uIiQ2WBJlNCXTT0NW1wcJtsx6oOQKBgB0+\nDYM2wFpmsOXpU3uakJ/0/jLLIGL4FCIPJfOFKkw7Q6vAa/m4g+BBQZL60Oiy2mdz\nk7jQR2lRWObTwaPtYrOkz7obGOb1Bdx02VA7t6hwbwscfosKlzFRkqQh/6UM972D\nH63zIvzSW03O8a4gHS7nu28Bs1BhZWmEqPDdDmhPAoGAKCB7crooVlR+sl05vtxy\n59+EJGRhJBKlJR1uNZq00dPIeSV3wBjqmmdpBh1KGdvJhIORDXqoyApC+ahNwXFZ\nIKsxu3Go01GJ+LDBcYFzjUJRmk4tfGEB8bHohZxMI6we5ZEjdw40UuGgzHJjZpTN\nNUd9pvRqeyB/B5tRmw8nn5Y=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@venusglobal-847ea.iam.gserviceaccount.com",
  client_id: "107018407090157496477",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40venusglobal-847ea.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin if not already initialized
let firebaseApp;
let db;
let storage;

try {
  // Check if Firebase is already initialized
  if (admin.apps.length === 0) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: "venusglobal-847ea",
      storageBucket: "venusglobal-847ea"
    });
    console.log("✅ Firebase Admin initialized");
  } else {
    firebaseApp = admin.app();
    console.log("✅ Firebase Admin already initialized (reusing)");
  }
  
  // Use named database "venushiring" instead of default
  // In Firebase Admin SDK, use getFirestore from modular API with database ID
  const { getFirestore } = await import('firebase-admin/firestore');
  
  // For now, use default database. To use named database 'venushiring', 
  // create it in Firebase Console first, then change to: getFirestore(firebaseApp, 'venushiring')
  db = getFirestore(firebaseApp); // Using default database
  console.log("✅ Firestore default database initialized");
  
  // Initialize Firebase Storage
  storage = getStorage(firebaseApp);
  console.log("✅ Firebase Storage initialized");
  
  // To use named database 'venushiring', uncomment below and comment above:
  // db = getFirestore(firebaseApp, 'venushiring');
  // console.log("✅ Firestore database 'venushiring' initialized");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error.message);
  throw error;
}

// Connection state
let isConnected = true;

const connectDB = async () => {
  try {
    // Firestore doesn't require explicit connection like MongoDB
    // Just verify we can access the database
    if (!db) {
      throw new Error("Firestore not initialized");
    }
    
    // Test connection by getting a collection reference
    const testRef = db.collection("_health");
    await testRef.limit(1).get();
    
    isConnected = true;
    console.log("✅ Firestore Connected");
    return;
  } catch (err) {
    console.error("❌ Firestore Connection Failed:", err.message);
    isConnected = false;
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    throw err;
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    if (firebaseApp) {
      await firebaseApp.delete();
      console.log("✅ Firestore connection closed through app termination");
    }
  } catch (error) {
    console.error("Error closing Firestore connection:", error);
  }
  process.exit(0);
});

export { db, storage, connectDB, isConnected };
export default db;

