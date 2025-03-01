// // import { useContext } from 'react';
// // import { Navigate } from 'react-router-dom';
// // import { AuthContext } from '../../contexts/AuthContext.jsx';

// // function ProtectedRoute({ children }) {
// //   const { token, loading, user } = useContext(AuthContext);
// //   console.log('ProtectedRoute - Token:', token, 'Loading:', loading, 'User:', user);

// //   if (loading) {
// //     return <div>Loading...</div>;
// //   }

// //   if (!token) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   return children;
// // }

// // export default ProtectedRoute;


// import { useContext } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { AuthContext } from '../../contexts/AuthContext.jsx';

// function ProtectedRoute({ allowedRoles }) {
//   const { token, loading, user } = useContext(AuthContext);

//   console.log('ProtectedRoute - Token:', token, 'Loading:', loading, 'User:', user);

//   if (loading) {
//     return <div>Loading...</div>; // Ensure it does not stay stuck here forever
//   }

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     console.warn(`Access denied for role: ${user?.role}`);
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// }

// export default ProtectedRoute;


// import { useContext } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { AuthContext } from '../../contexts/AuthContext.jsx';

// function ProtectedRoute({ allowedRoles }) {
//   const { token, loading, user } = useContext(AuthContext);

//   console.log('ProtectedRoute - Token:', token, 'Loading:', loading, 'User:', user);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     console.warn(`Access denied for role: ${user?.role}`);
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// }

// export default ProtectedRoute;


import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';

function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return  <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.warn(`Access denied for role: ${user?.role}`);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;