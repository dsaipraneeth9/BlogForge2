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
import { updateBlog,getBlogs} from '../../services/api.js';

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
        // ✅ Wrap getBlogs in another try-catch to prevent it from triggering the failure alert
        const updatedBlogs = await getBlogs({ author: blog.author });
        setBlogs(updatedBlogs.data.blogs);
      } catch (error) {
        console.error("Failed to fetch updated blogs:", error);
       
      }
  
      setSelectedBlog(null); // Close the editor after updating
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box sx={{ mb: 3 }}>
      <Card
        sx={{
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)', // Slight scale on hover
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Enhanced shadow on hover
          },
        }}
      >
        <CardContent>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#b8860b' } }} // Optional: style the label in dark goldenrod
          />
          <TextField
            fullWidth
            multiline
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            sx={{ mb: 2 }}
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
              '&:hover': {
                backgroundColor: '#1565c0', // Darker primary color on hover
                transition: 'background-color 0.3s ease',
              },
            }}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
          <Button
            onClick={() => setSelectedBlog(null)} // Cancel editing
            variant="outlined"
            sx={{
              mt: 2,
              ml: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle hover effect
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