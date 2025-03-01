import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.default', p: 2, mt: 'auto', textAlign: 'center' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        © 2025 BlogForge. All rights reserved. | 
        <Link to="/" style={{ color: 'primary.main', ml: 1 }}>Home</Link>
      </Typography>
    </Box>
  );
}

export default Footer;