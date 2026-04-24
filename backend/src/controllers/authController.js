import { User } from "../models/User.js";
import { sendWelcomeEmail } from "../utils/emailService.js";
import { generateToken } from "../utils/generateToken.js";

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const trimmedName = name?.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!trimmedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name: trimmedName, email: normalizedEmail, password });
    void sendWelcomeEmail(user);

    return res.status(201).json({
      message: "Account created successfully",
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }

    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0];
      return res.status(400).json({ message: firstError?.message || "Invalid signup data" });
    }

    return res.status(500).json({ message: "Failed to create account" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login" });
  }
};

export const getProfile = async (req, res) => {
  return res.status(200).json({ user: req.user });
};
