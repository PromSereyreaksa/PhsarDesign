import express from "express";
import { register, login, refresh, logout, requestOTP, verifyOTP, changePassword } from "../controllers/auth.controller.js";
import { generateAccessToken } from "../utils/jwt.js";
import { validateRegistration, validateLogin } from "../middlewares/security.middleware.js";

const router = express.Router();

// Email/password auth with validation
router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", changePassword);

// Google OAuth routes - only enable if environment variables are set
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  try {
    const { default: passport } = await import("../config/passport.js");
    
    router.get(
      "/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    router.get(
      "/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      (req, res) => {
        const token = generateAccessToken({
          userId: req.user.userId,
          email: req.user.email,
          role: req.user.role,
        });

        res.redirect(`http://localhost:3000/social-login?token=${token}`);
      }
    );
  } catch (error) {
    console.warn("Google OAuth configuration failed:", error.message);
    console.warn("Google OAuth routes disabled. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable.");
  }
} else {
  console.info("Google OAuth disabled. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable Google authentication.");
}

export default router;
