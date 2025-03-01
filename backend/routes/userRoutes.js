import express from 'express';
import { forgortPassword, login, logout, register, resetPassword, updateProfile, verifyToken } from '../controllers/userControllers.js';
import multer from 'multer';
import storage from '../middlewares/fileUpload.js';
import { auth } from '../middlewares/auth.js';

let upload = multer({ storage: storage, limits: { fileSize: 1 * 1024 * 1024 } });
let router = express.Router();

router.post("/register", upload.single("photo"), register);
router.post("/login", login);
router.post("/register/author", upload.single("photo"), register); // Optional, if you added this
router.post("/forgot-password", forgortPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/logout", auth, logout);
router.patch("/profile/:id", auth, upload.single("photo"), updateProfile);
router.post("/verify-token", verifyToken); // New endpoint

export default router;