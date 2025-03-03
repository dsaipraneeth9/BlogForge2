// import { useEffect, useState, useContext, useRef, useCallback } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { Typography, Box, Button, Divider, CircularProgress, IconButton } from '@mui/material';
// import { Favorite, FavoriteBorder, Bookmark, BookmarkBorder } from '@mui/icons-material';
// import { getBlog, toggleLike, deleteBlog, toggleBookmarkBlog } from '../services/api.js';
// import CommentSection from '../components/Blog/CommentSection.jsx';
// import { AuthContext } from '../contexts/AuthContext.jsx';

// function BlogPost() {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const isFetching = useRef(false);
//   const fetchCount = useRef(0);

//   const [isBookmarked, setIsBookmarked] = useState(false);

//   useEffect(() => {
//     if (user && blog && blog.bookmarks) {
//       setIsBookmarked(blog.bookmarks.includes(user.id));
//     }
//   }, [user, blog]);

//   const fetchBlog = useCallback(async () => {
//     if (!slug) {
//       console.error('Slug is undefined in BlogPost');
//       setError('Invalid blog URL');
//       setIsLoading(false);
//       return;
//     }

//     if (isFetching.current) {
//       console.warn('Request already in progress, skipping duplicate fetch for slug:', slug);
//       return;
//     }
//     isFetching.current = true;
//     fetchCount.current += 1;
//     console.log(`Fetching blog with slug: ${slug}, attempt #${fetchCount.current}, at: ${new Date().toISOString()}`);

//     try {
//       const response = await getBlog(slug);
//       setBlog(response.data);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching blog - Full error:', err);
//       setError(err.response?.data?.message || 'Failed to load blog');
//     } finally {
//       isFetching.current = false;
//       setIsLoading(false);
//     }
//   }, [slug]);

//   useEffect(() => {
//     let mounted = true;
//     fetchBlog();
//     return () => {
//       mounted = false;
//     };
//   }, [fetchBlog]);

//   const handleLike = useCallback(async () => {
//     if (!slug || !blog) {
//       console.error('Cannot like: slug or blog is undefined');
//       return;
//     }
//     try {
//       await toggleLike(slug);
//       setBlog((prev) => ({
//         ...prev,
//         likes: prev.likes.includes(user?.id)
//           ? prev.likes.filter((id) => id !== user.id)
//           : [...prev.likes, user.id]
//       }));
//     } catch (error) {
//       console.error('Error toggling like:', error);
//     }
//   }, [slug, blog, user?.id]);

//   const handleBookmarkToggle = useCallback(async () => {
//     if (!user || !slug) return;
//     try {
//       await toggleBookmarkBlog(slug);
//       setIsBookmarked(!isBookmarked);
//     } catch (error) {
//       console.error('Error toggling bookmark:', error);
//     }
//   }, [user, slug, isBookmarked]);

//   const handleDelete = useCallback(async () => {
//     if (!slug) {
//       console.error('Cannot delete: slug is undefined');
//       setError('Invalid blog URL');
//       return;
//     }
//     if (window.confirm('Are you sure you want to delete this post?')) {
//       try {
//         await deleteBlog(slug);
//         console.log('Blog deleted successfully, navigating to homepage');
//         navigate('/');
//       } catch (error) {
//         console.error('Error deleting blog - Full error:', error);
//         setError(error.response?.data?.message || 'Failed to delete blog');
//         alert('Failed to delete blog: ' + (error.response?.data?.message || 'Unknown error'));
//       }
//     }
//   }, [slug, navigate]);

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, bgcolor: 'background.default' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ py: 4, bgcolor: 'background.default' }}>
//         <Typography variant="h6" color="error">
//           {error}
//         </Typography>
//       </Box>
//     );
//   }

//   if (!blog) {
//     return (
//       <Box sx={{ py: 4, bgcolor: 'background.default' }}>
//         <Typography variant="h6" color="text.primary">
//           Blog not found
//         </Typography>
//       </Box>
//     );
//   }

//   const isAuthor = user && blog.author && blog.author._id && user.id && blog.author._id.toString() === user.id.toString();
//   const canEditDelete = user && (isAuthor || user.role === 'admin');

