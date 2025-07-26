import bcrypt from "bcryptjs";
import { Users } from "../models/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Only secure in production
  sameSite: process.env.NODE_ENV === 'production' ? "Strict" : "Lax", // More relaxed for development
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Handle both freelancer and artist roles for compatibility
    let userRole = role;
    if (role === 'freelancer') {
      userRole = 'artist'; // Map 'freelancer' to 'artist'
    }
    
    // Validate role
    const safeRole = ["client", "artist"].includes(userRole) ? userRole : "client";

    const newUser = await Users.create({
      email,
      password: hashedPassword,
      role: safeRole,
    });

    const payload = { 
      userId: newUser.userId, 
      email: newUser.email,
      role: newUser.role 
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({ 
      user: {
        userId: newUser.userId,
        email: newUser.email,
        role: newUser.role
      }, 
      token: accessToken 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await Users.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { 
      userId: user.userId, 
      email: user.email,
      role: user.role 
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Send refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Send access token in body (frontend will store in memory)
    res.json({ 
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role
      }, 
      token: accessToken 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(403).json({ message: "No refresh token" });

  try {
    const userData = verifyRefreshToken(token);
    const accessToken = generateAccessToken({
      userId: userData.userId,
      email: userData.email,
      role: userData.role,
    });
    res.json({ token: accessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ message: "Refresh token invalid or expired" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export default {
  register,
  login,
  refresh,
  logout
};
