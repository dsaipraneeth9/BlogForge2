import 'react-quill/dist/quill.snow.css';
import { useState, useContext } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import ReactQuill from 'react-quill';
import { ThemeContext } from '../../contexts/ThemeContext.jsx';

function BlogEditor({ onSubmit, initialData = {} }) {
  console.log('Rendering BlogEditor with initialData:', initialData);
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [category, setCategory] = useState(initialData.categories || '');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const { mode } = useContext(ThemeContext);

  const categories = [
    'Technology', 'Health & Fitness', 'Lifestyle', 'Travel', 'Food & Drink',
    'Business & Finance', 'Education', 'Entertainment', 'Fashion', 'Sports',
    'Science', 'Art & Culture', 'Personal Development', 'Parenting', 'News & Politics',
    'Music', 'Gaming', 'Environment', 'Self-Improvement', 'Books & Literature',
    'Relationships', 'History', 'Photography', 'Tech Reviews', 'Productivity',
    'DIY (Do It Yourself)', 'Social Media', 'Mental Health', 'Philosophy', 'Pets'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categories', category);
    if (featuredImage) formData.append('featuredImage', featuredImage);
    onSubmit(formData);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFeaturedImage(file);
      setFileName(file.name);
    }
  };

  const quillStyles = `
    .ql-toolbar {
      background-color: ${mode === 'dark' ? '#1e1e1e' : '#ffffff'} !important;
      border-color: ${mode === 'dark' ? '#b0b0b0' : '#333333'} !important;
    }
    .ql-toolbar .ql-picker-label,
    .ql-toolbar .ql-picker-item,
    .ql-toolbar button {
      color: ${mode === 'dark' ? '#ffffff' : '#000000'} !important;
    }
    .ql-editor {
      background-color: ${mode === 'dark' ? '#1e1e1e' : '#ffffff'} !important;
      color: ${mode === 'dark' ? '#ffffff' : '#000000'} !important;
    }
    .ql-container {
      border-color: ${mode === 'dark' ? '#b0b0b0' : '#333333'} !important;
    }
    .ql-snow .ql-tooltip {
      background-color: ${mode === 'dark' ? '#1e1e1e' : '#ffffff'} !important;
      color: ${mode === 'dark' ? '#ffffff' : '#000000'} !important;
      border-color: ${mode === 'dark' ? '#b0b0b0' : '#333333'} !important;
    }
  `;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, bgcolor: 'background.default' }}>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ bgcolor: 'background.paper', '& .MuiInputLabel-root': { color: 'text.secondary' } }}
      />
      <FormControl fullWidth margin="normal" sx={{ bgcolor: 'background.paper' }}>
        <InputLabel sx={{ color: 'text.secondary' }}>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} sx={{ color: 'text.primary' }}>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat} sx={{ color: 'text.primary' }}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <style>{quillStyles}</style>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        style={{ height: 300, marginBottom: 50 }}
      />
      
      {/* File upload section with filename display */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
        <Button
          variant="outlined"
          component="label"
          sx={{ bgcolor: 'background.paper', color: 'text.primary', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
        >
          Choose File
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </Button>
        
        {fileName && (
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {fileName}
          </Typography>
        )}
      </Box>
      
      <Button 
        type="submit" 
        variant="contained" 
        sx={{ mt: 2, bgcolor: 'primary.main', color: 'white' }}
      >
        {initialData.title ? 'Update Post' : 'Create Post'}
      </Button>
    </Box>
  );
}

export default function SafeBlogEditor(props) {
  try {
    return <BlogEditor {...props} />;
  } catch (error) {
    console.error('BlogEditor error:', error);
    return (
      <Box sx={{ bgcolor: 'background.default', p: 2 }}>
        <Typography variant="body1" sx={{ color: 'text.primary' }}>Error loading editor</Typography>
      </Box>
    );
  }
}