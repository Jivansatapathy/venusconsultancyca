// server/src/routes/candidateRoutes.js
import express from "express";
import Candidate from "../models/Candidate.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Create candidate — ADMIN only
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/*
  GET /api/candidates
  - accessible to authenticated recruiters and admins
*/
router.get("/", requireAuth, requireRole("admin", "recruiter"), async (req, res) => {
  try {
    // existing filter/pagination code (unchanged)
    const {
      q = "",
      location = "",
      skills = "",
      expMin = 0,
      expMax = 100,
      page = 1,
      limit = 8,
      sort = "relevance",
      remote = "any",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.min(50, parseInt(limit, 10) || 8);

    const filters = {};

    if (q && q.trim()) {
      filters.search = q.trim();
    }

    if (location && location.trim()) {
      const loc = location.trim();
      if (/remote/i.test(loc)) filters.remote = true;
      else filters.location = loc;
    } else if (remote === "remote") filters.remote = true;
    else if (remote === "onsite") filters.remote = false;

    if (skills && skills.trim()) {
      const skillList = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (skillList.length) filters.skills = skillList;
    }

    // Experience filtering will be done in-memory
    const minExp = Number(expMin) || 0;
    const maxExp = Number(expMax) || 100;
    filters.experienceMin = minExp;
    filters.experienceMax = maxExp;

    let sortObj = {};
    if (sort === "latest") sortObj = { createdAt: -1 };
    else if (sort === "exp-desc") sortObj = { experience: -1 };
    else if (sort === "exp-asc") sortObj = { experience: 1 };
    else sortObj = { createdAt: -1 };

    let allCandidates = await Candidate.find(filters);
    
    // Apply experience filter in-memory
    if (filters.experienceMin !== undefined || filters.experienceMax !== undefined) {
      allCandidates = allCandidates.filter(c => {
        const exp = c.experience || 0;
        return exp >= filters.experienceMin && exp <= filters.experienceMax;
      });
    }
    
    const total = allCandidates.length;
    
    // Sort candidates
    allCandidates.sort((a, b) => {
      if (sort === "latest") {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      } else if (sort === "exp-desc") {
        return (b.experience || 0) - (a.experience || 0);
      } else if (sort === "exp-asc") {
        return (a.experience || 0) - (b.experience || 0);
      }
      return 0;
    });
    
    // Apply pagination
    const skip = (pageNum - 1) * pageLimit;
    let candidates = allCandidates.slice(skip, skip + pageLimit);
    
    // Remove sensitive fields
    candidates = candidates.map(c => {
      const { personalEmail, ...rest } = c;
      return rest;
    });

    const pages = Math.max(1, Math.ceil(total / pageLimit));

    res.json({
      candidates,
      total,
      page: pageNum,
      pages,
    });
  } catch (err) {
    console.error("GET /api/candidates error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
