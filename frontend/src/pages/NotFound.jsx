import { Typography, Box } from '@mui/material'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" gutterBottom>404</Typography>
      <Typography variant="h5" gutterBottom>Page Not Found</Typography>
      <Typography>
        Go back to <Link to="/">Home</Link>
      </Typography>
    </Box>
  )
}

export default NotFound