const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET || 'accessSecret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshSecret';

const generateAccessToken = (payload) => jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (payload) => jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
