// server/src/routes/blogRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import Blog from "../models/Blog.js";
import { authAndRole } from "../middleware/authMiddleware.js";
import { storage } from "../config/firebase.js";

const router = express.Router();

// Configure multer for memory storage (we'll upload directly to Firebase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for blog images
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'), false);
    }
  }
});

// Helper function to upload image to Firebase Storage
const uploadImageToStorage = async (file, folder = 'blogs') => {
  try {
    // Get bucket - use explicit bucket name
    const bucket = storage.bucket('venusglobal-847ea');
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `${folder}/${uniqueId}${path.extname(file.originalname)}`;
    const fileUpload = bucket.file(fileName);
    
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    
    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Error uploading to Firebase Storage:', error);
        reject(error);
      });
      
      stream.on('finish', async () => {
        try {
          // Set file to be publicly readable
          await fileUpload.makePublic();
          
          // Construct the public URL
          // Firebase Storage public URL format: https://storage.googleapis.com/{bucket}/{file}
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          
          console.log('File uploaded successfully:', publicUrl);
          resolve(publicUrl);
        } catch (makePublicError) {
          console.error('Error making file public:', makePublicError);
          // If makePublic fails, try to get a signed URL as fallback
          try {
            const [url] = await fileUpload.getSignedUrl({
              action: 'read',
              expires: '03-09-2491' // Far future date
            });
            console.log('Using signed URL as fallback:', url);
            resolve(url);
          } catch (signedUrlError) {
            console.error('Error getting signed URL:', signedUrlError);
            // Last resort: construct the URL anyway
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            console.log('Using constructed URL:', publicUrl);
            resolve(publicUrl);
          }
        }
      });
      
      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
    throw error;
  }
};

// Helper function to delete image from Firebase Storage
const deleteImageFromStorage = async (imageUrl) => {
  try {
    if (!imageUrl) {
      return; // No image URL provided
    }
    
    // Get bucket - use explicit bucket name
    const bucket = storage.bucket('venusglobal-847ea');
    
    // Extract file path from URL
    // Handle different URL formats
    let fileName = '';
    
    if (imageUrl.includes('storage.googleapis.com')) {
      // Format: https://storage.googleapis.com/{bucket}/{file}
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part.includes('venusglobal-847ea'));
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        fileName = urlParts.slice(bucketIndex + 1).join('/');
      }
    } else if (imageUrl.includes('firebasestorage.googleapis.com')) {
      // Format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedFile}?alt=media
      const urlParts = imageUrl.split('/');
      const oIndex = urlParts.indexOf('o');
      if (oIndex !== -1 && urlParts[oIndex + 1]) {
        // Decode the file path (URL encoded)
        fileName = decodeURIComponent(urlParts[oIndex + 1].split('?')[0]);
      }
    } else if (imageUrl.startsWith('gs://')) {
      // Format: gs://{bucket}/{file}
      fileName = imageUrl.replace('gs://venusglobal-847ea/', '');
    } else {
      // Assume it's already a file path
      fileName = imageUrl;
    }
    
    if (!fileName) {
      console.warn('Could not extract file name from URL:', imageUrl);
      return;
    }
    
    await bucket.file(fileName).delete();
    console.log(`Deleted image: ${fileName}`);
  } catch (error) {
    console.error('Error deleting image from Firebase Storage:', error);
    // Don't throw - image deletion failure shouldn't break the operation
  }
};

// Public route: Get all published blogs
router.get("/", async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const blogs = await Blog.findAll({ published: true });
    
    // Apply pagination if provided
    let result = blogs;
    if (offset) {
      result = blogs.slice(parseInt(offset));
    }
    if (limit) {
      result = result.slice(0, parseInt(limit));
    }
    
    res.json({
      blogs: result,
      total: blogs.length
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: err.message });
  }
});

