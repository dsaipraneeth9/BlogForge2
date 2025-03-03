import asyncHandler from "express-async-handler";
import Notification from "../models/Notifications.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.userId })
    .populate("blog", "title slug")
    .sort("-createdAt")
    .lean();

  // Mark notifications as read
  await Notification.updateMany(
    { user: req.userId, read: false },
    { $set: { read: true } }
  );

  res.status(200).json(notifications);
});

// @desc     Delete a notification
// @route    DELETE /api/notifications/:id
// @access   Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params; // Notification ID
  const notification = await Notification.findOne({ _id: id, user: req.userId });

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found or unauthorized");
  }

  await Notification.findByIdAndDelete(id);
  res.sendStatus(204); // No content, successful deletion
});