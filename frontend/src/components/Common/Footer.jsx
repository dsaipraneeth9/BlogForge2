import { Box, Typography } from '@mui/material'

function Footer() {
  return (
    <Box sx={{ py: 2, textAlign: 'center', mt: 4, borderTop: '1px solid #e0e0e0' }}>
      <Typography variant="body2" color="text.secondary">
        © 2025 BlogForge. All rights reserved.
      </Typography>
    </Box>
  )
}

export default Footer