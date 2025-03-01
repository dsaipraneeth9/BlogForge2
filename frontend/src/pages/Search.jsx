import { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, TextField, Button, Alert, Box, Pagination, List, ListItem, ListItemText } from '@mui/material';
import BlogCard from '../components/Blog/BlogCard.jsx';
import { getBlogs } from '../services/api.js';
import debounce from 'lodash.debounce';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await getBlogs({ search: query, limit: 5 });
        setSuggestions(response.data.blogs);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to fetch suggestions');
      }
    }, 300),
    []
  );

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
      setSuggestions([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search blogs');
      console.error(err);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    handleSearch(event);
  };

  useEffect(() => {
    handleSearch({ preventDefault: () => {} });
  }, [page]);

  useEffect(() => {
    return () => {
      fetchSuggestions.cancel();
    };
  }, [fetchSuggestions]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setSuggestions([]);
    handleSearch({ preventDefault: () => {} });
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', width: '100vw', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 2, px: 2 }} gutterBottom>Search</Typography>
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4, position: 'relative', bgcolor: 'background.paper', p: 2, px: 2 }}>
        <TextField
          label="Search Blogs (Title, Author, or Category)"
          fullWidth
          value={searchQuery}
          onChange={handleInputChange}
          variant="outlined"
          autoFocus
          sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
        />
        {suggestions.length > 0 && (
          <List sx={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            right: 0, 
            bgcolor: 'background.paper', 
            border: '1px solid', 
            borderColor: 'text.secondary', 
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
                sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <ListItemText 
                  primary={suggestion.title} 
                  secondary={`By ${suggestion.author?.username}`} 
                  primaryTypographyProps={{ sx: { color: 'text.primary' } }} 
                  secondaryTypographyProps={{ sx: { color: 'text.secondary' } }}
                />
              </ListItem>
            ))}
          </List>
        )}
        <Button type="submit" variant="contained" sx={{ mt: 1, ml: 2, bgcolor: 'primary.main', color: 'white' }}>
          Search
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary', px: 2 }}> {error}</Alert>}
      <Grid container spacing={3} sx={{ bgcolor: 'background.default', width: '100%', px: 2, justifyContent: 'flex-start', ml: 2.4 }}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={3.8} key={blog._id}> {/* Changed md={3} to md={3.8} to match Home */}
            <BlogCard blog={blog} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', bgcolor: 'background.default', width: '100%', px: 2 }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" sx={{ bgcolor: 'background.paper' }} />
      </Box>
    </Box>
  );
}

export default Search;