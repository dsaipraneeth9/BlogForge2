import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8, bgcolor: 'background.default' }}>
      <Typography variant="h2" sx={{ color: 'text.primary' }} gutterBottom>404</Typography>
      <Typography variant="h5" sx={{ color: 'text.primary' }} gutterBottom>Page Not Found</Typography>
      <Typography sx={{ color: 'text.primary' }}>
        Go back to <Link to="/" style={{ color: 'primary.main' }}>Home</Link>
      </Typography>
    </Box>
  );
}

export default NotFound;