import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB, getDBStatus } from "./config/db.js";
import { authenticate } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { seedAlertsIfEmpty } from "./controllers/alertController.js";

import weatherRoutes from "./routes/weatherRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import advisoryRoutes from "./routes/advisoryRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Configure CORS narrowly for frontend with cookie credentials support
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parsing and cookie parser
app.use(express.json());
app.use(cookieParser());

// Session authentication middleware (attaches req.user if session cookie is valid)
app.use(authenticate);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "SolVigil Heat Intelligence Platform",
    database: getDBStatus() ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api", weatherRoutes);
app.use("/api", alertRoutes);
app.use("/api", authRoutes);
app.use("/api", advisoryRoutes);

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server and initialize database
async function startServer() {
  try {
    await connectDB();
    await seedAlertsIfEmpty();
  } catch (err) {
    console.error(`[Startup Warning] Server starting with database in degraded state: ${err.message}`);
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`☀️  SolVigil Backend Server running on port ${PORT}`);
    console.log(`🌐  API URL: http://localhost:${PORT}/api`);
    console.log(`📡  CORS enabled for: ${CLIENT_URL}`);
    console.log(`====================================================`);
  });
}

startServer();