// Public route: Get blog by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findBySlug(slug);
    
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    
    res.json(blog);
  } catch (err) {
    console.error("Error fetching blog by slug:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin only: Get all blogs (including unpublished)
router.get("/admin/all", authAndRole("admin"), async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching all blogs:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin only: Get blog by ID
router.get("/:id", authAndRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    
    res.json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ error: err.message });
  }
});

// Error handler for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum file size is 10MB.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Admin only: Create new blog
router.post("/", authAndRole("admin"), upload.single("image"), handleMulterError, async (req, res) => {
  try {
    console.log("Blog creation request received");
    console.log("Body:", req.body);
    console.log("File:", req.file ? "File present" : "No file");
    
    const { title, content, excerpt, authorId, authorName, published, tags } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    
    // Generate slug from title
    let slug = Blog.generateSlug(title);
    
    // Check if slug exists and make it unique if needed
    let slugExists = await Blog.slugExists(slug);
    let counter = 1;
    while (slugExists) {
      slug = `${Blog.generateSlug(title)}-${counter}`;
      slugExists = await Blog.slugExists(slug);
      counter++;
    }
    
    // Upload image to Firebase Storage if provided
    let imageUrl = null;
    if (req.file) {
      try {
        console.log("Uploading image to Firebase Storage...");
        imageUrl = await uploadImageToStorage(req.file);
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({ error: `Failed to upload image: ${uploadError.message}` });
      }
    }
    
    // Parse tags if provided as string
    let tagsArray = [];
    if (tags) {
      tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(t => t) : tags;
    }
    
    const blogData = {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      imageUrl,
      authorId: authorId || req.user.id,
      authorName: authorName || req.user.name || 'Admin',
      published: published === 'true' || published === true,
      tags: tagsArray
    };
    
    console.log("Creating blog with data:", blogData);
    const blog = await Blog.create(blogData);
    console.log("Blog created successfully:", blog.id);
    
    res.status(201).json({
      message: "Blog created successfully",
      blog
    });
  } catch (err) {
    console.error("Error creating blog:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// Admin only: Update blog
router.put("/:id", authAndRole("admin"), upload.single("image"), handleMulterError, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, published, tags, deleteImage } = req.body;
    
    // Get existing blog
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    
    const updateData = {};
    
    // Update title and slug if title changed
    if (title && title !== existingBlog.title) {
      updateData.title = title;
      let slug = Blog.generateSlug(title);
      let slugExists = await Blog.slugExists(slug, id);
      let counter = 1;
      while (slugExists) {
        slug = `${Blog.generateSlug(title)}-${counter}`;
        slugExists = await Blog.slugExists(slug, id);
        counter++;
      }
      updateData.slug = slug;
    }
    
    if (content) updateData.content = content;
    if (excerpt) updateData.excerpt = excerpt;
    if (published !== undefined) updateData.published = published === 'true' || published === true;
    
    // Handle tags
    if (tags !== undefined) {
      updateData.tags = typeof tags === 'string' 
        ? tags.split(',').map(t => t.trim()).filter(t => t) 
        : tags;
    }
    
    // Handle image upload/delete
    if (deleteImage === 'true' || deleteImage === true) {
      // Delete old image from storage
      if (existingBlog.imageUrl) {
        await deleteImageFromStorage(existingBlog.imageUrl);
      }
      updateData.imageUrl = null;
    } else if (req.file) {
      // Delete old image if exists
      if (existingBlog.imageUrl) {
        await deleteImageFromStorage(existingBlog.imageUrl);
      }
      // Upload new image
      updateData.imageUrl = await uploadImageToStorage(req.file);
    }
    
    const updatedBlog = await Blog.update(id, updateData);
    res.json({
      message: "Blog updated successfully",
      blog: updatedBlog
    });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin only: Delete blog
router.delete("/:id", authAndRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get blog to delete image
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    
    // Delete image from storage
    if (blog.imageUrl) {
      await deleteImageFromStorage(blog.imageUrl);
    }
    
    // Delete blog
    await Blog.delete(id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

