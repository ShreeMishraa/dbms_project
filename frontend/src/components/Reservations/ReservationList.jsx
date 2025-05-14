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
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { getReservations, returnBook } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';

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
      // Fix: Use reservation_id instead of id
      const reservationId = selectedReservation.reservation_id || selectedReservation.id;
      
      // Add detailed logging
      console.log('Returning book with reservation ID:', reservationId);
      
      await returnBook(reservationId);
      
      // Remove this reservation from the list
      setReservations(prev => prev.filter(r => 
        (r.reservation_id || r.id) !== reservationId
      ));
      
      setOpenReturnDialog(false);
      toast.success('Book returned successfully');
    } catch (err) {
      console.error('Return book error details:', err);
      const errorMsg = err?.message || 'Failed to return book';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    
    switch (normalizedStatus) {
      case 'active': return 'success';
      case 'pending': return 'warning';
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
                      label={reservation.status || 'pending'} 
                      color={getStatusColor(reservation.status)} 
                    />
                  </TableCell>
                  <TableCell>
                    {(reservation.status === 'active' || reservation.status === 'pending') && (
                      <IconButton
                        color="error"
                        aria-label="cancel reservation"
                        onClick={() => handleReturnClick(reservation)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)}>
        <DialogTitle>Cancel Book Reservation</DialogTitle>
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