import express from "express";
import {
  register,
  login,
  getMe,
  logout
} from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", getMe);
router.post("/auth/logout", logout);

export default router;
