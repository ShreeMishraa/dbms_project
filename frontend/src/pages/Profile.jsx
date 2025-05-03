import { Typography, Box, Avatar, List, ListItem, ListItemText, Button } from '@mui/material'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const Profile = () => {
  const { user } = useContext(AuthContext)

  if (!user) return null

  const userDetails = [
    { label: 'Roll Number', value: user.roll_no },
    { label: 'Name', value: `${user.first_name} ${user.last_name}` },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone },
    { label: 'Date of Birth', value: new Date(user.dob).toLocaleDateString() },
  ]

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 100, height: 100, mr: 3 }}>
          {user.first_name.charAt(0)}
        </Avatar>
        <Button variant="contained">Edit Profile</Button>
      </Box>
      
      <List>
        {userDetails.map((detail, index) => (
          <ListItem key={index}>
            <ListItemText primary={detail.label} secondary={detail.value} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default Profile