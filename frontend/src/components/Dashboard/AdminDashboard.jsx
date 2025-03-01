import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Alert, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete, Bookmark, BookmarkBorder } from '@mui/icons-material'; // Added bookmark icons
import { getBlogs, deleteBlog, getComments, deleteComment } from '../../services/api.js';
import { toggleBookmarkBlog } from '../../services/api.js'; // Added toggleBookmarkBlog

function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all blogs
        const blogResponse = await getBlogs({ limit: 100 });
        setBlogs(blogResponse.data.blogs);

        // Fetch comments for each blog
        const commentsData = {};
        await Promise.all(
          blogResponse.data.blogs.map(async (blog) => {
            const commentResponse = await getComments(blog.slug);
            commentsData[blog.slug] = commentResponse.data;
          })
        );
        setComments(commentsData);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleDeleteBlog = async (slug) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(slug);
        setBlogs(blogs.filter((blog) => blog.slug !== slug));
        setComments((prev) => {
          const newComments = { ...prev };
          delete newComments[slug];
          return newComments;
        });
      } catch (err) {
        setError('Failed to delete blog');
        console.error('Error deleting blog:', err);
      }
    }
  };

  const handleDeleteComment = async (slug, commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(slug, commentId);
        setComments((prev) => ({
          ...prev,
          [slug]: prev[slug].filter((c) => c._id !== commentId),
        }));
      } catch (err) {
        setError('Failed to delete comment');
        console.error('Error deleting comment:', err);
      }
    }
  };

  const handleBookmarkToggle = async (blogSlug) => {
    try {
      await toggleBookmarkBlog(blogSlug);
      setBlogs(blogs.map((blog) => 
        blog.slug === blogSlug 
          ? { ...blog, bookmarks: blog.bookmarks.includes(blog.author._id) // Assuming author._id for simplicity, adjust as needed
            ? blog.bookmarks.filter(id => id !== blog.author._id) 
            : [...blog.bookmarks, blog.author._id] }
          : blog
      ));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h5" gutterBottom>All Blogs</Typography>
      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Card>
              {blog.featuredImage && (
                <CardMedia
                  component="img"
                  height="140"
                  image={blog.featuredImage}
                  alt={blog.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ color: '#b8860b' }}>{blog.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  By <span style={{ color: '#333' }}>{blog.author?.username}</span> | {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteBlog(blog.slug)}
                    sx={{ mt: 1 }}
                  >
                    Delete
                  </Button>
                  <IconButton onClick={() => handleBookmarkToggle(blog.slug)} aria-label={blog.bookmarks.includes(blog.author._id) ? 'Remove Bookmark' : 'Bookmark'} sx={{ color: blog.bookmarks.includes(blog.author._id) ? 'black' : 'inherit' }}>
                    {blog.bookmarks.includes(blog.author._id) ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>All Comments</Typography>
      {Object.entries(comments).map(([slug, blogComments]) => (
        <Box key={slug} sx={{ mb: 4 }}>
          <Typography variant="h6">
            Comments for "{blogs.find((b) => b.slug === slug)?.title}"
          </Typography>
          <List>
            {blogComments.map((comment) => (
              <ListItem
                key={comment._id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDeleteComment(slug, comment._id)}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={comment.content}
                  secondary={`By ${comment.user.username} - ${new Date(comment.createdAt).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
}

export default AdminDashboard;