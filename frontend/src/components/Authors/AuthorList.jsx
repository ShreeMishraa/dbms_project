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
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import { getAuthors, deleteAuthor } from '../../services/api'
import AuthContext from '../../context/AuthContext'
import AddAuthor from './AddAuthor'
import EditAuthor from './EditAuthor'

const AuthorList = () => {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useContext(AuthContext)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedAuthor, setSelectedAuthor] = useState(null)

  const [openAddDialog, setOpenAddDialog] = useState(false)

  // From Code B: proper edit-click handler
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedAuthorForEdit, setSelectedAuthorForEdit] = useState(null)

  const [actionSuccess, setActionSuccess] = useState('')

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    try {
      const data = await getAuthors()
      const formatted = data.map(author => ({
        id: author.author_id,
        name: author.name || 'Unknown',
        nationality: author.nationality || '',
        biography: author.biography || ''
      }))
      setAuthors(formatted)
    } catch (err) {
      setError('Failed to fetch authors')
    } finally {
      setLoading(false)
    }
  }

  // Delete flow
  const handleDeleteClick = author => {
    setSelectedAuthor(author)
    setOpenDeleteDialog(true)
  }
  const handleDeleteConfirm = async () => {
    try {
      await deleteAuthor(selectedAuthor.id)
      setAuthors(prev => prev.filter(a => a.id !== selectedAuthor.id))
      setOpenDeleteDialog(false)
      setActionSuccess('Author deleted successfully')
      setTimeout(() => setActionSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete author')
      setTimeout(() => setError(''), 3000)
    }
  }

  // Add flow
  const handleAddSuccess = () => {
    setOpenAddDialog(false)
    fetchAuthors()
    setActionSuccess('Author added successfully')
    setTimeout(() => setActionSuccess(''), 3000)
  }

  // Code-B’s improved edit click
  const handleEditClick = author => {
    const authorId = author.author_id ?? author.id
    setSelectedAuthorForEdit({ ...author, id: authorId })
    setOpenEditDialog(true)
  }
  const handleEditSuccess = () => {
    setOpenEditDialog(false)
    fetchAuthors()
    setActionSuccess('Author updated successfully')
    setTimeout(() => setActionSuccess(''), 3000)
  }

  const filtered = authors.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.nationality && a.nationality.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) return <Typography>Loading authors...</Typography>

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Authors
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {actionSuccess && <Alert severity="success" sx={{ mb: 2 }}>{actionSuccess}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Authors"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {user?.role === 'librarian' && (
          <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
            Add New Author
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Nationality</TableCell>
              <TableCell>Biography</TableCell>
              {user?.role === 'librarian' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map(author => (
                <TableRow key={author.id}>
                  <TableCell>{author.name}</TableCell>
                  <TableCell>{author.nationality}</TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>{author.biography}</TableCell>
                  {user?.role === 'librarian' && (
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(author)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(author)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={user?.role === 'librarian' ? 4 : 3}
                  align="center"
                >
                  No authors found
                </TableCell>
              </TableRow>
            )}
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
          Are you sure you want to delete author "{selectedAuthor?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Author Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Author</DialogTitle>
        <DialogContent>
          <AddAuthor onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Author Dialog via EditAuthor’s own open/onClose */}
      <EditAuthor
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        author={selectedAuthorForEdit}
        onSuccess={handleEditSuccess}
      />
    </Box>
  )
}

export default AuthorList
