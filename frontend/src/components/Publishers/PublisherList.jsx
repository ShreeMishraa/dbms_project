import { useState, useEffect, useContext } from 'react'
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'

import { getPublishers, deletePublisher } from '../../services/api'
import AuthContext from '../../context/AuthContext'

// Dialog forms
import AddPublisher from './AddPublisher'
import EditPublisher from './EditPublisher'
import toast from 'react-hot-toast'


const PublisherList = () => {
  const { user } = useContext(AuthContext)

  const [publishers, setPublishers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Delete dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedPublisher, setSelectedPublisher] = useState(null)

  // Add dialog
  const [openAddDialog, setOpenAddDialog] = useState(false)

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPublisherForEdit, setSelectedPublisherForEdit] = useState(null)

  useEffect(() => {
    fetchPublishers()
  }, [])

  const fetchPublishers = async () => {
    try {
      const data = await getPublishers()
      setPublishers(data)
    } catch (err) {
      setError('Failed to fetch publishers')
    } finally {
      setLoading(false)
    }
  }

  // ADD
  const handleAddSuccess = () => {
    setOpenAddDialog(false)
    fetchPublishers()
    toast.success('Publisher added successfully')
  }

  // EDIT
  const handleEditClick = (publisher) => {
    const publisherId = publisher.publisher_id || publisher.id
    setSelectedPublisherForEdit({ ...publisher, id: publisherId })
    setEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    fetchPublishers()
  }

  // DELETE
  const handleDeleteClick = (publisher) => {
    const publisherId = publisher.publisher_id || publisher.id
    if (!publisherId) {
      setError('Invalid publisher ID')
      return
    }
    setSelectedPublisher({ ...publisher, id: publisherId })
    setOpenDeleteDialog(true)
  }

  // Update the handleDeleteConfirm function
  const handleDeleteConfirm = async () => {
    try {
      await deletePublisher(selectedPublisher.id);
      setPublishers(publishers.filter(p => (p.publisher_id || p.id) !== selectedPublisher.id));
      setOpenDeleteDialog(false);
      toast.success('Publisher deleted successfully');
    } catch (err) {
      setError('Failed to delete publisher');
      toast.error('Failed to delete publisher');
    }
  };

  const filteredPublishers = publishers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Typography>Loading...</Typography>
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Publishers
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Publishers"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {user?.role === 'librarian' && (
          <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
            Add New Publisher
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Contact</TableCell>
              {user?.role === 'librarian' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPublishers.map(publisher => (
              <TableRow key={publisher.publisher_id || publisher.id}>
                <TableCell>{publisher.name}</TableCell>
                <TableCell>{publisher.location}</TableCell>
                <TableCell>{publisher.contact}</TableCell>
                {user?.role === 'librarian' && (
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(publisher)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(publisher)}
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

      {/* Delete Confirmation */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete publisher "
          {selectedPublisher?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Publisher */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Publisher</DialogTitle>
        <DialogContent>
          <AddPublisher onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Publisher */}
      <EditPublisher
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        publisher={selectedPublisherForEdit}
        onSuccess={handleEditSuccess}
      />
    </Box>
  )
}

export default PublisherList
