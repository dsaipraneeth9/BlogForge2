import { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, IconButton, Divider, Avatar } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { createComment, getComments, deleteComment } from '../../services/api.js';
import { AuthContext } from '../../contexts/AuthContext.jsx';

function CommentSection({ slug }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(slug);
        console.log('Fetched comments:', response.data);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createComment(slug, newComment);
      setComments((prev) => [response.data, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      console.log(`Attempting to delete comment with ID ${commentId} from blog slug ${slug} by user ${user?.id} (role: ${user?.role})`);
      await deleteComment(slug, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment - Full error:', error);
      alert('Failed to delete comment: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const canDeleteComment = (comment) => {
    console.log('Checking if user can delete comment - User:', user, 'Comment User ID:', comment.user._id);
    // Allow deletion if the user is the comment owner (user/author) or an admin
    const canDelete = user && (user.role === 'admin' || comment.user._id === user.id);
    console.log('Can delete:', canDelete);
    return canDelete;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Comments</Typography>
      {user ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
          <TextField
            label="Add a comment"
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>Post Comment</Button>
        </Box>
      ) : (
        <Typography>Please login to comment</Typography>
      )}
      <List>
        {comments.map((comment, index) => (
          <div key={comment._id}>
            <ListItem
              secondaryAction={
                canDeleteComment(comment) && (
                  <IconButton edge="end" onClick={() => handleDelete(comment._id)}>
                    <Delete />
                  </IconButton>
                )
              }
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
                  '& .MuiListItemText-primary': {
                    fontSize: '1.4rem', // Increase font size for primary text (comment content)
                  },
                  '& .MuiListItemText-secondary': {
                    fontSize: '0.9rem', // Optional: Adjust font size for secondary text (username and date)
                  },
                }}
              />
            </ListItem>
            {index < comments.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Box>
  );
}

export default CommentSection;