import bcrypt from "bcryptjs";
import randomString from "randomstring";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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

const otpCache = {};

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

export const requestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = randomString.generate({ length: 4, charset: 'numeric' });
    otpCache[email] = otp;

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      text: 'Your OTP for verification is: ' + otp
    };

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Disable certificate validation
      }
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred:', error);
      } else {
        console.log('OTP email sent successfully', info.response);
      }
    });

    // Store OTP in cache for 5 minutes
    res.cookie('otpCache', otpCache, { maxAge: 30000, httpOnly: true });
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.log('Error in requestOTP:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpCache[email];
  try {
    // Check if email exists in the cache
    if (!otpCache.hasOwnProperty(email)) {
      return res.status(400).json({ success: false, message: 'Email not found' });
    }

    if (storedOtp == otp) {
      // OTP is valid, remove from cache
      delete otpCache[email];

      // Update emailVerification in database to true
      const updateEmailVerification = await Users.update({
        emailVerification: true,
      }, {
        where: { email: email }
      });

      return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.log('Error in verifyOTP:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    // Check if the new password is valid
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password should be at least 6 characters long' });
    }

    // Check if email exists in the database
    const user = await Users.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email not found'});
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatePassword = await Users.update({
      password: hashedPassword,
    }, {
      where: { email: email }
    });

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.log('Error in changePassword:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
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