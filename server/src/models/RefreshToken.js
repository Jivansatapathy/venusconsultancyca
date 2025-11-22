// server/src/models/RefreshToken.js
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "refreshTokens";

// Create refresh token
const createRefreshToken = async (tokenData) => {
  const tokenRef = db.collection(COLLECTION_NAME).doc();
  const token = {
    userId: tokenData.userId,
    tokenHash: tokenData.tokenHash,
    userModel: tokenData.userModel, // "Admin" or "Recruiter"
    userAgent: tokenData.userAgent || "",
    ip: tokenData.ip || "",
    createdAt: tokenData.createdAt || new Date(),
    expiresAt: tokenData.expiresAt,
    rotatedFrom: tokenData.rotatedFrom || null,
    revoked: tokenData.revoked || false
  };
  
  await tokenRef.set(token);
  return { id: tokenRef.id, ...token };
};

// Find token by comparing plain token with stored hash
// Note: This requires checking all tokens, so it's not ideal for large scale
const findTokenByPlainToken = async (plainToken) => {
  const snapshot = await db.collection(COLLECTION_NAME)
    .where("revoked", "==", false)
    .limit(200)
    .get();
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    // Compare plain token with stored hash
    const bcrypt = await import("bcryptjs");
    if (await bcrypt.default.compare(plainToken, data.tokenHash)) {
      // Check if token is expired
      const expiresAt = data.expiresAt?.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt);
      if (expiresAt && expiresAt < new Date()) {
        return null;
      }
      return { id: doc.id, ...data };
    }
  }
  
  return null;
};

// Legacy method for backward compatibility
const findTokenByHash = async (tokenHash) => {
  // This method is not useful since we store hashes, not plain tokens
  // Use findTokenByPlainToken instead
  return null;
};

// Find tokens by user ID
const findTokensByUserId = async (userId) => {
  const snapshot = await db.collection(COLLECTION_NAME)
    .where("userId", "==", userId)
    .where("revoked", "==", false)
    .get();
  
  const now = new Date();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(token => {
      if (token.expiresAt) {
        const expiresAt = token.expiresAt.toDate ? token.expiresAt.toDate() : new Date(token.expiresAt);
        return expiresAt > now;
      }
      return true;
    });
};

// Revoke token
const revokeToken = async (id) => {
  await db.collection(COLLECTION_NAME).doc(id).update({
    revoked: true,
    updatedAt: new Date()
  });
};

// Revoke all tokens for a user
const revokeAllUserTokens = async (userId) => {
  const snapshot = await db.collection(COLLECTION_NAME)
    .where("userId", "==", userId)
    .where("revoked", "==", false)
    .get();
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      revoked: true,
      updatedAt: new Date()
    });
  });
  await batch.commit();
};

// Delete expired tokens (cleanup)
const deleteExpiredTokens = async () => {
  const now = new Date();
  const snapshot = await db.collection(COLLECTION_NAME)
    .where("expiresAt", "<", now)
    .get();
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  
  return snapshot.size;
};

const RefreshToken = {
  create: createRefreshToken,
  findByHash: findTokenByHash,
  findByPlainToken: findTokenByPlainToken,
  findByUserId: findTokensByUserId,
  revoke: revokeToken,
  revokeAllForUser: revokeAllUserTokens,
  deleteExpired: deleteExpiredTokens
};

export default RefreshToken;
