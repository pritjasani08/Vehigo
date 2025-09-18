const User = require("../models/auth.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Helper: Generate JWT
const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

// Helper: Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in production
  sameSite: "Lax",
  maxAge: 24 * 60 * 60 * 1000,
};

// Register
const registerController = async (req, res) => {
  const { username, email, password, number, address } = req.body;

  try {
    if (!username || !email || !password || !number) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists!", success: false });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      number,
      address: address || "",
    });

    const token = generateToken(newUser);
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating new user:", error.message);
    return res
      .status(500)
      .json({ message: "Something went wrong!", success: false });
  }
};

// Login
const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User doesn't exist!", success: false });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect!", success: false });
    }

    const token = generateToken(user);
    res.cookie("token", token, cookieOptions);

    return res
      .status(200)
      .json({ message: "Login successfully", success: true, user });
  } catch (error) {
    console.error("Error logging in:", error.message);
    return res
      .status(500)
      .json({ message: "Something went wrong!", success: false });
  }
};

// Logout
const logoutController = async (req, res) => {
  try {
    res.cookie("token", "", { ...cookieOptions, maxAge: 0 });
    return res
      .status(200)
      .json({ message: "Logout successfully!", success: true });
  } catch (error) {
    console.error("Error logging out:", error.message);
    return res
      .status(500)
      .json({ message: "Something went wrong!", success: false });
  }
};

// Forgot Password (send reset link)
const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${
      process.env.CLIENT_URL || "http://localhost:4000"
    }/auth/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    return res
      .status(200)
      .json({ message: "Password reset link sent to email", success: true });
  } catch (error) {
    console.error("Error in forgot password:", error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Reset Password
const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password reset successful!", success: true });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
};
