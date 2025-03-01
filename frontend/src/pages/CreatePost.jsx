import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Typography, Alert, Box } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import SafeBlogEditor from '../components/Blog/BlogEditor.jsx';
import { createBlog, updateBlog, getBlog } from '../services/api.js';

function CreatePost() {
  const [searchParams] = useSearchParams();
  const [initialData, setInitialData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const slug = searchParams.get('slug');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (slug) {
      const fetchBlog = async () => {
        try {
          const response = await getBlog(slug);
          setInitialData(response.data);
        } catch (err) {
          setError('Failed to load post: ' + (err.response?.data?.message || err.message));
          console.error('Error fetching blog:', err);
        }
      };
      fetchBlog();
    }
  }, [slug]);

  const handleSubmit = async (formData) => {
    try {
      if (slug) {
        await updateBlog(slug, formData);
      } else {
        await createBlog(formData);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
      console.error('Error submitting blog:', err);
    }
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default' }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }} gutterBottom>{slug ? 'Edit Post' : 'Create New Post'}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary' }}>{error}</Alert>}
      {console.log('Rendering CreatePost with initialData:', initialData, 'User:', user)}
      <SafeBlogEditor onSubmit={handleSubmit} initialData={initialData} />
    </Box>
  );
}

export default CreatePost;