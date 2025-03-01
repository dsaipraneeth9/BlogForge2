import { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';

function Register() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', photo: null, role: 'user'
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    try {
      await register(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4, bgcolor: 'background.default' }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }} gutterBottom>Register</Typography>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{error}</Alert>}
      <TextField label="Username" name="username" fullWidth margin="normal" onChange={handleChange} sx={{ bgcolor: 'background.paper' }} />
      <TextField label="Email" name="email" type="email" fullWidth margin="normal" onChange={handleChange} sx={{ bgcolor: 'background.paper' }} />
      <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} sx={{ bgcolor: 'background.paper' }} />
      <TextField label="Confirm Password" name="confirmPassword" type="password" fullWidth margin="normal" onChange={handleChange} sx={{ bgcolor: 'background.paper' }} />
      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ color: 'text.primary' }}>Role</InputLabel>
        <Select name="role" value={formData.role} onChange={handleChange} sx={{ bgcolor: 'background.paper' }}>
          <MenuItem value="user" sx={{ color: 'text.primary' }}>User</MenuItem>
          <MenuItem value="author" sx={{ color: 'text.primary' }}>Author</MenuItem>
          <MenuItem value="admin" sx={{ color: 'text.primary' }}>Admin</MenuItem>
        </Select>
      </FormControl>
      <input type="file" name="photo" accept="image/*" onChange={handleChange} style={{ marginTop: 16 }} />
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
        Register
      </Button>
    </Box>
  );
}

export default Register;