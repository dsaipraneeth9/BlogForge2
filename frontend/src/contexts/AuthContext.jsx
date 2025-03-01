// import { createContext, useState, useEffect } from 'react';
// import { loginUser, logoutUser, registerUser } from '../services/auth.js';

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   const [loading, setLoading] = useState(true); // Add loading state to handle initial token verification

//   // Function to verify token with backend
//   const verifyToken = async (token) => {
//     if (!token) {
//       console.warn('No token provided for verification');
//       return null;
//     }
//     try {
//       console.log('Verifying token with backend:', token);
//       const response = await fetch('http://localhost:5000/api/users/verify-token', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!response.ok) {
//         console.error('Token verification failed - Status:', response.status, 'Message:', await response.text());
//         throw new Error('Invalid token');
//       }
//       const data = await response.json();
//       console.log('Token verification response:', data);
//       return data.user;
//     } catch (error) {
//       console.error('Token verification failed:', error);
//       return null;
//     }
//   };

//   // Initialize authentication on mount, verifying the token with the backend
//   useEffect(() => {
//     const initializeAuth = async () => {
//       const storedToken = localStorage.getItem('token');
//       console.log('Stored token from localStorage:', storedToken);
//       if (storedToken) {
//         console.log('Initializing auth with stored token:', storedToken);
//         const verifiedUser = await verifyToken(storedToken);
//         console.log('Verified user from backend:', verifiedUser);
//         if (verifiedUser) {
//           setUser(verifiedUser);
//           setToken(storedToken); // Ensure token is set
//         } else {
//           setUser(null);
//           setToken(null);
//           localStorage.removeItem('token');
//           console.warn('Token invalid or expired, cleared localStorage');
//         }
//       } else {
//         setUser(null);
//         setToken(null);
//         console.warn('No token found in localStorage');
//       }
//       setLoading(false);
//     };
//     initializeAuth();
//   }, []);

//   // Handle login by calling the backend and setting user/token state
//   const login = async (credentials) => {
//     console.log('Logging in with credentials:', credentials);
//     try {
//       const { data } = await loginUser(credentials);
//       console.log('Login response:', data);
//       if (!data.token) throw new Error('No token received from server');
//       setUser({ username: data.username, email: data.email, photo: data.photo, role: data.role || 'user' });
//       setToken(data.token);
//       localStorage.setItem('token', data.token);
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     }
//   };

//   // Handle registration by calling the backend and setting user/token state
//   const register = async (formData) => {
//     try {
//       const { data } = await registerUser(formData);
//       setUser({ username: data.newUser.username, email: data.newUser.email, photo: data.newUser.photo, role: data.newUser.role || 'user' });
//       setToken(data.token);
//       localStorage.setItem('token', data.token);
//     } catch (error) {
//       console.error('Registration failed:', error);
//       throw error;
//     }
//   };

//   // Handle logout by calling the backend, clearing state, and redirecting
//   const logout = async () => {
//     try {
//       console.log('Attempting logout with token in localStorage:', localStorage.getItem('token'));
//       const response = await logoutUser(); // Capture response for debugging
//       console.log('Logout response:', response);
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem('token');
//       console.log('Logged out successfully');
//     } catch (error) {
//       console.error('Logout failed - Full error:', error);
//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
//         console.error('Response headers:', error.response.headers);
//       } else if (error.request) {
//         console.error('No response received:', error.request);
//       } else {
//         console.error('Error setting up request:', error.message);
//       }
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem('token');
//     }
//   };

//   // Render loading state or the app based on authentication status
//   if (loading) {
//     return <div>Loading...</div>; // Optional loading spinner or component
//   }

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

import { createContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, registerUser } from '../services/auth.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async (token) => {
    if (!token) {
      console.warn('No token provided for verification');
      return null;
    }
    try {
      console.log('Verifying token with backend:', token);
      const response = await fetch('http://localhost:5000/api/users/verify-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error('Token verification failed - Status:', response.status, 'Message:', await response.text());
        throw new Error('Invalid token');
      }
      const data = await response.json();
      console.log('Token verification response:', data);
      if (!data.user || !data.user._id) {
        throw new Error('User data or ID missing from token verification');
      }
      return {
        id: data.user._id, // Ensure this is a string or matches the format of comment.user._id
        username: data.user.username,
        email: data.user.email,
        photo: data.user.photo,
        role: data.user.role || 'user'
      };
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      console.log('Stored token from localStorage:', storedToken);
      if (storedToken) {
        console.log('Initializing auth with stored token:', storedToken);
        const verifiedUser = await verifyToken(storedToken);
        console.log('Verified user from backend:', verifiedUser);
        if (verifiedUser && verifiedUser.id) {
          setUser(verifiedUser);
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          console.warn('Token invalid or expired, cleared localStorage');
        }
      } else {
        setUser(null);
        setToken(null);
        console.warn('No token found in localStorage');
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (credentials) => {
    console.log('Logging in with credentials:', credentials);
    try {
      const { data } = await loginUser(credentials);
      console.log('Login response:', data);
      if (!data.token || !data.user || !data.user._id) {
        throw new Error('No token or user ID received from server');
      }
      setUser({
        id: data.user._id, // Ensure this matches the MongoDB ObjectId format
        username: data.user.username,
        email: data.user.email,
        photo: data.user.photo,
        role: data.user.role || 'user'
      });
      setToken(data.token);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await registerUser(formData);
      if (!data.token || !data.newUser || !data.newUser._id) {
        throw new Error('No token or user ID received from server');
      }
      setUser({
        id: data.newUser._id, // Ensure this matches the MongoDB ObjectId format
        username: data.newUser.username,
        email: data.newUser.email,
        photo: data.newUser.photo,
        role: data.newUser.role || 'user'
      });
      setToken(data.token);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout with token in localStorage:', localStorage.getItem('token'));
      const response = await logoutUser();
      console.log('Logout response:', response);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout failed - Full error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}