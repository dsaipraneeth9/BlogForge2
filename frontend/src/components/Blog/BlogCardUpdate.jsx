// import { useState } from 'react';
// import { Box, Card, CardContent, TextField, Button } from '@mui/material';
// import { updateBlog } from '../../services/api.js';

// function BlogCardUpdate({ blog, setBlogs, setSelectedBlog }) {
//   const [title, setTitle] = useState(blog.title);
//   const [content, setContent] = useState(blog.content);
//   const [loading, setLoading] = useState(false);

//   const handleUpdate = async () => {
//     try {
//         await updateBlog(blog.slug, { title, content }); // Using slug instead of ID
//         alert('Blog updated successfully!');
//     } catch (error) {
//         console.error('Update failed:', error);
//         alert('Failed to update blog.');
//     }
// };


//   return (
//     <Box sx={{ mb: 3 }}>
//       <Card>
//         <CardContent>
//           <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
//           <TextField
//             fullWidth
//             multiline
//             label="Content"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             rows={4}
//           />
//           <Button onClick={handleUpdate} variant="contained" disabled={loading} sx={{ mt: 2 }}>
//             {loading ? 'Updating...' : 'Update'}
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default BlogCardUpdate;

import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button } from '@mui/material';
import { updateBlog, getBlogs } from '../../services/api.js';

function BlogCardUpdate({ blog, setBlogs, setSelectedBlog }) {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (featuredImage) formData.append("featuredImage", featuredImage);
  
      await updateBlog(blog.slug, formData);
      alert("Blog updated successfully!");
  
      try {
        const updatedBlogs = await getBlogs({ author: blog.author });
        setBlogs(updatedBlogs.data.blogs);
      } catch (error) {
        console.error("Failed to fetch updated blogs:", error);
      }
  
      setSelectedBlog(null);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box sx={{ mb: 3, bgcolor: 'background.default' }}>
      <Card
        sx={{
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: theme => `0 4px 8px rgba(${theme.palette.mode === 'dark' ? '255, 255, 255' : '0, 0, 0'}, 0.1)`,
          },
          bgcolor: 'background.paper',
        }}
      >
        <CardContent>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2, bgcolor: 'background.paper', '& .MuiInputLabel-root': { color: 'text.secondary' } }}
          />
          <TextField
            fullWidth
            multiline
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            sx={{ mb: 2, bgcolor: 'background.paper' }}
          />
          {blog.featuredImage && (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              style={{ maxWidth: '100%', maxHeight: '140px', marginBottom: '16px', objectFit: 'cover' }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFeaturedImage(e.target.files[0])}
            style={{ marginBottom: 16 }}
          />
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
                transition: 'background-color 0.3s ease',
              },
            }}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
          <Button
            onClick={() => setSelectedBlog(null)}
            variant="outlined"
            sx={{
              mt: 2,
              ml: 2,
              color: 'primary.main',
              bgcolor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'background-color 0.3s ease',
              },
            }}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default BlogCardUpdate;