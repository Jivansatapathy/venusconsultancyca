// server/src/routes/jobRoutes.js
import express from "express";
import Job from "../models/Job.js";
import { requireAuth, requireRole, authAndRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route: Get all active jobs with search and filters
router.get("/", async (req, res) => {
  try {
    const { 
      search, 
      type, 
      location, 
      department, 
      tags, 
      page = 1, 
      limit = 10 
    } = req.query;

    const filters = {
      search,
      type,
      location,
      department,
      tags: tags ? (Array.isArray(tags) ? tags : [tags]) : undefined
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
    const allJobs = await Job.findActive(filters);
    const total = allJobs.length;
    
    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const jobs = allJobs.slice(skip, skip + parseInt(limit));

    res.json({
      jobs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: jobs.length,
        totalJobs: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public route: Get single job details
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin only: Create job
router.post("/", authAndRole("admin"), async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin only: Update job
router.put("/:id", authAndRole("admin"), async (req, res) => {
  try {
    const job = await Job.update(req.params.id, req.body);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin only: Delete job
router.delete("/:id", authAndRole("admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    await Job.delete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin/Recruiter: Get all jobs (including inactive)
router.get("/admin/all", authAndRole("admin", "recruiter"), async (req, res) => {
  try {
    const filters = {};
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === "true";
    }
    const jobs = await Job.findAll(filters);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
