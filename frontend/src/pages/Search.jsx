import { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, TextField, Button, Alert, Box, Pagination, List, ListItem, ListItemText } from '@mui/material';
import BlogCard from '../components/Blog/BlogCard.jsx';
import { getBlogs } from '../services/api.js';
import debounce from 'lodash.debounce';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // State for search suggestions
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  // Debounced function to fetch suggestions
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) { // Only fetch suggestions for queries longer than 1 character
        setSuggestions([]);
        return;
      }
      try {
        const response = await getBlogs({ search: query, limit: 5 }); // Limit to 5 suggestions
        setSuggestions(response.data.blogs);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to fetch suggestions');
      }
    }, 300), // Debounce delay of 300ms
    []
  );

  // Handle input change for real-time suggestions
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSuggestions(query);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await getBlogs({ 
        search: searchQuery, 
        page,
        limit: 3 
      });
      setBlogs(response.data.blogs);
      setTotalPages(response.data.pages);
      setError('');
      setSuggestions([]); // Clear suggestions when performing a full search
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search blogs');
      console.error(err);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    handleSearch(event); // Refetch blogs with the new page number
  };

  // Fetch blogs on initial load or page change
  useEffect(() => {
    handleSearch({ preventDefault: () => {} }); // Initial load with empty query
  }, [page]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      fetchSuggestions.cancel();
    };
  }, [fetchSuggestions]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title); // Set the search query to the selected suggestion
    setSuggestions([]); // Clear suggestions
    handleSearch({ preventDefault: () => {} }); // Perform the search with the suggestion
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Search</Typography>
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4, position: 'relative' }}>
        <TextField
          label="Search Blogs (Title, Author, or Category)"
          fullWidth
          value={searchQuery}
          onChange={handleInputChange}
          variant="outlined"
          autoFocus
        />
        { suggestions.length > 0 && (
  <List sx={{ 
    position: 'absolute', 
    top: '100%', 
    left: 0, 
    right: 0, 
    bgcolor: 'lightgrey', 
    border: '1px solid #ccc', 
    borderRadius: 1, 
    maxHeight: 200, 
    overflowY: 'auto', 
    zIndex: 1000 
  }}>
    {suggestions.map((suggestion) => (
      <ListItem 
        key={suggestion._id} 
        button 
        onClick={() => handleSuggestionClick(suggestion)}
        sx={{ '&:hover': { bgcolor: '#555' } }} // Darker grey on hover
      >
        <ListItemText 
          primary={suggestion.title} 
          secondary={`By ${suggestion.author?.username}`} 
          primaryTypographyProps={{ style: { color: 'black', fontSize: "large" } }} // Keep title in cream
          secondaryTypographyProps={{ style: { color: 'white' } }} // Change author to dark grey
        />
      </ListItem>
    ))}
  </List>
)}
        <Button type="submit" variant="contained" sx={{ mt: 1, ml: 2 }}>
          Search
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <BlogCard blog={blog} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
      </Box>
    </Box>
  );
}

export default Search;