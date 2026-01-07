import express from "express";
import { login, logout, register, updateProfile, getMe } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// Public routes (no authentication required)
router.route("/register").post(register);
router.route("/login").post(login);

// Protected routes (authentication required)
router.route("/logout").get(isAuthenticated, logout);
router.route("/profile/update").put(isAuthenticated, updateProfile);
router.route("/me").get(isAuthenticated, getMe);

export default router;