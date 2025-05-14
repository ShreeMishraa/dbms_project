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
  DialogActions,
  Switch,
  FormControlLabel
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
  const [showPaidFines, setShowPaidFines] = useState(false)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedFine, setSelectedFine] = useState(null)
  const [showDeletedFines, setShowDeletedFines] = useState(false);

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
      issued_date: '2025-05-01',
      is_deleted: 0
    },
    {
      id: 2,
      student_name: 'Jane Smith',
      roll_no: 'STU002',
      amount: 5.5,
      reason: 'Lost book',
      status: 'paid',
      issued_date: '2025-04-15',
      payment_date: '2025-04-20',
      is_deleted: 1
    }
  ]

  const displayFines = fines.length > 0 ? fines : mockFines

  // Update the filteredFines function
// Replace the filteredFines function with this implementation
// Replace the filteredFines function with this correct implementation
const filteredFines = fines.filter((fine) => {
  // Check if searchTerm matches
  const matchesSearch = 
    (fine.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fine.roll_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fine.reason || '').toLowerCase().includes(searchTerm.toLowerCase());
  
  // Check payment status
  const isPaid = (fine.payment_status === 'paid' || fine.status === 'paid');
  const shouldShowBasedOnPayment = showPaidFines ? true : !isPaid;
  
  // Check deletion status - Convert to proper boolean
  const isDeleted = fine.is_deleted === 1;
  // Only show deleted fines if showDeletedFines is true
  const shouldShowBasedOnDeletion = isDeleted ? showDeletedFines : true;
  
  return matchesSearch && shouldShowBasedOnPayment && shouldShowBasedOnDeletion;
});

  const getStatusChip = (status) => (
    <Chip
      label={status === 'paid' ? 'Paid' : 'Unpaid'}
      color={status === 'paid' ? 'success' : 'error'}
      size="small"
    />
  )

  const handleDeleteClick = (fine) => {
    setSelectedFine(fine)
    setOpenDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const fineId = selectedFine.fine_id || selectedFine.id;
      await deleteFine(fineId);
      // remove from local state
      setFines(prev => prev.filter(f => (f.fine_id || f.id) !== fineId));
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          All Student Fines
        </Typography>
        <Box>
          <TextField
            label="Search Fines"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showPaidFines}
                onChange={() => setShowPaidFines(!showPaidFines)}
                color="primary"
              />
            }
            label="Show Paid Fines"
            sx={{ mr: 1 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showDeletedFines}
                onChange={() => setShowDeletedFines(!showDeletedFines)}
                color="secondary"
              />
            }
            label="Show Deleted Fines"
          />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
