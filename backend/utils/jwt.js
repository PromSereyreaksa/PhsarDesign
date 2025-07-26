import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || 'accessSecret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshSecret';

export const generateAccessToken = (payload) => jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
export const generateRefreshToken = (payload) => jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

// For backward compatibility, also export a general verifyToken function
export const verifyToken = (token) => jwt.verify(token, ACCESS_SECRET);

export const generateToken = (payload) => jwt.sign(payload, ACCESS_SECRET, { 
  expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
});

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyToken,
  generateToken
};
