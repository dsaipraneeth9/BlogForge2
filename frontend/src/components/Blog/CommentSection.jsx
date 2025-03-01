import { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, IconButton, Divider, Avatar, Alert } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { createComment, getComments, deleteComment } from '../../services/api.js';
import { AuthContext } from '../../contexts/AuthContext.jsx';

function CommentSection({ slug }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(slug);
        console.log('Fetched comments:', response.data);
        setComments(response.data || []); // Ensure comments is always an array
        setError('');
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to fetch comments');
      }
    };
    fetchComments();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to post a comment');
      return;
    }
    try {
      const response = await createComment(slug, newComment);
      setComments([response.data, ...comments]);
      setNewComment('');
      setError('');
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!user) {
      setError('Please log in to delete comments');
      return;
    }
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(slug, commentId);
        setComments(comments.filter((c) => c._id !== commentId));
        setError('');
      } catch (err) {
        setError('Failed to delete comment');
        console.error('Error deleting comment:', err);
      }
    }
  };

  const canDeleteComment = (comment) => {
    // Safely check if user and comment.user exist before accessing properties
    if (!user || !comment?.user) {
      return false; // Default to false if user or comment.user is undefined
    }
    const userId = user.id?.toString(); // Ensure user.id is a string or handle undefined
    const commentUserId = comment.user._id?.toString(); // Ensure comment.user._id is a string or handle undefined
    return user.role === 'admin' || (userId && commentUserId && userId === commentUserId);
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Typography variant="h5" sx={{ color: 'text.primary', bgcolor: 'background.paper', p: 2 }} gutterBottom>Comments</Typography>
      {user ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2, bgcolor: 'background.paper', p: 2 }}>
          <TextField
            label="Add a comment"
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 1, color: 'white', bgcolor: 'primary.main' }}>
            Post Comment
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{error}</Alert>}
        </Box>
      ) : (
        <Typography sx={{ color: 'text.primary', bgcolor: 'background.paper', p: 2 }}>Please login to comment</Typography>
      )}
      <List sx={{ bgcolor: 'background.paper' }}>
        {comments.map((comment) => (
          <div key={comment._id}>
            <ListItem
              secondaryAction={
                canDeleteComment(comment) && (
                  <IconButton edge="end" onClick={() => handleDelete(comment._id)} sx={{ color: 'error.main' }}>
                    <Delete />
                  </IconButton>
                )
              }
              sx={{ bgcolor: 'background.paper' }}
            >
              <ListItemText
                primary={comment.content}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={comment.user?.photo || ''} alt={comment.user?.username || 'Anonymous'} sx={{ width: 24, height: 24 }} />
                    {`By ${comment.user?.username || 'Anonymous'} - ${new Date(comment.createdAt).toLocaleDateString()}`}
                  </Box>
                }
                sx={{
                  '& .MuiListItemText-primary': { color: 'text.primary' },
                  '& .MuiListItemText-secondary': { color: 'text.secondary' },
                }}
              />
            </ListItem>
            <Divider sx={{ bgcolor: 'background.paper', borderColor: 'text.secondary' }} />
          </div>
        ))}
      </List>
      {error && !user && <Alert severity="error" sx={{ mt: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{error}</Alert>}
    </Box>
  );
}

export default CommentSection;