// server/src/models/Blog.js
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "blogs";

// Create a new blog post
const createBlog = async (blogData) => {
  try {
    const blogRef = db.collection(COLLECTION_NAME).doc();
    const blog = {
      ...blogData,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      published: blogData.published || false
    };
    
    await blogRef.set(blog);
    return { id: blogRef.id, ...blog };
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

// Get all blogs (with optional filters)
const findAllBlogs = async (filters = {}) => {
  try {
    let query = db.collection(COLLECTION_NAME);
    
    if (filters.published !== undefined) {
      query = query.where("published", "==", filters.published);
    }
    
    if (filters.authorId) {
      query = query.where("authorId", "==", filters.authorId);
    }
    
    const snapshot = await query.get();
    let blogs = snapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date());
      const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || new Date());
      return {
        id: doc.id,
        ...data,
        createdAt: createdAt instanceof Date ? createdAt : new Date(createdAt),
        updatedAt: updatedAt instanceof Date ? updatedAt : new Date(updatedAt)
      };
    });
    
    // Sort by createdAt descending
    blogs.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Get blog by ID
const findBlogById = async (id) => {
  try {
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data();
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date());
    const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || new Date());
    
    return {
      id: doc.id,
      ...data,
      createdAt: createdAt instanceof Date ? createdAt : new Date(createdAt),
      updatedAt: updatedAt instanceof Date ? updatedAt : new Date(updatedAt)
    };
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    throw error;
  }
};

// Get blog by slug
const findBlogBySlug = async (slug) => {
  try {
    const snapshot = await db.collection(COLLECTION_NAME)
      .where("slug", "==", slug)
      .where("published", "==", true)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date());
    const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || new Date());
    
    // Increment views
    await db.collection(COLLECTION_NAME).doc(doc.id).update({
      views: (data.views || 0) + 1,
      updatedAt: new Date()
    });
    
    return {
      id: doc.id,
      ...data,
      views: (data.views || 0) + 1,
      createdAt: createdAt instanceof Date ? createdAt : new Date(createdAt),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    throw error;
  }
};

// Update blog
const updateBlog = async (id, updateData) => {
  try {
    const blogRef = db.collection(COLLECTION_NAME).doc(id);
    const update = {
      ...updateData,
      updatedAt: new Date()
    };
    
    await blogRef.update(update);
    const updatedDoc = await blogRef.get();
    const data = updatedDoc.data();
    
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date());
    const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || new Date());
    
    return {
      id: updatedDoc.id,
      ...data,
      createdAt: createdAt instanceof Date ? createdAt : new Date(createdAt),
      updatedAt: updatedAt instanceof Date ? updatedAt : new Date(updatedAt)
    };
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

// Delete blog
const deleteBlog = async (id) => {
  try {
    await db.collection(COLLECTION_NAME).doc(id).delete();
    return true;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

// Check if slug exists
const slugExists = async (slug, excludeId = null) => {
  try {
    let query = db.collection(COLLECTION_NAME).where("slug", "==", slug);
    const snapshot = await query.get();
    
    if (excludeId) {
      return snapshot.docs.some(doc => doc.id !== excludeId);
    }
    
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking slug:", error);
    throw error;
  }
};

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const Blog = {
  create: createBlog,
  findAll: findAllBlogs,
  findById: findBlogById,
  findBySlug: findBlogBySlug,
  update: updateBlog,
  delete: deleteBlog,
  slugExists: slugExists,
  generateSlug: generateSlug
};

export default Blog;

