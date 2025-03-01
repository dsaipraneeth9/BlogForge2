import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  direction: 'ltr', // Ensure direction is explicitly set (default is 'ltr' for left-to-right)
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1976d2' }, // Blue
          secondary: { main: '#dc004e' }, // Red
          cream: { main: '#f5f5dc' }, // Cream background
          background: {
            default: '#f5f5dc',
            paper: '#ffffff',
          },
          text: {
            primary: '#000000',
            secondary: '#333333',
          },
        }
      : {
          primary: { main: '#90caf9' }, // Lighter blue for contrast
          secondary: { main: '#f48fb1' }, // Lighter red for contrast
          cream: { main: '#424242' }, // Dark gray for cream background
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
          },
        }),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease, transform 0.3s ease',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'wheat' : 'rgba(255, 255, 255, 0.1)',
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));