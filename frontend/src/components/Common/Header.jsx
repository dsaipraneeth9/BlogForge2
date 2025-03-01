import { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, CircularProgress, IconButton } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { ThemeContext } from '../../contexts/ThemeContext.jsx'; // Import ThemeContext
import { Brightness4, Brightness7 } from '@mui/icons-material'; // Import theme toggle icons

function Header() {
  const { user, logout, loading } = useContext(AuthContext);
  const { mode, toggleTheme } = useContext(ThemeContext); // Access theme state and toggle from context
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redirect to home or login page after logout
  };

  const isActive = (path) => location.pathname === path; // Check if the current path matches

  if (loading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            BlogForge
          </Typography>
          <CircularProgress size={24} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          BlogForge
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'background-color 0.3s ease',
              },
              backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              borderBottom: isActive('/') ? '2px solid white' : 'none',
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/search"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'background-color 0.3s ease',
              },
              backgroundColor: isActive('/search') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              borderBottom: isActive('/search') ? '2px solid white' : 'none',
            }}
          >
            Search
          </Button>
          {user ? (
            <>
              {(user.role === 'author' || user.role === 'admin') && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/create-post"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transition: 'background-color 0.3s ease',
                    },
                    backgroundColor: isActive('/create-post') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    borderBottom: isActive('/create-post') ? '2px solid white' : 'none',
                  }}
                >
                  Create Post
                </Button>
              )}
              {(user.role === 'author' || user.role === 'admin') && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/dashboard/author"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transition: 'background-color 0.3s ease',
                    },
                    backgroundColor: isActive('/dashboard/author') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    borderBottom: isActive('/dashboard/author') ? '2px solid white' : 'none',
                  }}
                >
                  Dashboard
                </Button>
              )}
              <Button
                color="inherit"
                component={Link}
                to="/saved"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transition: 'background-color 0.3s ease',
                  },
                  backgroundColor: isActive('/saved') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  borderBottom: isActive('/saved') ? '2px solid white' : 'none',
                }}
              >
                Saved
              </Button>
              <Button color="inherit" component={Link} to="/profile">
                <Avatar src={user.photo} sx={{ width: 32, height: 32, mr: 1, borderRadius: '50%' }} />
                {user.username}
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transition: 'background-color 0.3s ease',
                  },
                }}
              >
                Logout
              </Button>
              <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
                {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transition: 'background-color 0.3s ease',
                  },
                  backgroundColor: isActive('/login') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  borderBottom: isActive('/login') ? '2px solid white' : 'none',
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transition: 'background-color 0.3s ease',
                  },
                  backgroundColor: isActive('/register') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  borderBottom: isActive('/register') ? '2px solid white' : 'none',
                }}
              >
                Register
              </Button>
              <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
                {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;