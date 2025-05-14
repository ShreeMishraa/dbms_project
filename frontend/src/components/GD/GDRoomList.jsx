import React, { useState, useEffect, useContext } from 'react'
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { getGDRooms, deleteGDRoom } from '../../services/api'
import AuthContext from '../../context/AuthContext'
import ReserveGDRoom from './ReserveGDRoom'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const GDRoomList = () => {
  const { user } = useContext(AuthContext)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [openReserveDialog, setOpenReserveDialog] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRoomForDelete, setSelectedRoomForDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const data = await getGDRooms()
      const formattedRooms = data.map(room => ({
        id: room.room_id,
        room_name: room.room_name,
        capacity: room.capacity,
        reservations: room.reservations || []
      }))
      setRooms(formattedRooms)
    } catch (err) {
      console.error('Failed to fetch GD rooms:', err)
      setError('Failed to fetch GD rooms. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleReserveClick = room => {
    setSelectedRoom(room)
    setOpenReserveDialog(true)
  }

  const handleReserveSuccess = () => {
    setOpenReserveDialog(false)
    navigate('/my-gd-reservations')
  }

  const handleDeleteClick = room => {
    setSelectedRoomForDelete(room)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteGDRoom(selectedRoomForDelete.id)
      setRooms(prev => prev.filter(r => r.id !== selectedRoomForDelete.id))
      setDeleteDialogOpen(false)
      toast.success('GD Room deleted successfully')
    } catch (err) {
      console.error('Failed to delete GD room:', err)
      toast.error('Failed to delete GD room')
    }
  }

  const getAvailabilityStatus = room => {
    const current = room.reservations.length
    const available = room.capacity - current
    if (available <= 0) return { text: 'Full', color: 'error' }
    if (available < room.capacity / 2) return { text: 'Limited', color: 'warning' }
    return { text: 'Available', color: 'success' }
  }

  if (loading) return <Typography>Loading GD rooms...</Typography>
  if (error) return <Typography color="error">{error}</Typography>

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
              rooms.map(room => {
                const status = getAvailabilityStatus(room)
                return (
                  <TableRow key={room.id}>
                    <TableCell>{room.room_name}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.reservations.length}</TableCell>
                    <TableCell>
                      <Chip label={status.text} color={status.color} />
                    </TableCell>
                    <TableCell>
                      {user?.role === 'librarian' && (
                        <IconButton color="error" onClick={() => handleDeleteClick(room)}>
                          <Delete />
                        </IconButton>
                      )}
                      <Button
                        variant="outlined"
                        onClick={() => handleReserveClick(room)}
                        disabled={status.text === 'Full'}
                        sx={{ ml: user?.role === 'librarian' ? 1 : 0 }}
                      >
                        Reserve
                      </Button>
                    </TableCell>
                  </TableRow>
                )
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

      {/* Reserve Dialog */}
      <ReserveGDRoom
        open={openReserveDialog}
        onClose={() => setOpenReserveDialog(false)}
        room={selectedRoom}
        onSuccess={handleReserveSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the room "{selectedRoomForDelete?.room_name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default GDRoomList
