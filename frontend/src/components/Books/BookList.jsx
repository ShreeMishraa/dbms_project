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
  TextField
} from '@mui/material'
import { getBooks } from '../../services/api'
import AuthContext from '../../context/AuthContext'

const BookList = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks()
        // Transform the data to match expected structure
        const formattedBooks = data.map(book => ({
          id: book.book_id,
          title: book.title,
          genre: book.genre,
          available_copies: book.available_copies,
          author: { 
            id: book.author_id, 
            name: book.author_name || 'Unknown Author' 
          },
          publisher: { 
            id: book.publisher_id, 
            name: book.publisher_name || 'Unknown Publisher' 
          }
        }))
        setBooks(formattedBooks)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch books')
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Typography>Loading books...</Typography>
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Catalog
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Books"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {user?.role === 'librarian' && (
          <Button variant="contained" color="primary" href="/books/add">
            Add New Book
          </Button>
        )}
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Available Copies</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author.name}</TableCell>
                <TableCell>{book.publisher.name}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>{book.available_copies}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    href={`/books/reserve?bookId=${book.id}`}
                    disabled={book.available_copies <= 0}
                  >
                    Reserve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default BookList