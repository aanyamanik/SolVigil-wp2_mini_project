import express from "express";
import {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert
} from "../controllers/alertController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/alerts", getAlerts);
router.get("/alerts/:id", getAlertById);

// Protected alert management endpoints (C-U-D)
router.post("/alerts", requireAuth, createAlert);
router.put("/alerts/:id", requireAuth, updateAlert);
router.delete("/alerts/:id", requireAuth, deleteAlert);

export default router;
