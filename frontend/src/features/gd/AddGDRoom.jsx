import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const AddGDRoom = () => {
  const [roomData, setRoomData] = useState({
    room_name: '',
    capacity: 6
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({
      ...roomData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await axios.post('/api/gd/rooms', {
        room_name: roomData.room_name,
        capacity: parseInt(roomData.capacity)
      });
      
      setSuccess(true);
      setRoomData({
        room_name: '',
        capacity: 6
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add GD room');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New GD Room
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          GD room added successfully
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Room Name"
          name="room_name"
          value={roomData.room_name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
          helperText="Give a descriptive name to the GD room"
        />
        
        <TextField
          label="Capacity"
          name="capacity"
          type="number"
          value={roomData.capacity}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
          helperText="Maximum number of students that can use this room"
          inputProps={{ min: 1 }}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Adding...' : 'Add Room'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddGDRoom;