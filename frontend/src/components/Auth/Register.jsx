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
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField label="Username" name="username" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Email" name="email" type="email" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Confirm Password" name="confirmPassword" type="password" fullWidth margin="normal" onChange={handleChange} />
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select name="role" value={formData.role} onChange={handleChange}>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="author">Author</MenuItem>
          <MenuItem value="admin">Admin</MenuItem> {/* Added admin option */}
        </Select>
      </FormControl>
      <input type="file" name="photo" accept="image/*" onChange={handleChange} style={{ marginTop: 16 }} />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
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