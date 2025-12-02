// Firebase client configuration
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Using the same project as the server
const firebaseConfig = {
  apiKey: "AIzaSyDEHj4YTsEt07P8OXJm3MVu4JMhozblVHI",
  authDomain: "venusglobal-847ea.firebaseapp.com",
  projectId: "venusglobal-847ea",
  storageBucket: "venusglobal-847ea.firebasestorage.app",
  messagingSenderId: "841304788329",
  appId: "1:841304788329:web:726fb2353a1135b48b01f8",
  measurementId: "G-MWE9SLRQKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;

