import passport from "../config/passport.js";

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    const token = authController.generateAccessToken({id: req.user.id, role: req.user.role});
    res.redirect(`http://localhost:/social-login?token=${token}`);

})

module.exports = router;