import { Routes, Route, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Header from './components/Common/Header.jsx';
import Footer from './components/Common/Footer.jsx';
import Home from './pages/Home.jsx';
import BlogPost from './pages/BlogPost.jsx';
import CreatePost from './pages/CreatePost.jsx';
import Profile from './pages/Profile.jsx';
import Search from './pages/Search.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import ForgotPassword from './components/Auth/ForgotPassword.jsx';
import ResetPassword from './components/Auth/ResetPassword.jsx';
import ProtectedRoute from './components/Common/ProtectedRoute.jsx';
import AuthorDashboard from './components/Dashboard/AuthorDashboard.jsx';
import AdminDashboard from './components/Dashboard/AdminDashboard.jsx';
import Saved from './pages/Saved.jsx';

function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <TransitionGroup>
          <CSSTransition
            key={location.pathname}
            classNames="page"
            timeout={300}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              <Route element={<ProtectedRoute allowedRoles={['user', 'author', 'admin']} />}>
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/saved" element={<Saved />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['author']} />}>
                <Route path="/dashboard/author" element={<AuthorDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
      </Container>
      <Footer />
    </>
  );
}

export default App;