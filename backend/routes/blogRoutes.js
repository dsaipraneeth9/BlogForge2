import { Router } from "express";
import multer from 'multer';
import storage from '../middlewares/fileUpload.js';
import { deleteBlog, getBlog, getBlogs, postBlog, ToggleLikeBlog, updateBlog, toggleBookmarkBlog, getBookmarkedBlogs } from "../controllers/blogControllers.js";
import { auth, checkRole } from "../middlewares/auth.js";
import { createComment, deleteComment, getComments } from "../controllers/commentControllers.js";
import Blog from "../models/Blog.js";
import expressAsyncHandler from "express-async-handler";

let upload = multer({ storage: storage });
let router = Router();

router.get("/bookmarks", auth, getBookmarkedBlogs); // New route for bookmarked blogs

// Public routes
router.get("/", getBlogs);
router.get("/:slug", getBlog);

// Private routes
router.post("/", auth, checkRole('author', 'admin'), upload.single("featuredImage"), postBlog);
router.patch("/:slug", auth, checkRole('author', 'admin'), upload.single("featuredImage"), updateBlog);
router.delete("/:slug", auth, expressAsyncHandler(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  if (req.userRole !== 'admin' && blog.author.toString() !== req.userId.toString()) {
    res.status(403);
    throw new Error("Permission denied");
  }
  return deleteBlog(req, res, next);
}));

router.post("/:slug/like", auth, ToggleLikeBlog);
router.post("/:slug/bookmark", auth, toggleBookmarkBlog); // New route for bookmarking

router.post("/:slug/comments", auth, createComment);
router.get("/:slug/comments", getComments);
router.delete("/:slug/comments/:commentId", auth, deleteComment);

export default router;