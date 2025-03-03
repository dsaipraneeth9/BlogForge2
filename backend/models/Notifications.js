import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, // The author receiving the notification
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    required: true, // The blog the notification is about
  },
  type: {
    type: String,
    enum: ['like', 'comment'],
    required: true, // Type of notification (like or comment)
  },
  message: {
    type: String,
    required: true, // Human-readable message (e.g., "User X liked your blog")
  },
  read: {
    type: Boolean,
    default: false, // Track if the notification has been read
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ user: 1, createdAt: -1 }); // Index for performance when fetching by user and sorting by date

export default model('Notification', notificationSchema);