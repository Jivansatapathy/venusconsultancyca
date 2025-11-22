import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";   // ✅ this must exist

const router = express.Router();

// Register Admin
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const admin = await Admin.create({ email, password });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("❌ Error in /register:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login Admin (kept same as before)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findByEmail(email);
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await Admin.comparePassword(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
