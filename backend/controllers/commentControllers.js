import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js"; // Import User model for role checking
import Notification from "../models/Notifications.js"; // Import Notification model

// @desc     Create a new comment
// @route    POST /api/blog/:slug/comments
// @access   Private (authenticated users only)

export const createComment = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { content } = req.body;
    if (!content) {
      res.status(400);
      throw new Error("Content is required for comment");
    }
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found!");
    }
    let comment = await Comment.create({
      content,
      user: req.userId,
      blog: blog._id,
    });
    blog.comments.push(comment._id);
    await blog.save({ validateBeforeSave: false });
    await comment.populate("user", "username photo role -_id");
  
    // Create notification for the author
    const commenter = await User.findById(req.userId).select("username"); // Fetch commenter’s username
    await Notification.create({
      user: blog.author, // Notify the blog author
      blog: blog._id,
      type: 'comment',
      message: `${commenter.username} commented on your blog "${blog.title}"`,
    });
  
    res.status(201).json(comment);
  });

// @desc     Get all comments for a blog
// @route    GET /api/blog/:slug/comments
// @access   Public (no authentication required)
export const getComments = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug });
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found!");
  }

  // No authentication check here; anyone can view comments
  let comments = await Comment.find({ blog: blog._id })
    .sort("-createdAt")
    .populate("user", "username email photo -_id");

  res.status(200).json(comments);
});

// @desc     Delete a comment
// @route    DELETE /api/blog/:slug/comments/:commentId
// @access   Private (authenticated users only, author or admin)
export const deleteComment = asyncHandler(async (req, res) => {
  const { slug, commentId } = req.params;

  console.log(`Attempting to delete comment with ID ${commentId} from blog slug ${slug}, userId: ${req.userId}, userRole: ${req.userRole}`);

  const blog = await Blog.findOne({ slug });
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // req.userId and req.userRole are set by auth middleware; only authenticated users proceed
  const user = await User.findById(req.userId).select("+role");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Allow deletion only by comment author or admin
  if (user.role !== "admin" && comment.user.toString() !== req.userId.toString()) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  // Remove the comment from the blog's comments array
  blog.comments = blog.comments.filter((id) => id.toString() !== commentId);
  await blog.save({ validateBeforeSave: false });

  // Delete the comment
  await Comment.findByIdAndDelete(commentId);
  console.log(`Comment with ID ${commentId} deleted successfully from blog slug ${slug}`);

  res.sendStatus(204);
});