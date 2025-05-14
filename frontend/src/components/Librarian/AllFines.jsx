import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
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
  TextField,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import toast from 'react-hot-toast'

import { getAllFines, deleteFine } from '../../services/api'
import AuthContext from '../../context/AuthContext'

const AllFines = () => {
  const { user } = useContext(AuthContext)

  const [fines, setFines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Delete dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedFine, setSelectedFine] = useState(null)

  useEffect(() => {
    const fetchAllFines = async () => {
      try {
        const data = await getAllFines()
        setFines(data || [])
      } catch (err) {
        console.error('Failed to fetch fines:', err)
        setError('Failed to fetch fines')
      } finally {
        setLoading(false)
      }
    }

    fetchAllFines()
  }, [])

  const mockFines = [
    {
      id: 1,
      student_name: 'John Doe',
      roll_no: 'STU001',
      amount: 10.0,
      reason: 'Overdue book return',
      status: 'unpaid',
      issued_date: '2025-05-01'
    },
    {
      id: 2,
      student_name: 'Jane Smith',
      roll_no: 'STU002',
      amount: 5.5,
      reason: 'Lost book',
      status: 'paid',
      issued_date: '2025-04-15',
      payment_date: '2025-04-20'
    }
  ]

  const displayFines = fines.length > 0 ? fines : mockFines

  const filteredFines = displayFines.filter((fine) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (fine.student_name || '').toLowerCase().includes(searchLower) ||
      (fine.roll_no || '').toLowerCase().includes(searchLower) ||
      (fine.reason || '').toLowerCase().includes(searchLower)
    )
  })

  const getStatusChip = (status) => (
    <Chip
      label={status === 'paid' ? 'Paid' : 'Unpaid'}
      color={status === 'paid' ? 'success' : 'error'}
      size="small"
    />
  )

  // DELETE handlers
  const handleDeleteClick = (fine) => {
    setSelectedFine(fine)
    setOpenDeleteDialog(true)
  }

  // Update the handleDeleteConfirm function
  const handleDeleteConfirm = async () => {
    try {
      // Make sure we're using the correct ID property
      const fineId = selectedFine?.fine_id || selectedFine?.id;
      
      await deleteFine(fineId);
      
      // Update the UI to remove the deleted fine
      setFines(fines.filter(f => (f.fine_id || f.id) !== fineId));
      setOpenDeleteDialog(false);
      toast.success('Fine deleted successfully');
    } catch (err) {
      console.error('Error deleting fine:', err);
      setError('Failed to delete fine');
      toast.error('Failed to delete fine');
    }
  };

  if (loading) return <CircularProgress />

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        All Student Fines
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Fines"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        {user?.role === 'librarian' && (
          <Button
            variant="contained"
            component={Link}
            to="/librarian/fines/issue"
          >
            Issue New Fine
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Roll No</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Issued Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Date</TableCell>
              {user?.role === 'librarian' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFines.map((fine) => (
              <TableRow key={fine.id || fine.fine_id}>
                <TableCell>{fine.student_name}</TableCell>
                <TableCell>{fine.roll_no}</TableCell>
                <TableCell>
                  ${parseFloat(fine.amount).toFixed(2)}
                </TableCell>
                <TableCell>{fine.reason}</TableCell>
                <TableCell>
                  {new Date(fine.issued_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {getStatusChip(fine.status || fine.payment_status)}
                </TableCell>
                <TableCell>
                  {fine.payment_date
                    ? new Date(fine.payment_date).toLocaleDateString()
                    : '-'}
                </TableCell>
                {user?.role === 'librarian' && (
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(fine)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this fine of $
          {parseFloat(selectedFine?.amount || 0).toFixed(2)} for{' '}
          {selectedFine?.student_name || 'this student'}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AllFines
