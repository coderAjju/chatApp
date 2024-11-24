import express from 'express';
import { logout,login, signup, updateProfile, checkAuth } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendMessage,getMessages, getUsersForSideBar } from '../controller/message.controller.js';
const router = express.Router();

router.get("/users",protectRoute, getUsersForSideBar)

router.get("/:id",protectRoute, getMessages)

router.post("/send/:id",protectRoute,sendMessage)


export default router;  