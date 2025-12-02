// Gallery service for Firebase operations
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const COLLECTION_NAME = 'gallery1';

// Get all gallery items
export const getGalleryItems = async () => {
  try {
    const galleryRef = collection(db, COLLECTION_NAME);
    const q = query(galleryRef, orderBy('id', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return items;
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
};

// Add a new gallery item
export const addGalleryItem = async (itemData, imageFile) => {
  try {
    let imageUrl = itemData.imageUrl || '';
    
    // Upload image if provided
    if (imageFile) {
      const imageRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }
    
    const docData = {
      ...itemData,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return { id: docRef.id, ...docData };
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw error;
  }
};

// Update a gallery item
export const updateGalleryItem = async (itemId, itemData, imageFile) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, itemId);
    const updateData = {
      ...itemData,
      updatedAt: new Date()
    };
    
    // Upload new image if provided
    if (imageFile) {
      // Delete old image if exists
      if (itemData.oldImageUrl) {
        try {
          const oldImageRef = ref(storage, itemData.oldImageUrl);
          await deleteObject(oldImageRef);
        } catch (err) {
          console.warn('Could not delete old image:', err);
        }
      }
      
      const imageRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      updateData.imageUrl = await getDownloadURL(imageRef);
    }
    
    await updateDoc(docRef, updateData);
    return { id: itemId, ...updateData };
  } catch (error) {
    console.error('Error updating gallery item:', error);
    throw error;
  }
};

// Delete a gallery item
export const deleteGalleryItem = async (itemId, imageUrl) => {
  try {
    // Delete image from storage if URL exists
    if (imageUrl) {
      try {
        // Extract the path from the full URL
        // Firebase Storage URLs are like: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile?alt=media
        const urlObj = new URL(imageUrl);
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
        if (pathMatch) {
          const decodedPath = decodeURIComponent(pathMatch[1]);
          const imageRef = ref(storage, decodedPath);
          await deleteObject(imageRef);
        }
      } catch (err) {
        console.warn('Could not delete image from storage:', err);
      }
    }
    
    // Delete document from Firestore
    const docRef = doc(db, COLLECTION_NAME, itemId);
    await deleteDoc(docRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
};

