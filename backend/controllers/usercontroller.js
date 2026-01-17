const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// ================= TOKEN =================
const createToken = (id) => {
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    email = email.toLowerCase().trim();

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // 🔒 VERY IMPORTANT SAFETY CHECK
    if (!user.password || typeof user.password !== "string") {
      console.error("Corrupted password for user:", email);
      return res.status(500).json({
        success: false,
        message: "User password corrupted. Please re-register.",
      });
    }

    // bcrypt expects hashed password starting with $2
    if (!user.password.startsWith("$2")) {
      console.error("Password is not hashed for user:", email);
      return res.status(500).json({
        success: false,
        message: "Password not secured. Please re-register.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    email = email.toLowerCase().trim();

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

module.exports = { loginUser, registerUser };
