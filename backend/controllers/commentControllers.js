import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js"; // Import User model for role checking

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
        blog: blog._id
    });
    blog.comments.push(comment._id);
    await blog.save({ validateBeforeSave: false });
    await comment.populate("user", "username photo role -_id");
    res.status(201).json(comment);
});

export const getComments = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found!");
    }
    let comments = await Comment.find({ blog: blog._id }).sort("-createdAt").populate("user", "username email photo -_id");
    res.status(200).json(comments);
});

export const deleteComment = asyncHandler(async (req, res) => {
    let { slug, commentId } = req.params;
    console.log(`Attempting to delete comment with ID ${commentId} from blog slug ${slug}, userId: ${req.userId}, userRole: ${req.userRole}`);
    let blog = await Blog.findOne({ slug });
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    let comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }
    // Allow admin to delete any comment, otherwise only the comment owner
    const user = await User.findById(req.userId).select("+role");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== 'admin' && comment.user.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    // Remove the comment from the blog's comments array
    blog.comments = blog.comments.filter((id) => id.toString() !== commentId);
    await blog.save({ validateBeforeSave: false });
    // Delete the comment
    await Comment.findByIdAndDelete(commentId);
    console.log(`Comment with ID ${commentId} deleted successfully from blog slug ${slug}`);
    res.sendStatus(204);
});