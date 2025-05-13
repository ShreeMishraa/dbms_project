import { Alert, Box } from '@mui/material'

const BackendErrorAlert = () => {
  return (
    <Box sx={{ 
      position: 'fixed', 
      top: '4rem', 
      left: '50%', 
      transform: 'translateX(-50%)',
      zIndex: 9999,
      width: '90%',
      maxWidth: '600px'
    }}>
      <Alert severity="error" variant="filled">
        Cannot connect to the server. Please check if the backend is running on port 3001.
      </Alert>
    </Box>
  )
}

export default BackendErrorAlert