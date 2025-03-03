import { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, TextField, Button, Alert, Box, Pagination, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, IconButton, Collapse } from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material'; // Import FilterList icon
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
  
  // Filter states
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false); // Toggle filter panel

  // Sample data (replace with dynamic fetching if needed)
  const authors = ['Author 1', 'Author 2', 'Author 3']; // Fetch dynamically in production
  const categories = [
    'Technology', 'Health & Fitness', 'Lifestyle', 'Travel', 'Food & Drink',
    'Business & Finance', 'Education', 'Entertainment', 'Fashion', 'Sports',
    'Science', 'Art & Culture', 'Personal Development', 'Parenting', 'News & Politics',
    'Music', 'Gaming', 'Environment', 'Self-Improvement', 'Books & Literature',
    'Relationships', 'History', 'Photography', 'Tech Reviews', 'Productivity',
    'DIY (Do It Yourself)', 'Social Media', 'Mental Health', 'Philosophy', 'Pets'
  ];

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
      const params = { 
        search: searchQuery, 
        author, // Will need to be author ID or adjust backend to accept username
        category,
        sortBy: sortBy === 'views' ? 'views' : undefined,
        page,
        limit: 3 
      };
      const response = await getBlogs(params);
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
    handleSearch({ preventDefault: () => {} });
  };

  useEffect(() => {
    handleSearch({ preventDefault: () => {} });
  }, [page, author, category, sortBy]); // Trigger search when filters or page change

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

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', width: '100vw', boxSizing: 'border-box', overflowX: 'hidden', ml: -4 }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 2, px: 2 }} gutterBottom>Search</Typography>
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4, bgcolor: 'background.paper', p: 2, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
          <TextField
            label="Search Blogs (Title or Category)"
            fullWidth
            value={searchQuery}
            onChange={handleInputChange}
            variant="outlined"
            autoFocus
            sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
          />
          <IconButton 
            onClick={toggleFilters} 
            sx={{ color: 'text.primary' }}
            aria-label="Toggle filters"
          >
            <FilterListIcon />
          </IconButton>
          {suggestions.length > 0 && (
            <List sx={{ 
              position: 'absolute', 
              top: '100%', 
              left: 16, 
              right: 16, 
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
          <Button type="submit" variant="contained" sx={{ bgcolor: 'primary.main', color: 'white' }}>
            Search
          </Button>
        </Box>

        {/* Filter Panel */}
        <Collapse in={filtersOpen}>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Author</InputLabel>
              <Select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                label="Author"
              >
                <MenuItem value="">All Authors</MenuItem>
                {authors.map((auth) => (
                  <MenuItem key={auth} value={auth}>{auth}</MenuItem>
                ))}
              </Select>
            </FormControl> */}

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={ sortBy || "Latest" }
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="Latest">Latest</MenuItem>
                <MenuItem value="views">Popularity (Views)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Collapse>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper', color: 'text.primary', px: 2 }}> {error}</Alert>}
      <Grid container spacing={3} sx={{ bgcolor: 'background.default', width: '100%', px: 2, justifyContent: 'flex-start', ml: 2.4 }}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={3.8} key={blog._id}>
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