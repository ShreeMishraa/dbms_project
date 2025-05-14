import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Box
} from '@mui/material';
import { updateProfile } from '../../services/api';
import toast from 'react-hot-toast';

const EditProfile = ({ open, onClose, user, onSuccess }) => {
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully');
      onSuccess();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="first_name"
            value={profileData.first_name}
            onChange={handleChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="last_name"
            value={profileData.last_name}
            onChange={handleChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfile;