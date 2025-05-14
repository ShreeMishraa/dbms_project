import React, { useState, useContext } from 'react'
import {
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper
} from '@mui/material'
import { AdminPanelSettings } from '@mui/icons-material'
import toast from 'react-hot-toast'

import AuthContext from '../contexts/AuthContext'
import EditProfile from '../features/profile/EditProfile'

const Profile = () => {
  const { user } = useContext(AuthContext)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  if (!user) return null

  // Callback after successful edit
  const handleProfileUpdateSuccess = () => {
    setEditDialogOpen(false)
    // Optionally: refetch user data here
    toast.success('Profile updated successfully')
  }

  // Librarian view
  if (user.role === 'librarian') {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Librarian Profile
        </Typography>

        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mr: 3,
                bgcolor: 'primary.main'
              }}
            >
              <AdminPanelSettings fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5">Administrator</Typography>
              <Typography variant="body1" color="text.secondary">
                Library Management System
              </Typography>
            </Box>
          </Box>

          <List>
            <ListItem>
              <ListItemText primary="Role" secondary="Librarian" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Access Level" secondary="Administrative" />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Permissions"
                secondary="Full Access - Manage Books, Authors, Publishers, Fines"
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    )
  }

  // Student view
  const userDetails = [
    { label: 'Roll Number', value: user.roll_no },
    { label: 'Name', value: `${user.first_name} ${user.last_name}` },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone },
    {
      label: 'Date of Birth',
      value: user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'
    }
  ]

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 100, height: 100, mr: 3, bgcolor: 'primary.main' }}>
            {user.first_name?.charAt(0)}
          </Avatar>
          <Button variant="contained" onClick={() => setEditDialogOpen(true)}>
            Edit Profile
          </Button>
        </Box>

        <List>
          {userDetails.map((detail, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={detail.label}
                secondary={detail.value || 'Not provided'}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <EditProfile
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        user={user}
        onSuccess={handleProfileUpdateSuccess}
      />
    </Box>
  )
}

export default Profile
