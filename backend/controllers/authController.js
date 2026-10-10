import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
import { hashPassword, verifyPassword, generateSessionId } from "../utils/cryptoUtils.js";

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Helper to set secure HttpOnly session cookie
 */
function setSessionCookie(res, sessionId) {
  res.cookie("solvigil_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_MS,
    path: "/"
  });
}

/**
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Input validations
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, email, password, confirmPassword)."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters in length."
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match."
      });
    }

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address is already registered."
      });
    }

    // Hash password with salt using Node.js crypto
    const { salt, hash } = hashPassword(password);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hash,
      salt: salt,
      role: "user"
    });

    await newUser.save();

    // Create persistent session in MongoDB
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

    await Session.create({
      sessionId,
      userId: newUser._id,
      expiresAt
    });

    // Send HttpOnly cookie
    setSessionCookie(res, sessionId);

    res.status(201).json({
      success: true,
      message: "Registration successful. You are now logged in.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password credentials."
      });
    }

    // Verify hashed password
    const isMatch = verifyPassword(password, user.salt, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password credentials."
      });
    }

    // Create session in MongoDB
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

    await Session.create({
      sessionId,
      userId: user._id,
      expiresAt
    });

    // Send HttpOnly cookie
    setSessionCookie(res, sessionId);

    res.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Return currently authenticated user profile from active session
 */
export async function getMe(req, res) {
  if (!req.user) {
    return res.status(200).json({
      success: true,
      authenticated: false,
      user: null
    });
  }

  res.json({
    success: true,
    authenticated: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
}

/**
 * POST /api/auth/logout
 * Destroy server session and clear cookie
 */
export async function logout(req, res, next) {
  try {
    const sessionId = req.cookies?.solvigil_session;
    if (sessionId) {
      await Session.deleteOne({ sessionId });
    }

    res.clearCookie("solvigil_session", {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });

    res.json({
      success: true,
      message: "Successfully logged out."
    });
  } catch (err) {
    next(err);
  }
}
