import { useContext, useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Alert, Button, IconButton, Pagination, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { getBlogs, deleteBlog, getComments, deleteComment } from '../../services/api.js';
import { Bookmark, BookmarkBorder, Delete } from '@mui/icons-material';
import { toggleBookmarkBlog } from '../../services/api.js';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState({});
  const [error, setError] = useState('');
  
  // Pagination for blogs
  const [blogPage, setBlogPage] = useState(1);
  const [totalBlogPages, setTotalBlogPages] = useState(1);
  const blogLimit = 3; // Same as Home and AuthorDashboard

  // Pagination for comments (per blog)
  const [commentPages, setCommentPages] = useState({});
  const [currentCommentPages, setCurrentCommentPages] = useState({});
  const commentLimit = 5; // Show 5 comments per page

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const params = { page: blogPage, limit: blogLimit };
        const blogsResponse = await getBlogs(params);
        setBlogs(blogsResponse.data.blogs);
        setTotalBlogPages(blogsResponse.data.pages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch blogs');
        console.error(err);
      }
    };
    fetchBlogs();
  }, [blogPage]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = {};
        const pagesData = {};
        const currentPages = {};

        for (const blog of blogs) {
          const commentsResponse = await getComments(blog.slug);
          commentsData[blog.slug] = commentsResponse.data;
          
          // Calculate total pages for comments
          const totalCommentPages = Math.ceil(commentsResponse.data.length / commentLimit);
          pagesData[blog.slug] = totalCommentPages;
          currentPages[blog.slug] = 1; // Start at page 1 for each blog's comments
        }
        
        setComments(commentsData);
        setCommentPages(pagesData);
        setCurrentCommentPages(currentPages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch comments');
        console.error(err);
      }
    };
    
    if (blogs.length > 0) {
      fetchComments();
    }
  }, [blogs]);

  const handleDeleteBlog = async (blogSlug) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(blogSlug);
        
        // Check if we need to go to previous page after deletion
        const remainingBlogsOnPage = blogs.filter(blog => blog.slug !== blogSlug).length;
        if (remainingBlogsOnPage === 0 && blogPage > 1) {
          setBlogPage(blogPage - 1);
        } else {
          // Refetch current page
          const params = { page: blogPage, limit: blogLimit };
          const blogsResponse = await getBlogs(params);
          setBlogs(blogsResponse.data.blogs);
          setTotalBlogPages(blogsResponse.data.pages);
        }
        
        // Remove comments for deleted blog
        setComments((prev) => {
          const newComments = { ...prev };
          delete newComments[blogSlug];
          return newComments;
        });
        
        // Remove pagination data for deleted blog's comments
        setCommentPages((prev) => {
          const newPages = { ...prev };
          delete newPages[blogSlug];
          return newPages;
        });
        
        setCurrentCommentPages((prev) => {
          const newCurrentPages = { ...prev };
          delete newCurrentPages[blogSlug];
          return newCurrentPages;
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
        
        // Update comments state
        const updatedComments = comments[slug].filter((c) => c._id !== commentId);
        setComments((prev) => ({
          ...prev,
          [slug]: updatedComments,
        }));
        
        // Update comment pagination
        const totalCommentPages = Math.ceil(updatedComments.length / commentLimit);
        setCommentPages((prev) => ({
          ...prev,
          [slug]: totalCommentPages,
        }));
        
        // Adjust current page if necessary
        if (updatedComments.length === 0 && currentCommentPages[slug] > 1) {
          setCurrentCommentPages((prev) => ({
            ...prev,
            [slug]: prev[slug] - 1,
          }));
        } else if (currentCommentPages[slug] > totalCommentPages && totalCommentPages > 0) {
          setCurrentCommentPages((prev) => ({
            ...prev,
            [slug]: totalCommentPages,
          }));
        }
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

  // Function to get paginated comments for a specific blog
  const getPaginatedComments = (slug) => {
    if (!comments[slug]) return [];
    
    const currentPage = currentCommentPages[slug] || 1;
    const startIndex = (currentPage - 1) * commentLimit;
    const endIndex = startIndex + commentLimit;
    
    return comments[slug].slice(startIndex, endIndex);
  };

  // Function to handle comment page change
  const handleCommentPageChange = (slug, newPage) => {
    setCurrentCommentPages((prev) => ({
      ...prev,
      [slug]: newPage,
    }));
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100vw', p: 2, boxSizing: 'border-box' }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }} gutterBottom>Admin Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{error}</Alert>}

      <Typography variant="h5" sx={{ color: 'text.primary', mb: 2 }} gutterBottom>All Blogs</Typography>
      <Grid container spacing={3} sx={{ bgcolor: 'background.default', width: '100%', justifyContent: 'flex-start', ml: -1 }}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={3.8} key={blog._id}>
            <Card
              sx={{
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme => `0 4px 8px rgba(${theme.palette.mode === 'dark' ? '255, 255, 255' : '0, 0, 0'}, 0.2)`,
                },
                bgcolor: 'background.paper',
                border: theme => theme.palette.mode === 'dark' ? '2px solid #ffffff' : '2px solid #e0e0e0',
                boxShadow: theme => theme.palette.mode === 'dark' ? '0 0 10px rgba(255, 255, 255, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              {blog.featuredImage && (
                <CardMedia
                  component="img"
                  height="250"
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

      {/* Blogs Pagination */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', bgcolor: 'background.default', width: '100%' }}>
        <Pagination 
          count={totalBlogPages} 
          page={blogPage} 
          onChange={(e, value) => setBlogPage(value)} 
          color="primary" 
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>

      <Typography variant="h5" sx={{ color: 'text.primary', mt: 4, mb: 2 }} gutterBottom>All Comments</Typography>
      {Object.entries(comments).map(([slug, blogComments]) => (
        <Box key={slug} sx={{ mb: 4, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
            Comments for "{blogs.find((b) => b.slug === slug)?.title}"
          </Typography>
          
          {blogComments.length > 0 ? (
            <>
              <List sx={{ bgcolor: 'background.paper' }}>
                {getPaginatedComments(slug).map((comment) => (
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
              
              {/* Comments Pagination (only show if more than one page) */}
              {commentPages[slug] > 1 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination 
                    count={commentPages[slug]} 
                    page={currentCommentPages[slug] || 1} 
                    onChange={(e, value) => handleCommentPageChange(slug, value)} 
                    size="small"
                    color="primary" 
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              No comments for this blog
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default AdminDashboard;