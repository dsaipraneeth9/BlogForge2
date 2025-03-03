import { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, CircularProgress, IconButton, Badge, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material'; // Corrected imports
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { ThemeContext } from '../../contexts/ThemeContext.jsx'; // Import ThemeContext
import { Brightness4, Brightness7, Notifications as NotificationsIcon, Delete as DeleteIcon } from '@mui/icons-material'; // Corrected import for DeleteIcon
import { getNotifications } from '../../services/api.js'; // Import API call for notifications
import { useTheme } from '@mui/material/styles'; // For theme-aware styling
import { deleteNotification } from '../../services/api.js'; // New import for deleting notifications

function Header() {
  const { user, logout, loading } = useContext(AuthContext);
  const { mode, toggleTheme } = useContext(ThemeContext); // Access theme state and toggle from context
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme(); // Access the current theme for styling
  const [anchorEl, setAnchorEl] = useState(null); // For notification dropdown
  const [notifications, setNotifications] = useState([]); // Store notifications
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationNavigate = (blogSlug, notificationId) => {
    // Find the notification by ID to check its read status
    const notification = notifications.find(n => n._id === notificationId);
    if (notification && !notification.read) {
      // Decrement unreadCount if the notification was unread
      setUnreadCount(prev => prev - 1);
      // Update the notification's read status locally
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    }
    navigate(`/blog/${blogSlug}`);
    handleNotificationClose();
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId); // Delete notification from backend
      // Update frontend state by filtering out the deleted notification
      setNotifications(notifications.filter(n => n._id !== notificationId));
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0); // Decrease unread count if applicable
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redirect to home or login page after logout
  };

  const isActive = (path) => location.pathname === path; // Check if the current path matches

  if (loading) {
    return (
      <AppBar position="static" sx={{ bgcolor: mode === 'dark' ? '#1e1e1e' : '#1976d2' }}>
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
    <AppBar position="static" sx={{ bgcolor: mode === 'dark' ? '#1e1e1e' : '#1976d2' }}>
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
              <IconButton
                color="inherit"
                onClick={handleNotificationClick}
                sx={{ ml: 1 }}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: theme.palette.mode === 'dark' ? 'red' : 'error.main', // Red badge for both themes
                      color: 'white',
                      fontSize: '0.7rem',
                      minWidth: 16,
                      height: 16,
                      borderRadius: 8,
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
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
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiPaper-root': {
              bgcolor: 'background.paper',
              color: 'text.primary',
              maxWidth: 300,
              '& .MuiMenuItem-root': {
                whiteSpace: 'normal', // Allow text wrapping for long messages
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              },
            },
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={notification._id}>
                <MenuItem
                  sx={{
                    bgcolor: notification.read ? 'transparent' : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Light background for unread in both themes
                    fontWeight: notification.read ? 'normal' : 'bold', // Bold text for unread
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Box onClick={() => handleNotificationNavigate(notification.blog.slug, notification._id)}>
                      {notification.message} - {new Date(notification.createdAt).toLocaleString()}
                    </Box>
                    <IconButton
                      onClick={() => handleDeleteNotification(notification._id)}
                      size="small"
                      sx={{
                        color: theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary', // White in dark, gray in light
                        '&:hover': {
                          color: 'error.main', // Red on hover for visibility
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </MenuItem>
                {index < notifications.length - 1 && <Divider sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }} />}
              </div>
            ))
          ) : (
            <MenuItem disabled>No notifications</MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;