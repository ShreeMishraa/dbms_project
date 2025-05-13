import { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'

const LoginHelper = () => {
  const [showHelper, setShowHelper] = useState(false)
  
  return (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <Button 
        variant="text" 
        color="info" 
        size="small"
        onClick={() => setShowHelper(!showHelper)}
      >
        {showHelper ? 'Hide Login Help' : 'Need Help Logging In?'}
      </Button>
      
      {showHelper && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'left' }}>
          <Typography variant="subtitle2" gutterBottom>Test Accounts:</Typography>
          
          <Typography variant="body2" component="div">
            <strong>Student Login:</strong>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Email: john@example.com</li>
              <li>Password: student123</li>
            </Box>
          </Typography>
          
          <Typography variant="body2" component="div" sx={{ mt: 1 }}>
            <strong>Librarian Login:</strong>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Email: alice@library.com</li>
              <li>Password: lib123</li>
            </Box>
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default LoginHelper