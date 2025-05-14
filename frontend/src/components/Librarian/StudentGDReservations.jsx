import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer, TableHead, TableRow,
  TableCell, TableBody, Button, CircularProgress, Alert, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { getAllGDReservations, deleteGDReservation } from '../../services/api';
import toast from 'react-hot-toast';

const StudentGDReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getAllGDReservations();
      setReservations(data);
    } catch (err) {
      setError('Failed to fetch GD reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (reservation) => {
    setSelectedReservation(reservation);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteGDReservation(selectedReservation.gd_reservation_id);
      setReservations(reservations.filter(r => r.gd_reservation_id !== selectedReservation.gd_reservation_id));
      setOpenDeleteDialog(false);
      toast.success('GD reservation deleted successfully');
    } catch (err) {
      setError('Failed to delete GD reservation');
      toast.error('Failed to delete GD reservation');
    }
  };

  if (loading) return <CircularProgress />;
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        All Student GD Room Reservations
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Roll No</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Reservation Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.gd_reservation_id}>
                <TableCell>{reservation.student_name}</TableCell>
                <TableCell>{reservation.roll_no}</TableCell>
                <TableCell>{reservation.room_name}</TableCell>
                <TableCell>
                  {new Date(reservation.reservation_time).toLocaleString()}
                </TableCell>
                <TableCell>{reservation.duration_minutes} mins</TableCell>
                <TableCell>
                  <Chip 
                    label={reservation.status} 
                    color={reservation.status === 'upcoming' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteClick(reservation)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedReservation?.student_name}'s reservation for "{selectedReservation?.room_name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentGDReservations;