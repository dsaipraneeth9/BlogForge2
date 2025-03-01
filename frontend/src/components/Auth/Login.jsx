import { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    try {
      await login({ email: email.trim(), password: password.trim() });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4, bgcolor: 'background.default' }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }} gutterBottom>Login</Typography>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{error}</Alert>}
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error && !email.trim()}
        helperText={error && !email.trim() ? 'Email is required' : ''}
        sx={{ bgcolor: 'background.paper' }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!error && !password.trim()}
        helperText={error && !password.trim() ? 'Password is required' : ''}
        sx={{ bgcolor: 'background.paper' }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: '#1565c0',
            transition: 'background-color 0.3s ease',
          },
        }}
      >
        Login
      </Button>
      <Box sx={{ mt: 2, color: 'text.primary' }}>
        <Link to="/forgot-password" style={{ color: 'primary.main' }}>Forgot Password?</Link> | <Link to="/register" style={{ color: 'primary.main' }}>Register</Link>
      </Box>
    </Box>
  );
}

export default Login;