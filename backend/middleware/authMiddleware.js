import { Session } from "../models/Session.js";
import { User } from "../models/User.js";

/**
 * Middleware to authenticate requests via HttpOnly session cookie.
 */
export async function authenticate(req, res, next) {
  try {
    const sessionId = req.cookies?.solvigil_session;

    if (!sessionId) {
      req.user = null;
      return next();
    }

    const session = await Session.findOne({
      sessionId,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      req.user = null;
      return next();
    }

    const user = await User.findById(session.userId).select("-passwordHash -salt");
    if (!user) {
      req.user = null;
      return next();
    }

    req.user = user;
    req.sessionId = sessionId;
    next();
  } catch (err) {
    console.error("[Auth Middleware Error]:", err.message);
    req.user = null;
    next();
  }
}

/**
 * Protect routes - reject unauthenticated requests.
 */
export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please sign in to access this resource."
    });
  }
  next();
}
