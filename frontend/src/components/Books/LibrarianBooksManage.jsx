import React, { useState, useEffect } from 'react'
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
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Delete, Edit } from '@mui/icons-material'
import { getBooks, getAuthors, getPublishers, deleteBook, updateBook } from '../../services/api'

const LibrarianBooksManage = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: '',
    isbn: '',
    genre: '',
    published_year: '',
    total_copies: 0,
    available_copies: 0,
    author_id: '',
    publisher_id: ''
  })
  const [authors, setAuthors] = useState([])
  const [publishers, setPublishers] = useState([])
  const [formLoading, setFormLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch books, authors and publishers data
        const [booksData, authorsData, publishersData] = await Promise.all([
          getBooks(),
          getAuthors(),
          getPublishers()
        ])
        
        // Format books to ensure consistent properties
        const formattedBooks = booksData.map(book => ({
          id: book.book_id,
          title: book.title,
          isbn: book.isbn || '',
          genre: book.genre || '',
          published_year: book.published_year || new Date().getFullYear(),
          total_copies: book.total_copies || 0,
          available_copies: book.available_copies || 0,
          author: { 
            id: book.author_id, 
            name: book.author_name || 'Unknown'
          },
          publisher: { 
            id: book.publisher_id, 
            name: book.publisher_name || 'Unknown'
          }
        }))
        
        // Format authors for consistent IDs
        const formattedAuthors = authorsData.map(author => ({
          id: author.author_id,
          name: author.name || 'Unknown Author'
        }))
        
        // Format publishers for consistent IDs
        const formattedPublishers = publishersData.map(publisher => ({
          id: publisher.publisher_id,
          name: publisher.name || 'Unknown Publisher'
        }))
        
        setBooks(formattedBooks)
        setAuthors(formattedAuthors)
        setPublishers(formattedPublishers)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to fetch data. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleDeleteClick = (book) => {
    setSelectedBook(book)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteBook(selectedBook.id)
      setBooks(books.filter(b => b.id !== selectedBook.id))
      setDeleteDialogOpen(false)
      setActionSuccess('Book deleted successfully')
      setTimeout(() => setActionSuccess(''), 3000)
    } catch (err) {
      console.error('Failed to delete book:', err)
      setError('Failed to delete book. Please try again.')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleEditClick = (book) => {
    if (!book || !book.author) {
      console.error('Invalid book data:', book)
      return
    }
    
    setSelectedBook(book)
    setEditFormData({
      title: book.title || '',
      isbn: book.isbn || '',
      genre: book.genre || '',
      published_year: book.published_year || new Date().getFullYear(),
      total_copies: book.total_copies || 0,
      available_copies: book.available_copies || 0,
      author_id: book.author?.id || '',
      publisher_id: book.publisher?.id || ''
    })
    setEditDialogOpen(true)
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value
    })
  }

  const handleEditSubmit = async () => {
    setFormLoading(true)
    try {
      await updateBook(selectedBook.id, editFormData)
      
      const updatedBooks = books.map(book => {
        if (book.id === selectedBook.id) {
          const updatedAuthor = authors.find(a => String(a.id) === String(editFormData.author_id))
          const updatedPublisher = publishers.find(p => String(p.id) === String(editFormData.publisher_id))
          
          return {
            ...book,
            ...editFormData,
            author: { 
              id: editFormData.author_id,
              name: updatedAuthor?.name || 'Unknown' 
            },
            publisher: { 
              id: editFormData.publisher_id,
              name: updatedPublisher?.name || 'Unknown'
            }
          }
        }
        return book
      })
      
      setBooks(updatedBooks)
      setEditDialogOpen(false)
      setActionSuccess('Book updated successfully')
      setTimeout(() => setActionSuccess(''), 3000)
    } catch (err) {
      console.error('Failed to update book:', err)
      setError('Failed to update book. Please try again.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setFormLoading(false)
    }
  }

  const filteredBooks = books.filter(book => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      book.title?.toLowerCase().includes(searchTermLower) ||
      book.author?.name?.toLowerCase().includes(searchTermLower) ||
      book.publisher?.name?.toLowerCase().includes(searchTermLower) ||
      book.genre?.toLowerCase().includes(searchTermLower)
    )
  })

  if (loading) return <CircularProgress />
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Books
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {actionSuccess}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Books"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/books/add"
        >
          Add New Book
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Published Year</TableCell>
              <TableCell>Total Copies</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author?.name || 'Unknown'}</TableCell>
                  <TableCell>{book.publisher?.name || 'Unknown'}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.published_year}</TableCell>
                  <TableCell>{book.total_copies}</TableCell>
                  <TableCell>{book.available_copies}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditClick(book)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(book)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No books found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{selectedBook?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, my: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={editFormData.title || ''}
              onChange={handleEditFormChange}
              fullWidth
              required
            />
            <TextField
              label="ISBN"
              name="isbn"
              value={editFormData.isbn || ''}
              onChange={handleEditFormChange}
              fullWidth
            />
            <TextField
              label="Genre"
              name="genre"
              value={editFormData.genre || ''}
              onChange={handleEditFormChange}
              fullWidth
            />
            <TextField
              label="Published Year"
              name="published_year"
              type="number"
              value={editFormData.published_year || ''}
              onChange={handleEditFormChange}
              fullWidth
            />
            <TextField
              label="Total Copies"
              name="total_copies"
              type="number"
              value={editFormData.total_copies || 0}
              onChange={handleEditFormChange}
              fullWidth
            />
            <TextField
              label="Available Copies"
              name="available_copies"
              type="number"
              value={editFormData.available_copies || 0}
              onChange={handleEditFormChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Author</InputLabel>
              <Select
                name="author_id"
                value={editFormData.author_id || ''}
                label="Author"
                onChange={handleEditFormChange}
              >
                {authors.map(author => (
                  <MenuItem key={author.id} value={author.id}>
                    {author.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Publisher</InputLabel>
              <Select
                name="publisher_id"
                value={editFormData.publisher_id || ''}
                label="Publisher"
                onChange={handleEditFormChange}
              >
                {publishers.map(publisher => (
                  <MenuItem key={publisher.id} value={publisher.id}>
                    {publisher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit} 
            color="primary"
            disabled={formLoading}
          >
            {formLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default LibrarianBooksManage