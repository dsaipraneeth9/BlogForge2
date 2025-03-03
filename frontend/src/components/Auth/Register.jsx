import { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Alert, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material'; // Import camera icon
import { useTheme } from '@mui/material/styles'; // For theme-aware styling

function Register() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', photo: null, role: 'user'
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme(); // Access the current theme

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
      {/* Circular image upload area */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <label htmlFor="photoInput">
          <IconButton
            component="span"
            sx={{
              width: 120, // Smaller circle (120px diameter)
              height: 120,
              borderRadius: '50%', // Circular shape
              bgcolor: 'background.paper',
              border: `2px dashed ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`, // Subtle dashed border
              '&:hover': {
                bgcolor: 'background.paper',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', // Lighter border on hover
                cursor: 'pointer',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              position: 'relative', // For image overlay
            }}
          >
            {formData.photo ? (
              <img
                src={URL.createObjectURL(formData.photo)}
                alt="Profile Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            ) : (
              <CameraAltIcon sx={{ color: theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary', fontSize: 40 }} />
            )}
          </IconButton>
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          id="photoInput"
          style={{ display: 'none' }} // Hide the default file input
        />
      </Box>

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