import { useEffect, useState, useContext } from 'react';
import { Grid, Typography, Pagination, Alert, Box } from '@mui/material';
import BlogCard from '../components/Blog/BlogCard.jsx';
import { getBlogs } from '../services/api.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const params = { page, limit: 3 };
        const response = await getBlogs(params);
        setBlogs(response.data.blogs);
        setTotalPages(response.data.pages);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch blogs');
        console.error(err);
      }
    };
    fetchBlogs();
  }, [page]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100vw', p: 0, boxSizing: 'border-box', overflowX: 'hidden' }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 2, px: 2 , ml :2}} gutterBottom>Latest Posts</Typography>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary', px: 2 }}> {error}</Alert>}
      <Grid container spacing={3} sx={{ bgcolor: 'background.default', width: '100%', px: 2, justifyContent: 'flex-start', ml: -1 }}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={3.8} key={blog._id}> {/* Changed md={4} to md={3} to decrease width */}
            <BlogCard blog={blog} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', bgcolor: 'background.default', width: '100%', px: 2 }}>
        <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" sx={{ bgcolor: 'background.paper' }} />
      </Box>
    </Box>
  );
}

export default Home;