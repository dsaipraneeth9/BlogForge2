import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { forgotPassword } from '../../services/auth.js';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(email);
      setMessage(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
      setMessage('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4, bgcolor: 'background.default' }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }} gutterBottom>Forgot Password</Typography>
      {message && <Alert severity="success" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{error}</Alert>}
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ bgcolor: 'background.paper' }}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: 'primary.main', color: 'white' }}>Send Reset Link</Button>
    </Box>
  );
}

export default ForgotPassword;