// server/src/models/Candidate.js
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "candidates";

// Create candidate
const createCandidate = async (candidateData) => {
  const candidateRef = db.collection(COLLECTION_NAME).doc();
  const candidate = {
    name: candidateData.name || "",
    title: candidateData.title || "",
    email: candidateData.email || "",
    personalEmail: candidateData.personalEmail || "",
    summary: candidateData.summary || "",
    location: candidateData.location || "",
    skills: candidateData.skills || [],
    experience: candidateData.experience || 0,
    avatar: candidateData.avatar || "",
    remote: candidateData.remote || false,
    appliedJob: candidateData.appliedJob || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await candidateRef.set(candidate);
  return { id: candidateRef.id, ...candidate };
};

// Find candidate by ID
const findCandidateById = async (id) => {
  const doc = await db.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Find candidates with filters
const findCandidates = async (filters = {}) => {
  let query = db.collection(COLLECTION_NAME);
  
  if (filters.appliedJob) {
    query = query.where("appliedJob", "==", filters.appliedJob);
  }
  
  if (filters.remote !== undefined) {
    query = query.where("remote", "==", filters.remote);
  }
  
  const snapshot = await query.orderBy("createdAt", "desc").get();
  let candidates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Apply in-memory filters for search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    candidates = candidates.filter(candidate => 
      candidate.name?.toLowerCase().includes(searchLower) ||
      candidate.title?.toLowerCase().includes(searchLower) ||
      candidate.summary?.toLowerCase().includes(searchLower) ||
      candidate.skills?.some(skill => skill.toLowerCase().includes(searchLower))
    );
  }
  
  if (filters.location && filters.remote === undefined) {
    const locationLower = filters.location.toLowerCase();
    candidates = candidates.filter(candidate => 
      candidate.location && candidate.location.toLowerCase().includes(locationLower)
    );
  }
  
  if (filters.skills && filters.skills.length > 0) {
    const skillArray = Array.isArray(filters.skills) ? filters.skills : [filters.skills];
    candidates = candidates.filter(candidate => 
      candidate.skills && skillArray.some(skill => candidate.skills.includes(skill))
    );
  }
  
  return candidates;
};

// Update candidate
const updateCandidate = async (id, updateData) => {
  const update = {
    ...updateData,
    updatedAt: new Date()
  };
  
  await db.collection(COLLECTION_NAME).doc(id).update(update);
  return findCandidateById(id);
};

// Delete candidate
const deleteCandidate = async (id) => {
  await db.collection(COLLECTION_NAME).doc(id).delete();
};

const Candidate = {
  create: createCandidate,
  findById: findCandidateById,
  find: findCandidates,
  update: updateCandidate,
  delete: deleteCandidate
};

export default Candidate;
