// Update the room objects to accommodate different API response formats
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
  Button,
  Chip
} from '@mui/material';
import { getGDRooms } from '../../services/api';
import ReserveGDRoom from './ReserveGDRoom';
import { useNavigate } from 'react-router-dom';

const GDRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openReserveDialog, setOpenReserveDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await getGDRooms();
      // Normalize the data structure to ensure it works correctly
      const formattedRooms = data.map(room => ({
        id: room.room_id,
        room_name: room.room_name,
        capacity: room.capacity,
        reservations: room.reservations || []
      }));
      setRooms(formattedRooms);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch GD rooms:', err);
      setError('Failed to fetch GD rooms. Please try again later.');
      setLoading(false);
    }
  };

  const handleReserveClick = (room) => {
    setSelectedRoom(room);
    setOpenReserveDialog(true);
  };

  const handleReserveSuccess = () => {
    setOpenReserveDialog(false);
    navigate('/my-gd-reservations');
  };

  const getAvailabilityStatus = (room) => {
    const currentReservations = room.reservations?.length || 0;
    const available = room.capacity - currentReservations;
    
    if (available <= 0) return { text: 'Full', color: 'error' };
    if (available < room.capacity / 2) return { text: 'Limited', color: 'warning' };
    return { text: 'Available', color: 'success' };
  };

  if (loading) return <Typography>Loading GD rooms...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Group Discussion Rooms
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Name</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Current Reservations</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.length > 0 ? (
              rooms.map((room) => {
                const status = getAvailabilityStatus(room);
                return (
                  <TableRow key={room.id}>
                    <TableCell>{room.room_name}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.reservations?.length || 0}</TableCell>
                    <TableCell>
                      <Chip label={status.text} color={status.color} />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        onClick={() => handleReserveClick(room)}
                        disabled={status.text === 'Full'}
                      >
                        Reserve
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No GD rooms available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ReserveGDRoom
        open={openReserveDialog}
        onClose={() => setOpenReserveDialog(false)}
        room={selectedRoom}
        onSuccess={handleReserveSuccess}
      />
    </Box>
  );
};

export default GDRoomList;