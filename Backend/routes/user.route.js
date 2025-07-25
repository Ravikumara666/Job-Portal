import express from "express";
import { logout, login, ProfileUpdate, register } from "../controller/userController.js";
import { uploadImage } from "../middleware/MultirPro.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router =express.Router();

// User Register
router.route("/register").post(uploadImage, register);

// User Login
router.route("/login").post( login);

// User Logout
router.route("/logout",).get(logout);

// User Profile Update
router.route("/profile/update").put(uploadImage,isAuthenticated,ProfileUpdate);

export default router;
