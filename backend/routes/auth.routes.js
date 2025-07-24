import express from "express";
import passport from "../config/passport.js";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

// Email/password auth
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = authController.generateAccessToken({
      id: req.user.id,
      role: req.user.role,
    });

    res.redirect(`http://localhost:3000/social-login?token=${token}`);
  }
);

export default router;
