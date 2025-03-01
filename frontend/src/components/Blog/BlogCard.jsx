import { Card, CardContent, CardMedia, Typography, Button, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { toggleBookmarkBlog } from '../../services/api.js';

function BlogCard({ blog }) {
  const { user } = useContext(AuthContext);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
    return plainText.substring(0, 100) + '...';
  };

  return (
    <Card
      sx={{
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: theme => `0 4px 8px rgba(${theme.palette.mode === 'dark' ? '255, 255, 255' : '0, 0, 0'}, 0.2)`,
        },
        bgcolor: 'background.paper', // Theme-aware background for the card
      }}
    >
      {blog.featuredImage && (
        <CardMedia
          component="img"
          height="140"
          image={blog.featuredImage}
          alt={blog.title}
        />
      )}
      <CardContent>
        <Typography variant="h6" component={Link} to={`/blog/${blog.slug}`} sx={{ textDecoration: 'none', color: 'primary.main' }}>
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          By <span style={{ color: 'text.primary' }}>{blog.author?.username}</span> | {new Date(blog.createdAt).toLocaleDateString()} | {blog.views} views | {blog.likes.length} likes
        </Typography>
        <Typography variant="body2" color="text.primary">
          {getExcerpt(blog.content)}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Button
            component={Link}
            to={`/blog/${blog.slug}`}
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              },
              bgcolor: 'transparent', // Use theme for button background
            }}
          >
            Read More
          </Button>
          {user && (
            <IconButton onClick={handleBookmarkToggle} aria-label={isBookmarked ? 'Remove Bookmark' : 'Bookmark'} sx={{ color: isBookmarked ? 'black' : 'inherit' }}>
              {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default BlogCard;