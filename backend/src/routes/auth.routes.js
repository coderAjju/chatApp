import express from 'express';
import { logout,login, signup, updateProfile, checkAuth } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile",protectRoute,updateProfile)

router.get("/check-auth", checkAuth);

export default router;  