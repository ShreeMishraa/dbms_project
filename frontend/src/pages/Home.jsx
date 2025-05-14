import { Typography, Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'

const Home = () => {
  const { user } = useContext(AuthContext)

  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to the Library
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        {user ? `Hello, ${user.first_name}!` : 'Please login to continue'}
      </Typography>
      {!user && (
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" component={Link} to="/login" sx={{ mr: 2 }}>
            Login
          </Button>
          <Button variant="outlined" component={Link} to="/register">
            Register
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Home