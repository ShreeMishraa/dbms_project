import { Box, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.primary.main }}>
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} Library Management System
      </Typography>
    </Box>
  )
}

export default Footer