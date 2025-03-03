import { Card, CardContent, CardMedia, Typography, Button, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { toggleBookmarkBlog } from '../../services/api.js';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types'; // Ensure PropTypes is imported

function BlogCard({ blog }) {
  const { user } = useContext(AuthContext);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (user && blog.bookmarks) {
      setIsBookmarked(blog.bookmarks.includes(user.id));
    }
  }, [user, blog.bookmarks]);

  const handleBookmarkToggle = async () => {
    if (!user) return;
    try {
      await toggleBookmarkBlog(blog.slug);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const getExcerpt = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const plainText = temp.textContent || temp.innerText || '';
    return plainText.substring(0, 150) + '...'; // Keep the increased excerpt length for readability
  };

  return (
    <Card
      sx={{
        borderRadius: 2, // Keep rounded corners
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Keep original transition
        '&:hover': {
          transform: 'scale(1.05)', // Keep hover scale
          boxShadow: theme => `0 6px 12px rgba(${theme.palette.mode === 'dark' ? '255, 255, 255' : '0, 0, 0'}, 0.3)`, // Enhanced shadow from improvement
        },
        bgcolor: 'background.paper',
        border: theme => theme.palette.mode === 'dark' ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid rgba(0, 0, 0, 0.1)', // Subtle border from improvement
        boxShadow: theme => theme.palette.mode === 'dark' ? '0 0 12px rgba(255, 255, 255, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.1)', // Enhanced shadow in dark mode from improvement
        animation: 'fadeIn 1s ease-in-out', // Keep fadeIn animation
      }}
    >
      {blog.featuredImage && (
        <CardMedia
          component="img"
          height="250" // Restore original height
          image={blog.featuredImage}
          alt={blog.title}
          loading="lazy" // Keep lazy loading for performance
          sx={{
            objectFit: 'cover',
            maxWidth: '100%', // Restore original maxWidth
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2, // Match card rounding
          }}
        />
      )}
      <CardContent sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Typography
          variant="h5" // Keep increased title size for prominence
          component={Link}
          to={`/blog/${blog.slug}`}
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 1,
            '&:hover': {
              color: 'primary.dark',
              textDecoration: 'underline',
            },
          }}
        >
          {blog.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, lineHeight: 1.6 }} // Keep improved line spacing
        >
          By{' '}
          <span style={{ color: 'text.primary', fontWeight: '500' }}>{blog.author?.username}</span>{' '}
          | {new Date(blog.createdAt).toLocaleDateString()} | {blog.views} views | {blog.likes.length} likes
        </Typography>
        <Typography
          variant="body1" // Keep increased excerpt size for readability
          color="text.primary"
          sx={{ mb: 2, lineHeight: 1.6 }} // Keep improved line spacing
        >
          {getExcerpt(blog.content)}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, bgcolor: 'background.paper' }}>
          <Button
            component={Link}
            to={`/blog/${blog.slug}`}
            size="small"
            sx={{
              mt: 1,
              bgcolor: 'transparent',
              color: 'primary.main',
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                borderColor: 'primary.dark',
                transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
              },
            }}
          >
            Read More
          </Button>
          {user && (
            <IconButton
              onClick={handleBookmarkToggle}
              aria-label={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
              sx={{
                color: isBookmarked
                  ? theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
                  : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)', // Subtle outline in light mode
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)', // Subtle hover effect
                },
              }}
            >
              {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          )}
        </Box>
      </CardContent>

      {/* CSS Animation for fadeIn */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Card>
  );
}

BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string,
    }),
    featuredImage: PropTypes.string,
    views: PropTypes.number,
    likes: PropTypes.arrayOf(PropTypes.string),
    bookmarks: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
  }).isRequired,
};

export default BlogCard;