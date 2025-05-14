import { useState, useEffect, useContext } from 'react';
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
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { getReservations, returnBook } from '../../services/api';
import AuthContext from '../../context/AuthContext';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      const formattedData = data.map(reservation => ({
        id: reservation.reservation_id,
        book: {
          id: reservation.book_id,
          title: reservation.title || 'Unknown Title',
          author: { name: reservation.author_name || 'Unknown Author' }
        },
        reserved_date: reservation.reservation_date || new Date().toISOString(),
        due_date: reservation.due_date || new Date(Date.now() + 7*24*60*60*1000).toISOString(),
        status: reservation.status || 'active'
      }));
      setReservations(formattedData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
      setError('Failed to fetch reservations');
      setLoading(false);
    }
  };

  const handleReturnClick = (reservation) => {
    setSelectedReservation(reservation);
    setOpenReturnDialog(true);
  };

  const handleReturnConfirm = async () => {
    try {
      await returnBook(selectedReservation.id);
      setReservations(reservations.filter(r => r.id !== selectedReservation.id));
      setOpenReturnDialog(false);
    } catch (err) {
      setError('Failed to cancel reservation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'returned': return 'info';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" my={4}>
      <CircularProgress />
    </Box>
  );
  
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Reservations
      </Typography>
      
      {reservations.length === 0 ? (
        <Typography variant="body1">You have no active reservations.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Reserved Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.book?.title || 'Unknown'}</TableCell>
                  <TableCell>{reservation.book?.author?.name || 'Unknown'}</TableCell>
                  <TableCell>{new Date(reservation.reserved_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(reservation.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={reservation.status} 
                      color={getStatusColor(reservation.status)} 
                    />
                  </TableCell>
                  <TableCell>
                    {reservation.status === 'active' && (
                      <Button 
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleReturnClick(reservation)}
                      >
                        Cancel Reservation
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)}>
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel your reservation for "{selectedReservation?.book?.title || 'this book'}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReturnDialog(false)}>Keep Reservation</Button>
          <Button onClick={handleReturnConfirm} color="error">Cancel Reservation</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReservationList;