//   return (
//     <Box sx={{ bgcolor: 'background.default', p: 2 }}>
//       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper', p: 2, mb: 4 }}>
//         {blog.featuredImage && (
//           <Box sx={{ maxWidth: '100%', mb: 4 }}>
//             <img
//               src={blog.featuredImage}
//               alt={blog.title}
//               style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }} // Centered and scaled appropriately
//             />
//           </Box>
//         )}
//         <Typography variant="h3" sx={{ color: 'primary.main', textAlign: 'center' }} gutterBottom>{blog.title}</Typography>
//         <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
//           By <span style={{ color: 'text.primary' }}>{blog.author?.username}</span> | {new Date(blog.createdAt).toLocaleDateString()} | {blog.views} views
//         </Typography>
//       </Box>
//       <div dangerouslySetInnerHTML={{ __html: blog.content }} style={{ bgcolor: 'background.paper', p: 2 }} />
//       <Box sx={{ mt: 2, bgcolor: 'background.paper', p: 2 }}>
//         <IconButton onClick={handleLike} aria-label={blog.likes.includes(user?.id) ? 'Unlike' : 'Like'} sx={{ color: blog.likes.includes(user?.id) ? 'black' : 'inherit' }}>
//           {blog.likes.includes(user?.id) ? <Favorite /> : <FavoriteBorder />}
//         </IconButton>
//         <Typography variant="body2" component="span" sx={{ ml: 1, verticalAlign: 'middle', color: 'text.primary' }}>
//           {blog.likes.length} {blog.likes.length === 1 ? 'Like' : 'Likes'}
//         </Typography>
//         {user && (
//           <IconButton onClick={handleBookmarkToggle} aria-label={isBookmarked ? 'Remove Bookmark' : 'Bookmark'} sx={{ ml: 2, color: isBookmarked ? 'black' : 'inherit' }}>
//             {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
//           </IconButton>
//         )}
//         {canEditDelete && (
//           <>
//             <Button component={Link} to={`/create-post?slug=${slug}`} variant="outlined" sx={{ ml: 2, color: 'primary.main', bgcolor: 'transparent' }}>
//               Edit
//             </Button>
//             <Button onClick={handleDelete} variant="outlined" color="error" sx={{ ml: 2, bgcolor: 'transparent' }}>
//               Delete
//             </Button>
//           </>
//         )}
//       </Box>
//       <Divider sx={{ my: 4, bgcolor: 'background.paper', borderColor: 'text.secondary' }} />
//       <CommentSection slug={slug} />
//     </Box>
//   );
// }

// export default BlogPost;


import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, Button, Divider, CircularProgress, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder, Bookmark, BookmarkBorder } from '@mui/icons-material';
import { getBlog, toggleLike, deleteBlog, toggleBookmarkBlog } from '../services/api.js';
import CommentSection from '../components/Blog/CommentSection.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useTheme } from '@mui/material/styles'; // Import useTheme to access the current theme

