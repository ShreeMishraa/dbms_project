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
  DialogActions
} from '@mui/material';
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
      setReservations(data);
      setLoading(false);
    } catch (err) {
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
      setError('Failed to return book');
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Reservations
      </Typography>
      
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
                <TableCell>{reservation.book.title}</TableCell>
                <TableCell>{reservation.book.author.name}</TableCell>
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
                      onClick={() => handleReturnClick(reservation)}
                    >
                      Return
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)}>
        <DialogTitle>Confirm Return</DialogTitle>
        <DialogContent>
          Are you sure you want to return "{selectedReservation?.book.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReturnDialog(false)}>Cancel</Button>
          <Button onClick={handleReturnConfirm} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReservationList;