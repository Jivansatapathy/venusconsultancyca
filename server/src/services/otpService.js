// OTP Service for Admin Login
// Stores OTPs in memory with expiration

import crypto from 'crypto';

const otpStore = new Map(); // email -> { otp, expiresAt, sessionId }

// OTP expiration time: 10 minutes
const OTP_EXPIRATION_MS = 10 * 60 * 1000;

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate a session ID for OTP verification
export const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Store OTP for an email
export const storeOTP = (email, sessionId) => {
  const otp = generateOTP();
  const expiresAt = Date.now() + OTP_EXPIRATION_MS;
  
  otpStore.set(email, {
    otp,
    expiresAt,
    sessionId,
    createdAt: Date.now()
  });
  
  // Clean up expired OTPs periodically
  cleanupExpiredOTPs();
  
  return otp;
};

// Verify OTP
export const verifyOTP = (email, otp, sessionId) => {
  const stored = otpStore.get(email);
  
  if (!stored) {
    return { valid: false, error: 'OTP not found or expired' };
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return { valid: false, error: 'OTP has expired' };
  }
  
  if (stored.sessionId !== sessionId) {
    return { valid: false, error: 'Invalid session' };
  }
  
  if (stored.otp !== otp) {
    return { valid: false, error: 'Invalid OTP' };
  }
  
  // OTP is valid, remove it from store
  otpStore.delete(email);
  
  return { valid: true };
};

// Get OTP info (for debugging)
export const getOTPInfo = (email) => {
  return otpStore.get(email);
};

// Clean up expired OTPs
const cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
};

// Clean up old OTPs periodically (every 5 minutes)
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

