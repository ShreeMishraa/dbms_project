import { useState, useEffect } from 'react'
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { addBook, getAuthors, getPublishers } from '../../services/api'

const AddBook = () => {
  const [bookData, setBookData] = useState({
    isbn: '',
    title: '',
    genre: '',
    total_copies: 1,
    author_id: '',
    publisher_id: '',
    published_year: new Date().getFullYear()
  })

  const [authors, setAuthors] = useState([])
  const [publishers, setPublishers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsData, publishersData] = await Promise.all([
          getAuthors(),
          getPublishers()
        ])
        
        // Format authors and publishers for consistent IDs
        const formattedAuthors = authorsData.map(author => ({
          id: author.author_id || author.id,
          name: author.name || 'Unknown Author'
        }))
        
        const formattedPublishers = publishersData.map(publisher => ({
          id: publisher.publisher_id || publisher.id,
          name: publisher.name || 'Unknown Publisher'
        }))
        
        setAuthors(formattedAuthors)
        setPublishers(formattedPublishers)
      } catch (err) {
        setError('Failed to fetch required data')
      }
    }
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setBookData(prev => ({
      ...prev,
      [name]: value
    }))
  }

   // Update the handleSubmit function to ensure proper ISBN format
   // Update the handleSubmit function to be more flexible with ISBN
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess(false);

  // Add validation for available copies not less than total copies
  if (parseInt(bookData.available_copies) > parseInt(bookData.total_copies)) {
    setError('Available copies cannot be greater than total copies');
    setLoading(false);
    return;
  }
  
  try {
    // Simplify ISBN validation - accept 10-13 digits without hyphens
    const cleanIsbn = bookData.isbn.replace(/[-\s]/g, '');
    if (!/^\d{10,13}$/.test(cleanIsbn)) {
      throw new Error('ISBN must be 10 to 13 digits (numbers only)');
    }
    
    await addBook({
      ...bookData,
      isbn: cleanIsbn,
      total_copies: parseInt(bookData.total_copies),
      published_year: parseInt(bookData.published_year),
      author_id: parseInt(bookData.author_id),
      publisher_id: parseInt(bookData.publisher_id)
    });
    
    setSuccess(true);
    setTimeout(() => navigate('/books'), 1500);
  } catch (err) {
    setError(err.message || 'Failed to add book');
  } finally {
    setLoading(false);
  }
};

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Book
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Book added successfully! Redirecting...
        </Alert>
      )}
      
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 2
        }}
      >
        <TextField
          required
          label="ISBN"
          name="isbn"
          value={bookData.isbn || ''}
          onChange={handleChange}
          fullWidth
        />
        
        <TextField
          required
          label="Title"
          name="title"
          value={bookData.title || ''}
          onChange={handleChange}
          fullWidth
        />
        
        <TextField
          required
          label="Genre"
          name="genre"
          value={bookData.genre || ''}
          onChange={handleChange}
          fullWidth
        />
        
        <TextField
          required
          label="Total Copies"
          name="total_copies"
          type="number"
          value={bookData.total_copies || 1}
          onChange={handleChange}
          inputProps={{ min: 1 }}
          fullWidth
        />
        
        <FormControl fullWidth required>
          <InputLabel>Author</InputLabel>
          <Select
            name="author_id"
            value={bookData.author_id || ''}
            label="Author"
            onChange={handleChange}
          >
            {authors.map(author => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth required>
          <InputLabel>Publisher</InputLabel>
          <Select
            name="publisher_id"
            value={bookData.publisher_id || ''}
            label="Publisher"
            onChange={handleChange}
          >
            {publishers.map(publisher => (
              <MenuItem key={publisher.id} value={publisher.id}>
                {publisher.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth required>
          <InputLabel>Published Year</InputLabel>
          <Select
            name="published_year"
            value={bookData.published_year || currentYear}
            label="Published Year"
            onChange={handleChange}
          >
            {years.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/books')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Adding...' : 'Add Book'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default AddBook