import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ReactQuill from "react-quill";

function BlogEditor({ onSubmit, initialData = {} }) {
  console.log('Rendering BlogEditor with initialData:', initialData);
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [category, setCategory] = useState(initialData.categories || '');
  const [featuredImage, setFeaturedImage] = useState(null);

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

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        style={{ height: 300, marginBottom: 50 }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFeaturedImage(e.target.files[0])}
        style={{ marginTop: 20 }}
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
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
    return <div>Error loading editor</div>;
  }
}

