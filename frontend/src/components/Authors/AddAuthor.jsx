import { useState, useEffect, useContext } from 'react';
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
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { getAuthors, deleteAuthor } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import AddAuthor from './AddAuthor';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const data = await getAuthors();
      setAuthors(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch authors');
      setLoading(false);
    }
  };

  const handleDeleteClick = (author) => {
    setSelectedAuthor(author);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAuthor(selectedAuthor.id);
      setAuthors(authors.filter(a => a.id !== selectedAuthor.id));
      setOpenDeleteDialog(false);
    } catch (err) {
      setError('Failed to delete author');
    }
  };

  const handleAddSuccess = () => {
    setOpenAddDialog(false);
    fetchAuthors();
  };

  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Authors
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Authors"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {user?.role === 'librarian' && (
          <Button 
            variant="contained" 
            onClick={() => setOpenAddDialog(true)}
          >
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
            {filteredAuthors.map((author) => (
              <TableRow key={author.id}>
                <TableCell>{author.name}</TableCell>
                <TableCell>{author.nationality}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>{author.biography}</TableCell>
                {user?.role === 'librarian' && (
                  <TableCell>
                    <IconButton color="primary" onClick={() => {}}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(author)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete author "{selectedAuthor?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default AuthorList;