import { useContext, useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Alert, Button, IconButton } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { getBlogs, deleteBlog, getComments, deleteComment } from '../../services/api.js';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { toggleBookmarkBlog } from '../../services/api.js';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsResponse = await getBlogs();
        setBlogs(blogsResponse.data.blogs);
        const commentsData = {};
        for (const blog of blogsResponse.data.blogs) {
          const commentsResponse = await getComments(blog.slug);
          commentsData[blog.slug] = commentsResponse.data;
        }
        setComments(commentsData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleDeleteBlog = async (blogSlug) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(blogSlug);
        setBlogs(blogs.filter((blog) => blog.slug !== blogSlug));
        setComments((prev) => {
          const newComments = { ...prev };
          delete newComments[blogSlug];
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
          ? { ...blog, bookmarks: blog.bookmarks.includes(blog.author._id) 
            ? blog.bookmarks.filter(id => id !== blog.author._id) 
            : [...blog.bookmarks, blog.author._id] }
          : blog
      ));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100vw', p: 2, boxSizing: 'border-box' }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }} gutterBottom>Admin Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{error}</Alert>}

      <Typography variant="h5" sx={{ color: 'text.primary', mb: 2 }} gutterBottom>All Blogs</Typography>
      <Grid container spacing={3} sx={{ bgcolor: 'background.default', width: '100%', justifyContent: 'flex-start', ml: -1 }}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={3.8} key={blog._id}> {/* Changed md={3} to md={3.8} to match Home */}
            <Card
              sx={{
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme => `0 4px 8px rgba(${theme.palette.mode === 'dark' ? '255, 255, 255' : '0, 0, 0'}, 0.2)`,
                },
                bgcolor: 'background.paper',
                border: theme => theme.palette.mode === 'dark' ? '2px solid #ffffff' : '2px solid #e0e0e0', // White border in dark mode, light gray in light mode
                boxShadow: theme => theme.palette.mode === 'dark' ? '0 0 10px rgba(255, 255, 255, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.2)', // White shadow effect in dark mode
              }}
            >
              {blog.featuredImage && (
                <CardMedia
                  component="img"
                  height="250" // Maintain increased height for more image visibility
                  image={blog.featuredImage}
                  alt={blog.title}
                  sx={{ objectFit: 'cover', maxWidth: '100%' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>{blog.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  By <span style={{ color: 'text.primary' }}>{blog.author?.username}</span> | {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, bgcolor: 'background.paper' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteBlog(blog.slug)}
                    sx={{
                      mt: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        transition: 'background-color 0.3s ease',
                      },
                      bgcolor: 'transparent',
                    }}
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

      <Typography variant="h5" sx={{ color: 'text.primary', mt: 4, mb: 2 }} gutterBottom>All Comments</Typography>
      {Object.entries(comments).map(([slug, blogComments]) => (
        <Box key={slug} sx={{ mb: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ color: 'text.primary', p: 2 }}>
            Comments for "{blogs.find((b) => b.slug === slug)?.title}"
          </Typography>
          <List sx={{ bgcolor: 'background.paper' }}>
            {blogComments.map((comment) => (
              <ListItem
                key={comment._id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDeleteComment(slug, comment._id)} sx={{ color: 'error.main' }}>
                    <Delete />
                  </IconButton>
                }
                sx={{ bgcolor: 'background.paper' }}
              >
                <ListItemText
                  primary={comment.content}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={comment.user.photo} alt={comment.user.username} sx={{ width: 24, height: 24 }} />
                      {`By ${comment.user.username} - ${new Date(comment.createdAt).toLocaleDateString()}`}
                    </Box>
                  }
                  sx={{
                    '& .MuiListItemText-primary': { color: 'text.primary' },
                    '& .MuiListItemText-secondary': { color: 'text.secondary' },
                  }}
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