import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";

// @desc     Get a Blog
// @route    /api/blog/:slug
// @access   Public
export const getBlog = asyncHandler(async (req, res) => {
    let { slug } = req.params;
    const requestId = Date.now().toString() + Math.random().toString(36).substr(2, 9); // Unique request identifier
    console.log(`Fetching blog with slug: ${slug}, requestId: ${requestId}, at: ${new Date().toISOString()}`);
  
    let blog = await Blog.findOne({ slug })
      .populate("author", "username photo email -_id");
  
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
  
    // Use a lock or check to prevent double increments (e.g., based on request timestamp or ID)
    const currentViews = blog.views;
    console.log(`Current views before increment: ${currentViews}, requestId: ${requestId}`);
  
    // Increment views only if not already incremented in this request (simplified for now)
    blog.views += 1;
    await blog.save({ validateBeforeSave: false });
    console.log(`Views incremented to: ${blog.views}, requestId: ${requestId}`);
  
    res.status(200).json(blog);
  });

// @desc     Post a Blog
// @route    /api/blog
// @access   Private
export const postBlog = asyncHandler(async (req, res, next) => {
  let { title, content, categories } = req.body;
  if (!title || !content || !categories) {
    res.status(400);
    throw new Error("Title, content, and Categories are required!!");
  }
  let newBlog = await Blog.create({
    title,
    content,
    categories,
    author: req?.userId,
    featuredImage: req.file?.path
  });
  res.status(201).json(newBlog);
});

// @desc     Get Blogs
// @route    /api/blog
// @access   Public
export const getBlogs = asyncHandler(async (req, res) => {
  let query = {};

  // Handle search query for title, author username, or categories
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i'); // Case-insensitive search
    query = {
      $or: [
        { title: searchRegex },
        { 'author': { $in: await Blog.distinct('author', { 'author.username': searchRegex }) } }, // Search by author username
        { categories: searchRegex }
      ]
    };
  }

  // Handle author filter
  if (req.query.author) {
    query.author = req.query.author; // Filter by author ID
  }

  // Handle suggestions limit (e.g., for real-time search)
  let limit = parseInt(req.query.limit) || 3;
  if (req.query.search && !req.query.page) { // If no page is specified and there's a search, assume it's for suggestions
    limit = 5; // Limit to 5 suggestions
  }

  // Pagination
  let page = parseInt(req.query.page) || 1;
  let skip = (page - 1) * limit;

  let totalBlogs = await Blog.countDocuments(query);
  let blogs = await Blog.find(query)
    .populate("author", "username photo email -_id")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    currentPage: page,
    totalBlogs,
    pages: Math.ceil(totalBlogs / limit),
    blogs
  });
});

// @desc     Update a Blog
// @route    /api/blog/:slug
// @access   Private
export const updateBlog = asyncHandler(async (req, res) => {
  let { slug } = req.params;
  let blog = await Blog.findOne({ slug });
  if (req.body.title) {
    blog.title = req.body.title;
  }
  if (req.body.content) {
    blog.content = req.body.content;
  }
  if (req.file) {
    blog.featuredImage = req.file?.path;
  }
  await blog.save();
  res.status(200).json(blog);
});

// @desc     Delete a Blog
// @route    /api/blog/:slug
// @access   Private
// @desc     Delete a Blog
// @route    /api/blog/:slug
// @access   Private
// @desc     Delete a Blog
// @route    /api/blog/:slug
// @access   Private
export const deleteBlog = asyncHandler(async (req, res) => {
  let { slug } = req.params;
  console.log(`Attempting to delete blog with slug: ${slug}, userId: ${req.userId}, userRole: ${req.userRole}`);
  const blog = await Blog.findOne({ slug });
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  await Blog.findOneAndDelete({ slug });
  console.log(`Blog with slug ${slug} deleted successfully by user with role ${req.userRole}`);
  res.sendStatus(204);
});
// @desc   Toggle a Like
// @route  /api/blog/:slug/like
// @access  Private
export const ToggleLikeBlog = asyncHandler(async (req, res) => {
  let { slug } = req.params;
  let blog = await Blog.findOne({ slug });
  let userIndex = blog.likes.findIndex((doc) => {
    return doc.toString() === req.userId.toString();
  });
  if (userIndex === -1) {
    blog.likes.push(req.userId);
  } else {
    blog.likes.splice(userIndex, 1);
  }
  await blog.save();
  res.sendStatus(200);
});

// @desc     Toggle Bookmark on a Blog
// @route    /api/blog/:slug/bookmark
// @access   Private
export const toggleBookmarkBlog = asyncHandler(async (req, res) => {
  let { slug } = req.params;
  let blog = await Blog.findOne({ slug });
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  let userIndex = blog.bookmarks.findIndex((doc) => {
    return doc.toString() === req.userId.toString();
  });

  if (userIndex === -1) {
    blog.bookmarks.push(req.userId);  
  } else {
    blog.bookmarks.splice(userIndex, 1);
  }
  await blog.save();
  res.sendStatus(200);
});

// @desc     Get Bookmarked Blogs for Current User
// @route    /api/blog/bookmarks
// @access   Private
export const getBookmarkedBlogs = asyncHandler(async (req, res) => {
  const bookmarkedBlogs = await Blog.find({ bookmarks: req.userId })
    .populate("author", "username photo email -_id")
    .sort("-createdAt");

  res.status(200).json(bookmarkedBlogs);
});

