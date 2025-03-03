import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { getNotifications, deleteNotification } from "../controllers/notificationControllers.js"; // Import new function

const router = Router();

// @desc     Get notifications for the current user
// @route    GET /api/notifications
// @access   Private
router.get("/", auth, getNotifications);

// @desc     Delete a specific notification
// @route    DELETE /api/notifications/:id
// @access   Private
router.delete("/:id", auth, deleteNotification);

export default router;