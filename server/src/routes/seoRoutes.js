// server/src/routes/seoRoutes.js
import express from "express";
import SEO from "../models/SEO.js";
import { authAndRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route: Get main SEO content
router.get("/", async (req, res) => {
  try {
    const seoContent = await SEO.get();
    res.json(seoContent);
  } catch (err) {
    console.error("Error fetching SEO content:", err);
    res.status(500).json({ error: err.message });
  }
});

// Public route: Get SEO content for a specific page
router.get("/page/:path", async (req, res) => {
  try {
    const { path } = req.params;
    const decodedPath = decodeURIComponent(path);
    const seoContent = await SEO.getByPage(decodedPath);
    res.json(seoContent);
  } catch (err) {
    console.error("Error fetching page SEO:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin only: Get all page-specific SEO entries
router.get("/pages", authAndRole("admin"), async (req, res) => {
  try {
    const pageSEOList = await SEO.getAllPages();
    res.json(pageSEOList);
  } catch (err) {
    console.error("Error fetching all page SEO:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin only: Update main SEO content
router.put("/", authAndRole("admin"), async (req, res) => {
  try {
    const seoData = {
      ...req.body,
      updatedBy: req.user.id // Track who made the change
    };
    
    const updatedSEO = await SEO.upsert(seoData);
    res.json({
      message: "SEO content updated successfully",
      data: updatedSEO
    });
  } catch (err) {
    console.error("Error updating SEO content:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin only: Create or update page-specific SEO
router.put("/page/:path", authAndRole("admin"), async (req, res) => {
  try {
    const { path } = req.params;
    const decodedPath = decodeURIComponent(path);
    const seoData = {
      ...req.body,
      updatedBy: req.user.id
    };
    
    const updatedSEO = await SEO.upsertPage(decodedPath, seoData);
    res.json({
      message: "Page SEO content updated successfully",
      data: updatedSEO
    });
  } catch (err) {
    console.error("Error updating page SEO:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin only: Delete page-specific SEO
router.delete("/page/:path", authAndRole("admin"), async (req, res) => {
  try {
    const { path } = req.params;
    const decodedPath = decodeURIComponent(path);
    await SEO.deletePage(decodedPath);
    res.json({ message: "Page SEO content deleted successfully" });
  } catch (err) {
    console.error("Error deleting page SEO:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

