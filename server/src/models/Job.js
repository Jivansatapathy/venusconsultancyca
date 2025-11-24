// server/src/models/Job.js
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "jobs";

// Create job
const createJob = async (jobData) => {
  const jobRef = db.collection(COLLECTION_NAME).doc();
  const job = {
    ...jobData,
    isActive: jobData.isActive !== undefined ? jobData.isActive : true,
    createdAt: jobData.createdAt || new Date(),
    updatedAt: new Date()
  };
  
  await jobRef.set(job);
  return { id: jobRef.id, ...job };
};

// Find job by ID
const findJobById = async (id) => {
  const doc = await db.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Find all active jobs with filters
const findActiveJobs = async (filters = {}) => {
  try {
    // Start with base query for active jobs
    let query = db.collection(COLLECTION_NAME).where("isActive", "==", true);
    
    // Apply Firestore filters (only for exact matches)
    if (filters.type) {
      query = query.where("type", "==", filters.type);
    }
    
    if (filters.department) {
      query = query.where("department", "==", filters.department);
    }
    
    // Note: Firestore requires composite index for where + orderBy on different fields
    // So we'll fetch and sort in memory to avoid index requirements
    const snapshot = await query.get();
    
    let jobs = snapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamp to Date if needed
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date());
      return { 
        id: doc.id, 
        ...data,
        createdAt: createdAt instanceof Date ? createdAt : new Date(createdAt)
      };
    });
    
    // Sort by createdAt descending in memory
    jobs.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB - dateA;
    });
  
  // Apply in-memory filters for location and search
  if (filters.location) {
    const locationLower = filters.location.toLowerCase();
    jobs = jobs.filter(job => 
      job.location && job.location.toLowerCase().includes(locationLower)
    );
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    jobs = jobs.filter(job => 
      job.title?.toLowerCase().includes(searchLower) ||
      job.description?.toLowerCase().includes(searchLower) ||
      job.department?.toLowerCase().includes(searchLower) ||
      job.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  if (filters.tags && filters.tags.length > 0) {
    const tagArray = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
    jobs = jobs.filter(job => 
      job.tags && tagArray.some(tag => job.tags.includes(tag))
    );
  }
  
  return jobs;
  } catch (error) {
    console.error("Error fetching active jobs:", error);
    // Return empty array on error instead of throwing
    return [];
  }
};

// Find all jobs (admin)
const findAllJobs = async (filters = {}) => {
  try {
    let query = db.collection(COLLECTION_NAME);
    
    if (filters.isActive !== undefined) {
      query = query.where("isActive", "==", filters.isActive);
    }
    
    // Fetch without orderBy to avoid index requirements, then sort in memory
    const snapshot = await query.get();
    let jobs = snapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date());
      return { 
        id: doc.id, 
        ...data,
        createdAt: createdAt instanceof Date ? createdAt : new Date(createdAt)
      };
    });
    
    // Sort by createdAt descending
    jobs.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return jobs;
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    return [];
  }
};

// Update job
const updateJob = async (id, updateData) => {
  const update = {
    ...updateData,
    updatedAt: new Date()
  };
  
  await db.collection(COLLECTION_NAME).doc(id).update(update);
  return findJobById(id);
};

// Delete job
const deleteJob = async (id) => {
  await db.collection(COLLECTION_NAME).doc(id).delete();
};

// Delete all jobs (for seeding)
const deleteAllJobs = async () => {
  const snapshot = await db.collection(COLLECTION_NAME).get();
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
};

const Job = {
  create: createJob,
  findById: findJobById,
  findActive: findActiveJobs,
  findAll: findAllJobs,
  update: updateJob,
  delete: deleteJob,
  deleteAll: deleteAllJobs
};

export default Job;
