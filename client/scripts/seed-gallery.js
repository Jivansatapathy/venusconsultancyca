// Seed script to upload gallery images to Firebase Storage and data to Firestore
// Run with: node scripts/seed-gallery.js

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { galleryData } from '../src/data/galleryData.js';
import fs from 'fs';

// Load environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from client directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Firebase configuration
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
const storage = getStorage(app);
const db = getFirestore(app);

const COLLECTION_NAME = 'gallery1';

async function uploadImageToStorage(imagePath, fileName) {
  try {
    const fullPath = path.join(__dirname, '..', 'public', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Image not found: ${fullPath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const storageRef = ref(storage, `gallery/${fileName}`);
    
    console.log(`📤 Uploading ${fileName}...`);
    await uploadBytes(storageRef, fileBuffer);
    
    const downloadURL = await getDownloadURL(storageRef);
    console.log(`✅ Uploaded: ${downloadURL}`);
    
    return downloadURL;
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
    return null;
  }
}

async function seedGallery() {
  console.log('🌱 Starting gallery seed process...\n');

  for (const item of galleryData) {
    try {
      // Extract filename from image path
      const imagePath = item.image.startsWith('/') ? item.image.substring(1) : item.image;
      const fileName = path.basename(imagePath);
      
      // Upload image to Firebase Storage
      const imageUrl = await uploadImageToStorage(imagePath, fileName);
      
      if (!imageUrl) {
        console.log(`⚠️  Skipping ${item.eventName} - image upload failed`);
        continue;
      }

      // Prepare document data
      const docData = {
        id: item.id,
        eventName: item.eventName,
        location: item.location,
        description: item.description,
        attendees: item.attendees,
        orientation: item.orientation || 'landscape',
        imageUrl: imageUrl,
        imagePath: imagePath,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to Firestore with document ID as the item id
      const docRef = doc(db, COLLECTION_NAME, item.id.toString());
      await setDoc(docRef, docData);
      
      console.log(`✅ Added to Firestore: ${item.eventName} (ID: ${item.id})\n`);
    } catch (error) {
      console.error(`❌ Error processing ${item.eventName}:`, error.message);
    }
  }

  console.log('✨ Gallery seed process completed!');
  process.exit(0);
}

// Run the seed function
seedGallery().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

