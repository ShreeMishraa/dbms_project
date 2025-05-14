import { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Card,
  CardContent,
  CardMedia
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { getBookById, reserveBook } from '../../services/api'

const ReserveBook = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const bookId = new URLSearchParams(location.search).get('bookId')

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reserving, setReserving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(bookId)
        setBook(data)
      } catch (err) {
        console.error('Failed to fetch book details:', err)
        setError('Failed to fetch book details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      fetchBook()
    } else {
      navigate('/books')
    }
  }, [bookId, navigate])

  const handleReserve = async () => {
    setReserving(true);
    setError('');
  
    try {
      // Make sure bookId is valid
      if (!bookId) {
        throw new Error('Invalid book ID');
      }
  
      await reserveBook({ book_id: bookId });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Reservation error:', err);
      setError(err.message || 'Failed to reserve book');
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return <Typography>Loading book details...</Typography>
  }
  if (!book) {
    return (
      <Typography color="error">
        Book not found. Please return to the book catalog and try again.
      </Typography>
    )
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reserve Book
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Book reserved successfully! Redirecting...
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5">{book.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            by {book.author.name}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Publisher:</strong> {book.publisher.name}
          </Typography>
          <Typography variant="body1">
            <strong>Genre:</strong> {book.genre}
          </Typography>
          <Typography variant="body1">
            <strong>Published Year:</strong> {book.published_year}
          </Typography>
          <Typography variant="body1">
            <strong>ISBN:</strong> {book.isbn}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Available Copies:</strong> {book.available_copies}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/books')} disabled={reserving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleReserve}
          disabled={reserving || book.available_copies <= 0}
          startIcon={reserving ? <CircularProgress size={20} /> : null}
        >
          {reserving ? 'Processing...' : 'Confirm Reservation'}
        </Button>
      </Box>
    </Paper>
  )
}

export default ReserveBook
