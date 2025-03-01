import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider as CustomThemeProvider, ThemeContext } from './contexts/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomThemeProvider>
        <AuthProvider>
          <ThemeContext.Consumer>
            {({ theme }) => (
              <MUIThemeProvider theme={theme}>
                <App />
              </MUIThemeProvider>
            )}
          </ThemeContext.Consumer>
        </AuthProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);