function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isFetching = useRef(false);
  const fetchCount = useRef(0);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const theme = useTheme(); // Access the current theme to check mode

  useEffect(() => {
    if (user && blog && blog.bookmarks) {
      setIsBookmarked(blog.bookmarks.includes(user.id));
    }
  }, [user, blog]);

  const fetchBlog = useCallback(async () => {
    if (!slug) {
      console.error('Slug is undefined in BlogPost');
      setError('Invalid blog URL');
      setIsLoading(false);
      return;
    }

    if (isFetching.current) {
      console.warn('Request already in progress, skipping duplicate fetch for slug:', slug);
      return;
    }
    isFetching.current = true;
    fetchCount.current += 1;
    console.log(`Fetching blog with slug: ${slug}, attempt #${fetchCount.current}, at: ${new Date().toISOString()}`);

    try {
      const response = await getBlog(slug);
      setBlog(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching blog - Full error:', err);
      setError(err.response?.data?.message || 'Failed to load blog');
    } finally {
      isFetching.current = false;
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    let mounted = true;
    fetchBlog();
    return () => {
      mounted = false;
    };
  }, [fetchBlog]);

  const handleLike = useCallback(async () => {
    if (!slug || !blog) {
      console.error('Cannot like: slug or blog is undefined');
      return;
    }
    try {
      await toggleLike(slug);
      setBlog((prev) => ({
        ...prev,
        likes: prev.likes.includes(user?.id)
          ? prev.likes.filter((id) => id !== user.id)
          : [...prev.likes, user.id]
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, [slug, blog, user?.id]);

  const handleBookmarkToggle = useCallback(async () => {
    if (!user || !slug) return;
    try {
      await toggleBookmarkBlog(slug);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }, [user, slug, isBookmarked]);

  const handleDelete = useCallback(async () => {
    if (!slug) {
      console.error('Cannot delete: slug is undefined');
      setError('Invalid blog URL');
      return;
    }
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteBlog(slug);
        console.log('Blog deleted successfully, navigating to homepage');
        navigate('/');
      } catch (error) {
        console.error('Error deleting blog - Full error:', error);
        setError(error.response?.data?.message || 'Failed to delete blog');
        alert('Failed to delete blog: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, bgcolor: 'background.default' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ py: 4, bgcolor: 'background.default' }}>
        <Typography variant="h6" color="text.primary">
          Blog not found
        </Typography>
      </Box>
    );
  }

  const isAuthor = user && blog.author && blog.author._id && user.id && blog.author._id.toString() === user.id.toString();
  const canEditDelete = user && (isAuthor || user.role === 'admin');

  return (
    <Box sx={{ bgcolor: 'background.default', p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper', p: 2, mb: 4 }}>
        {blog.featuredImage && (
          <Box sx={{ maxWidth: '100%', mb: 4 }}>
            <img
              src={blog.featuredImage}
              alt={blog.title}
              style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </Box>
        )}
        <Typography variant="h3" sx={{ color: 'primary.main', textAlign: 'center' }} gutterBottom>{blog.title}</Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
          By <span style={{ color: 'text.primary' }}>{blog.author?.username}</span> | {new Date(blog.createdAt).toLocaleDateString()} | {blog.views} views
        </Typography>
      </Box>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          color: 'text.primary',
          '& p, & h1, & h2, & h3, & h4, & h5, & h6, & span, & div': {
            color: 'inherit',
          },
        }}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <Box sx={{ mt: 2, bgcolor: 'background.paper', p: 2 }}>
        <IconButton 
          onClick={handleLike} 
          aria-label={blog.likes.includes(user?.id) ? 'Unlike' : 'Like'} 
          sx={{
            color: blog.likes.includes(user?.id) 
              ? (theme.palette.mode === 'dark' ? '#ffffff' : '#000000') // White fill in dark mode, black in light mode
              : (theme.palette.mode === 'dark' ? '#ffffff' : 'inherit'), // White outline in dark mode, inherit in light mode
          }}
        >
          {blog.likes.includes(user?.id) ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" component="span" sx={{ ml: 1, verticalAlign: 'middle', color: 'text.primary' }}>
          {blog.likes.length} {blog.likes.length === 1 ? 'Like' : 'Likes'}
        </Typography>
        {user && (
          <IconButton 
            onClick={handleBookmarkToggle} 
            aria-label={isBookmarked ? 'Remove Bookmark' : 'Bookmark'} 
            sx={{
              ml: 2,
              color: isBookmarked 
                ? (theme.palette.mode === 'dark' ? '#ffffff' : '#000000') // White fill in dark mode, black in light mode
                : (theme.palette.mode === 'dark' ? '#ffffff' : 'inherit'), // White outline in dark mode, inherit in light mode
            }}
          >
            {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        )}
        {canEditDelete && (
          <>
            <Button component={Link} to={`/create-post?slug=${slug}`} variant="outlined" sx={{ ml: 2, color: 'primary.main', bgcolor: 'transparent' }}>
              Edit
            </Button>
            <Button onClick={handleDelete} variant="outlined" color="error" sx={{ ml: 2, bgcolor: 'transparent' }}>
              Delete
            </Button>
          </>
        )}
      </Box>
      <Divider sx={{ my: 4, bgcolor: 'background.paper', borderColor: 'text.secondary' }} />
      <CommentSection slug={slug} />
    </Box>
  );
}

export default BlogPost;