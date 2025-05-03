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
import { getPublishers, deletePublisher } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import AddPublisher from './AddPublisher';

const PublisherList = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      const data = await getPublishers();
      setPublishers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch publishers');
      setLoading(false);
    }
  };

  const handleDeleteClick = (publisher) => {
    setSelectedPublisher(publisher);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePublisher(selectedPublisher.id);
      setPublishers(publishers.filter(p => p.id !== selectedPublisher.id));
      setOpenDeleteDialog(false);
    } catch (err) {
      setError('Failed to delete publisher');
    }
  };

  const handleAddSuccess = () => {
    setOpenAddDialog(false);
    fetchPublishers();
  };

  const filteredPublishers = publishers.filter(publisher => 
    publisher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    publisher.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {user?.role === 'librarian' && (
          <Button 
            variant="contained" 
            onClick={() => setOpenAddDialog(true)}
          >
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
            {filteredPublishers.map((publisher) => (
              <TableRow key={publisher.id}>
                <TableCell>{publisher.name}</TableCell>
                <TableCell>{publisher.location}</TableCell>
                <TableCell>{publisher.contact}</TableCell>
                {user?.role === 'librarian' && (
                  <TableCell>
                    <IconButton color="primary" onClick={() => {}}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(publisher)}>
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
          Are you sure you want to delete publisher "{selectedPublisher?.name}"?
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
        <DialogTitle>Add New Publisher</DialogTitle>
        <DialogContent>
          <AddPublisher onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PublisherList;