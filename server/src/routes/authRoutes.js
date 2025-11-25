// server/src/routes/authRoutes.js
import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config/index.js";
import Admin from "../models/Admin.js";
import Recruiter from "../models/Recruiter.js";
import RefreshToken from "../models/RefreshToken.js";
import { storeOTP, verifyOTP } from "../services/otpService.js";
import { sendOTPEmail } from "../services/emailService.js";

const router = express.Router();

// Validate that JWT secrets are properly configured
if (!config.ACCESS_SECRET) {
  console.error("❌ CRITICAL SECURITY ERROR: ACCESS_SECRET is not configured!");
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  } else {
    console.error("🚨 Using development fallback - DO NOT USE IN PRODUCTION!");
  }
}

if (!config.REFRESH_SECRET) {
  console.error("❌ CRITICAL SECURITY ERROR: REFRESH_SECRET is not configured!");
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  } else {
    console.error("🚨 Using development fallback - DO NOT USE IN PRODUCTION!");
  }
}

const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || "15m";
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "30", 10);
const REFRESH_TOKEN_MS = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;

function signAccess(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, config.ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });
}

function createRefreshTokenString() {
  return crypto.randomBytes(64).toString("hex");
}

router.post("/login", async (req, res) => {
  try {
    console.log("[auth] /login called");
    const { email, password } = req.body || {};
    console.log("[auth] login attempt:", { email });

    if (!email || !password) {
      console.warn("[auth] missing credentials");
      return res.status(400).json({ message: "Email and password required" });
    }

    // Try to find user in both Admin and Recruiter models
    let user = await Admin.findByEmail(email);
    let userModel = "Admin";
    
    console.log("[auth] Checking Admin model, user found:", !!user);
    
    if (!user) {
      user = await Recruiter.findByEmail(email);
      userModel = "Recruiter";
      console.log("[auth] Checking Recruiter model, user found:", !!user);
    }

    if (!user) {
      console.warn("[auth] user not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    console.log("[auth] User model determined:", userModel);

    // Compare password using the model's comparePassword method
    const ok = await Admin.comparePassword(password, user.password);
    if (!ok) {
      console.warn("[auth] invalid password for", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Debug: Log user details
    console.log("[auth] User found:", { 
      email: user.email, 
      userModel, 
      role: user.role,
      hasRole: !!user.role 
    });

    // If user is Admin, require OTP verification
    // Check if userModel is Admin (all Admin model users should require OTP)
    if (userModel === "Admin") {
      console.log("[auth] Admin login detected, sending OTP");
      
      try {
        // Generate session ID and OTP
        const sessionId = crypto.randomBytes(32).toString('hex');
        const otp = storeOTP(email, sessionId);
        
        // Console log the OTP for debugging
        console.log("[auth] Generated OTP:", otp);
        console.log("[auth] OTP for email:", email);
        console.log("[auth] Session ID:", sessionId);
        
        // Send OTP to pareshlheru@venushiring.com
        console.log("[auth] Attempting to send OTP email...");
        const emailResult = await sendOTPEmail(otp, 'pareshlheru@venushiring.com');
        console.log("[auth] Email result:", emailResult);
        
        if (!emailResult || !emailResult.success) {
          console.error("[auth] Failed to send OTP email:", emailResult?.error || "Unknown error");
          // Still return the OTP requirement so user can see it in console and test
          return res.json({
            requiresOTP: true,
            sessionId,
            message: "OTP has been generated. Check server console for OTP. Email sending may have failed.",
            debugOTP: otp // Include OTP in response for debugging (remove in production)
          });
        }
        
        console.log("[auth] OTP sent successfully to pareshlheru@venushiring.com");
        
        // Return session ID (not access token yet)
        return res.json({
          requiresOTP: true,
          sessionId,
          message: "OTP has been sent to your email. Please verify to complete login."
        });
      } catch (emailError) {
        console.error("[auth] Error in OTP sending process:", emailError);
        console.error("[auth] Error stack:", emailError.stack);
        // Generate OTP anyway for testing
        const sessionId = crypto.randomBytes(32).toString('hex');
        const otp = storeOTP(email, sessionId);
        console.log("[auth] Generated OTP (email failed):", otp);
        return res.json({
          requiresOTP: true,
          sessionId,
          message: "OTP generation completed. Check server console for OTP.",
          debugOTP: otp // Include OTP in response for debugging (remove in production)
        });
      }
    }

    // For non-admin users (Recruiters), proceed with normal login
    // create tokens
    const accessToken = signAccess(user);
    const refreshString = createRefreshTokenString();
    const tokenHash = await bcrypt.hash(refreshString, 10);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);

    const rt = await RefreshToken.create({
      userId: user.id,
      userModel: userModel,
      tokenHash,
      ip: req.ip,
      userAgent: req.get("User-Agent") || "",
      expiresAt,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      path: "/", // Changed from "/api" to "/" to allow cookies on all routes
      maxAge: REFRESH_TOKEN_MS,
    };
    
    res.cookie("vh_rt", refreshString, cookieOptions);
    
    console.log("[auth] login success for", email, "as", user.role);
    console.log("[auth] Cookie options:", cookieOptions);
    console.log("[auth] Response headers:", res.getHeaders());
    
    return res.json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("[auth] login error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Server error" });
  }
});

// OTP Verification endpoint for admin login
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("[auth] /verify-otp called");
    const { email, otp, sessionId } = req.body || {};
    
    if (!email || !otp || !sessionId) {
      return res.status(400).json({ message: "Email, OTP, and session ID are required" });
    }

    // Verify OTP
    const verification = verifyOTP(email, otp, sessionId);
    
    if (!verification.valid) {
      console.warn("[auth] OTP verification failed:", verification.error);
      return res.status(401).json({ message: verification.error || "Invalid or expired OTP" });
    }

    // OTP is valid, find the user and complete login
    const user = await Admin.findByEmail(email);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Invalid user" });
    }

    // Create tokens
    const accessToken = signAccess(user);
    const refreshString = createRefreshTokenString();
    const tokenHash = await bcrypt.hash(refreshString, 10);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);

    const rt = await RefreshToken.create({
      userId: user.id,
      userModel: "Admin",
      tokenHash,
      ip: req.ip,
      userAgent: req.get("User-Agent") || "",
      expiresAt,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MS,
    };
    
    res.cookie("vh_rt", refreshString, cookieOptions);
    
    console.log("[auth] OTP verification successful, login completed for", email);
    
    return res.json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("[auth] OTP verification error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    console.log("[auth] /refresh called");
    console.log("[auth] Request headers:", {
      origin: req.get("origin"),
      referer: req.get("referer"),
      userAgent: req.get("user-agent"),
      cookie: req.get("cookie")
    });
    console.log("[auth] Request cookies:", req.cookies);
    
    const rt = req.cookies?.vh_rt;
    if (!rt) {
      console.warn("[auth] no refresh token cookie");
      return res.status(401).json({ message: "No refresh token" });
    }

    // Find token by comparing plain token with stored hashes
    const matched = await RefreshToken.findByPlainToken(rt);

    if (!matched) {
      console.warn("[auth] no matching refresh token record");
      // Clear the invalid cookie
      res.clearCookie("vh_rt", { path: "/", httpOnly: true, secure: config.NODE_ENV === "production", sameSite: config.NODE_ENV === "production" ? "none" : "lax" });
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const Model = matched.userModel === "Recruiter" ? Recruiter : Admin;
    const user = await Model.findById(matched.userId);
    if (!user) {
      console.warn("[auth] token owner missing user");
      return res.status(401).json({ message: "Invalid token user" });
    }

    // rotate
    const newRtString = createRefreshTokenString();
    const newHash = await bcrypt.hash(newRtString, 10);
    const newRecord = await RefreshToken.create({
      userId: user.id,
      userModel: matched.userModel,
      tokenHash: newHash,
      ip: req.ip,
      userAgent: req.get("User-Agent") || "",
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MS),
      rotatedFrom: matched.id,
    });

    await RefreshToken.revoke(matched.id);

    res.cookie("vh_rt", newRtString, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      path: "/", // Changed from "/api" to "/" to allow cookies on all routes
      maxAge: REFRESH_TOKEN_MS,
    });

    const accessToken = signAccess(user);
    console.log("[auth] refresh success for user", user.email);
    return res.json({ 
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error("[auth] refresh error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    console.log("[auth] /logout called");
    const rt = req.cookies?.vh_rt;
    if (rt) {
      // Find and revoke the token
      const matched = await RefreshToken.findByPlainToken(rt);
      if (matched) {
        await RefreshToken.revoke(matched.id);
      }
    }
    // Clear cookie using the same path it was set on
    res.clearCookie("vh_rt", { path: "/", httpOnly: true, secure: config.NODE_ENV === "production", sameSite: config.NODE_ENV === "production" ? "none" : "lax" });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[auth] logout error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
