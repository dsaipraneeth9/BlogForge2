import { useContext, useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Alert, Button, IconButton } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { getBlogs, deleteBlog } from '../../services/api.js';
import BlogCardUpdate from '../Blog/BlogCardUpdate.jsx';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { toggleBookmarkBlog } from '../../services/api.js';

function AuthorDashboard() {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [error, setError] = useState('');

  console.log('Rendering AuthorDashboard with user:', user);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (!user || !user.id) {
          setError('User not authenticated or missing ID');
          setBlogs([]);
          console.warn('User or user.id is missing:', user);
          return;
        }
        const response = await getBlogs({ author: user.id });
        setBlogs(response.data.blogs);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch blogs');
        console.error('Error fetching blogs:', err);
      }
    };
    if (user) fetchBlogs();
  }, [user]);

  const handleDelete = async (blogSlug) => {
    if (!blogSlug) {
      setError('Invalid blog slug for deletion');
      return;
    }

    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        console.log('Attempting to delete blog with slug:', blogSlug);
        const response = await deleteBlog(blogSlug);

        if (response.status === 204) {
          console.log('Blog deleted successfully from database with slug:', blogSlug);
          setBlogs(blogs.filter((blog) => blog.slug !== blogSlug));
          setError('');
          alert('Blog deleted successfully!');
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error('Delete failed - Full error:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          setError(`Failed to delete blog: ${error.response.data.message || error.message}`);
          alert('Failed to delete blog.');
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('Network error: Failed to delete blog');
          alert('Failed to delete blog.');
        } else {
          console.error('Error setting up request:', error.message);
          setError(`Error deleting blog: ${error.message}`);
          alert('Failed to delete blog.');
        }
      }
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
  };

  const handleBookmarkToggle = async (blogSlug) => {
    if (!user) return;
    try {
      await toggleBookmarkBlog(blogSlug);
      setBlogs(blogs.map((blog) => 
        blog.slug === blogSlug 
          ? { ...blog, bookmarks: blog.bookmarks.includes(user.id) 
            ? blog.bookmarks.filter(id => id !== user.id) 
            : [...blog.bookmarks, user.id] }
          : blog
      ));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  if (!user) return <div>User not found</div>;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100vw', p: 2, boxSizing: 'border-box' }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }} gutterBottom>Author Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{error}</Alert>}

      {selectedBlog && (
        <BlogCardUpdate
          blog={selectedBlog}
          setBlogs={setBlogs}
          setSelectedBlog={setSelectedBlog}
        />
      )}

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
                  <Box>
                    <Button
                      variant="outlined"
                      onClick={() => handleEdit(blog)}
                      sx={{
                        mr: 1,
                        mt: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transition: 'background-color 0.3s ease',
                        },
                        color: 'primary.main',
                        bgcolor: 'transparent',
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(blog.slug)}
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
                  </Box>
                  {user && (
                    <IconButton onClick={() => handleBookmarkToggle(blog.slug)} aria-label={blog.bookmarks.includes(user.id) ? 'Remove Bookmark' : 'Bookmark'} sx={{ color: blog.bookmarks.includes(user.id) ? 'black' : 'inherit' }}>
                      {blog.bookmarks.includes(user.id) ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AuthorDashboard;


// import { useContext, useState, useEffect } from 'react';
// import { Box, Typography, Grid, Card, CardContent, CardMedia, Alert, Button } from '@mui/material';
// import { AuthContext } from '../../contexts/AuthContext.jsx';
// import { getBlogs, deleteBlog } from '../../services/api.js';
// import BlogCardUpdate from '../Blog/BlogCardUpdate.jsx';

// function AuthorDashboard() {
//   const { user } = useContext(AuthContext);
//   const [blogs, setBlogs] = useState([]);
//   const [selectedBlog, setSelectedBlog] = useState(null); // Blog selected for editing
//   const [error, setError] = useState('');

//   console.log('Rendering AuthorDashboard with user:', user);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       if (!user || !user.id) {
//         setError('User not authenticated or missing ID');
//         setBlogs([]);
//         return;
//       }
//       try {
//         const response = await getBlogs({ author: user.id });
//         // Double-check that only the author's blogs are returned
//         const authorBlogs = response.data.blogs.filter(blog => 
//           blog.author && blog.author._id && blog.author._id.toString() === user.id.toString()
//         );
//         setBlogs(authorBlogs);
//         setError('');
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch blogs');
//         console.error('Error fetching blogs:', err);
//       }
//     };
//     fetchBlogs();
//   }, [user]);

//   const handleDelete = async (blogId) => {
//     if (window.confirm('Are you sure you want to delete this blog?')) {
//       try {
//         await deleteBlog(blogId);
//         setBlogs(blogs.filter((blog) => blog._id !== blogId));
//       } catch (err) {
//         console.error('Error deleting blog:', err);
//         setError('Failed to delete blog');
//       }
//     }
//   };

//   const handleEdit = (blog) => {
//     setSelectedBlog(blog);
//   };

//   if (!user) return <div>User not found</div>;

//   return (
//     <Box sx={{ py: 4 }}>
//       <Typography variant="h4" gutterBottom>Author Dashboard</Typography>
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       {/* Render BlogCardUpdate if a blog is selected for editing */}
//       {selectedBlog && (
//         <BlogCardUpdate
//           blog={selectedBlog}
//           setBlogs={setBlogs}
//           setSelectedBlog={setSelectedBlog} // Allow closing the editor
//         />
//       )}

//       <Grid container spacing={3}>
//         {blogs.map((blog) => (
//           <Grid item xs={12} sm={6} md={4} key={blog._id}>
//             <Card>
//               {blog.featuredImage && (
//                 <CardMedia
//                   component="img"
//                   height="140" // Adjust height for a thumbnail size
//                   image={blog.featuredImage}
//                   alt={blog.title}
//                   sx={{ objectFit: 'cover' }} // Ensure image fits well
//                 />
//               )}
//               <CardContent>
//                 <Typography variant="h6">{blog.title}</Typography>
//                 <Typography variant="body2">Created: {new Date(blog.createdAt).toLocaleDateString()}</Typography>
//                 <Button
//                   variant="outlined"
//                   onClick={() => handleEdit(blog)}
//                   sx={{ mr: 1, mt: 1 }}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={() => handleDelete(blog._id)}
//                   sx={{ mt: 1 }}
//                 >
//                   Delete
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }

// export default AuthorDashboard;