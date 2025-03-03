import { useEffect, useState, useContext } from 'react';
import { Grid, Typography, Pagination, Alert, Box, Button, Link } from '@mui/material';
import BlogCard from '../components/Blog/BlogCard.jsx';
import { getBlogs } from '../services/api.js';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useTheme } from '@mui/material/styles'; // Import useTheme for dynamic styling

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const theme = useTheme(); // Access the current theme

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
      }
    };
    fetchBlogs();
  }, [page]);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        width: '100vw',
        p: 0,
        boxSizing: 'border-box',
        overflowX: 'hidden',
        position: 'relative', // For branding element
      }}
    >
      

      <Typography
        variant="h3" // Increased from h4 for prominence
        sx={{
          color: 'text.primary',
          mb: 4,
          px: 2,
          ml: 2,
          fontWeight: 'bold',
          textShadow: theme.palette.mode === 'dark' ? '0 0 5px rgba(255, 255, 255, 0.3)' : 'none', // Subtle glow in dark mode
          animation: 'fadeIn 1s ease-in-out', // Subtle animation
        }}
        gutterBottom
      >
        Latest Posts
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            bgcolor: 'background.paper',
            color: 'text.primary',
            px: 2,
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {error}
        </Alert>
      )}

      <Grid
        container
        spacing={4} // Increased spacing for better readability
        sx={{
          bgcolor: 'background.default',
          width: '100%',
          px: 2,
          justifyContent: 'center', // Centered for better alignment
          ml: -6, // Removed negative margin to fix alignment
        }}
      >
        {blogs.map((blog) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4} // Adjusted to standard 4 for even spacing
            key={blog._id}
            sx={{ display: 'flex', justifyContent: 'center' }} // Center cards for better alignment
          >
            <BlogCard blog={blog} />
          </Grid>
        ))}
      </Grid>

      {!user && (
        <Box sx={{ mt: 4, textAlign: 'center', bgcolor: 'background.default', px: 2 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Want to save posts or comment?{' '}
            <Link href="/login" sx={{ color: 'primary.main', textDecoration: 'none' }}>
              Log in
            </Link>{' '}
            or{' '}
            <Link href="/register" sx={{ color: 'primary.main', textDecoration: 'none' }}>
              Register
            </Link>
            !
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          mt: 6,
          display: 'flex',
          justifyContent: 'center',
          bgcolor: 'background.default',
          width: '100%',
          px: 2,
          pb: 4,
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            '& .MuiPaginationItem-root': {
              transition: 'background-color 0.3s ease, color 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white',
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            },
          }}
        />
      </Box>

      {/* CSS Animation for fadeIn */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}

export default Home;