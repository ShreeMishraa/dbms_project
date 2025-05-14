import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { getMyGDReservations, cancelGDReservation } from '../../services/api';

const MyGDReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getMyGDReservations();
      // Transform data to ensure it has the expected structure
      const formattedData = data.map(reservation => ({
        id: reservation.gd_reservation_id,
        room: {
          id: reservation.room_id,
          room_name: reservation.room_name || `Room ${reservation.room_id}`
        },
        reservation_time: reservation.reservation_time,
        duration_minutes: reservation.duration_minutes || 60,
        status: reservation.status || 'upcoming'
      }));
      setReservations(formattedData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch GD reservations:', err);
      setError('Failed to fetch reservations');
      setLoading(false);
    }
  };

  const handleCancelClick = (reservation) => {
    setSelectedReservation(reservation);
    setOpenCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await cancelGDReservation(selectedReservation.id);
      setReservations(reservations.filter(r => r.id !== selectedReservation.id));
      setOpenCancelDialog(false);
    } catch (err) {
      setError('Failed to cancel reservation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Safe filtering that handles potential undefined values
  const filteredReservations = reservations.filter(reservation => {
    const roomName = reservation.room?.room_name?.toLowerCase() || '';
    const status = reservation.status?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return roomName.includes(search) || status.includes(search);
  });

  if (loading) return (
    <Box display="flex" justifyContent="center" my={4}>
      <CircularProgress />
    </Box>
  );
  
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My GD Room Reservations
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search Reservations"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </Box>
      
      {filteredReservations.length === 0 ? (
        <Typography variant="body1">You have no group discussion room reservations.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>Reservation Time</TableCell>
                <TableCell>Duration (mins)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservations.map((reservation) => {
                const reservationTime = new Date(reservation.reservation_time);
                const now = new Date();
                const isPast = reservationTime < now;
                const status = reservation.status || (isPast ? 'completed' : 'upcoming');
                
                return (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.room?.room_name || 'Unknown Room'}</TableCell>
                    <TableCell>
                      {isNaN(reservationTime) ? 'Invalid Date' : reservationTime.toLocaleString()}
                    </TableCell>
                    <TableCell>{reservation.duration_minutes}</TableCell>
                    <TableCell>
                      <Chip 
                        label={status} 
                        color={getStatusColor(status)} 
                      />
                    </TableCell>
                    <TableCell>
                    {!isPast && status !== 'cancelled' && (
                      <Button 
                        variant="outlined" 
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleCancelClick(reservation)}
                      >
                        Cancel Reservation
                      </Button>
                    )}
                  </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel your reservation for {selectedReservation?.room?.room_name || 'this room'}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>No, Keep It</Button>
          <Button 
            onClick={handleCancelConfirm} 
            color="error"
            startIcon={<Delete />}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyGDReservations;