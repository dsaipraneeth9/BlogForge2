import { useContext, useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material'; // Ensure all are imported
import { AuthContext } from '../contexts/AuthContext.jsx';
import { updateProfile } from '../services/api.js';

function Profile() {
  const { user } = useContext(AuthContext);
  console.log('Profile - User context:', user);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Profile useEffect - User:', user);
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    } else {
      console.warn('No user found in useEffect');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated');
      return;
    }
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (photo) formData.append('photo', photo);
    try {
      console.log('Submitting profile update for user.id:', user.id);
      await updateProfile(user.id, formData);
      setError('Profile updated successfully');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (!user) {
    console.warn('User not found in Profile');
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h6">User not found. Please log in.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      {error && <Alert severity={error.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        style={{ marginTop: 20 }}
      />
      <Button type="submit" variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Update Profile
      </Button>
    </Box>
  );
}

export default Profile;