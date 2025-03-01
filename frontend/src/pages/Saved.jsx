import { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Alert } from '@mui/material';
import { getBookmarkedBlogs } from '../services/api.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

function Saved() {
  const { user } = useContext(AuthContext);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookmarkedBlogs = async () => {
      console.log('Fetching bookmarked blogs for user:', user);
      try {
        if (!user) {
          setError('Please log in to view saved blogs');
          console.warn('User not authenticated');
          return;
        }
        const response = await getBookmarkedBlogs();
        console.log('Bookmarked blogs response:', response.data);
        setBookmarkedBlogs(response.data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching bookmarked blogs - Full error:', err);
        setError(err.response?.data?.message || 'Failed to fetch bookmarked blogs due to server error');
      }
    };
    fetchBookmarkedBlogs();
  }, [user]);

  console.log('Rendering Saved - User:', user, 'Bookmarked Blogs:', bookmarkedBlogs, 'Error:', error);

  if (!user) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Please log in to view saved blogs
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Saved Blogs</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {bookmarkedBlogs.map((blog) => (
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
                  By <span style={{ color: '#333' }}>{blog.author?.username}</span> | {new Date(blog.createdAt).toLocaleDateString()} | {blog.views} views | {blog.likes.length} likes
                </Typography>
                <Button
                  component={Link}
                  to={`/blog/${blog.slug}`}
                  size="small"
                  sx={{
                    mt: 1,
                    '&:hover': {
                      backgroundColor: '#1976d2',
                      color: 'white',
                      transition: 'background-color 0.3s ease, color 0.3s ease',
                    },
                  }}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {bookmarkedBlogs.length === 0 && !error && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No saved blogs yet.
        </Typography>
      )}
    </Box>
  );
}

export default Saved;