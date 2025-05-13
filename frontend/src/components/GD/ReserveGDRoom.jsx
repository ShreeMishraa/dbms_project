import { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Typography,
  Box
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { reserveGDRoom } from '../../services/api';

const ReserveGDRoom = ({ open, onClose, room, onSuccess }) => {
  const [reservationData, setReservationData] = useState({
    room_id: room?.id || '',
    reservation_time: dayjs(),
    duration_minutes: 60
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setReservationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await reserveGDRoom({
        ...reservationData,
        room_id: room.id,
        reservation_time: reservationData.reservation_time.toISOString()
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to reserve room');
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reserve {room.room_name}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Capacity: {room.capacity} people
        </Typography>
        
        <Box sx={{ mb: 2, mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Reservation Time"
              value={reservationData.reservation_time}
              onChange={(newValue) => handleChange('reservation_time', newValue)}
              minDateTime={dayjs()}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Box>
        
        <TextField
          label="Duration (minutes)"
          type="number"
          fullWidth
          value={reservationData.duration_minutes}
          onChange={(e) => handleChange('duration_minutes', parseInt(e.target.value))}
          inputProps={{ min: 30, max: 180 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : 'Confirm Reservation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReserveGDRoom;