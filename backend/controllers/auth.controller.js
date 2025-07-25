const bcrypt = require("bcrypt");
const { User } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

exports.register = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const safeRole = ["user", "client", "freelancer"].includes(role)
      ? role
      : "user";

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: safeRole,
    });

    const payload = { id: newUser.id, role: newUser.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({ user: newUser, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Send refresh token as HttpOnly cookie
  res.cookie("refreshToken", refreshToken, cookieOptions);

  // Send access token in body (frontend will store in memory)
  res.json({ user, accessToken });
};

exports.refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(403).json({ message: "No refresh token" });

  try {
    const userData = verifyRefreshToken(token);
    const accessToken = generateAccessToken({
      id: userData.id,
      role: userData.role,
    });
    res.json({ accessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ message: "Refresh token invalid or expired" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
