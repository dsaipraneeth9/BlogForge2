import { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Alert } from '@mui/material';
import BlogCard from '../components/Blog/BlogCard.jsx';
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
      <Box sx={{ py: 4, bgcolor: 'background.default' }}>
        <Typography variant="h6" color="error">
          Please log in to view saved blogs
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100vw', p: 2, boxSizing: 'border-box' }}>
      <Typography variant="h4" sx={{ color: 'text.primary' }} gutterBottom>Saved Blogs</Typography>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{error}</Alert>}
      <Grid container spacing={3} sx={{ bgcolor: 'background.default', width: '100%' }}>
        {bookmarkedBlogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <BlogCard blog={blog} />
          </Grid>
        ))}
      </Grid>
      {bookmarkedBlogs.length === 0 && !error && (
        <Typography variant="body1" sx={{ mt: 2, color: 'text.primary' }}>
          No saved blogs yet.
        </Typography>
      )}
    </Box>
  );
}

export default Saved;