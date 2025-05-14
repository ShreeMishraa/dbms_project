import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField, 
  Button, 
  CircularProgress,
  Alert,
  Box // Make sure Box is imported
} from '@mui/material';
import { updateAuthor } from '../../services/api';
import toast from 'react-hot-toast';

const EditAuthor = ({ open, onClose, author, onSuccess }) => {
  const [authorData, setAuthorData] = useState({
    name: '',
    biography: '',
    nationality: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (author) {
      setAuthorData({
        name: author.name || '',
        biography: author.biography || '',
        nationality: author.nationality || ''
      });
    }
  }, [author]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const authorId = author.author_id || author.id;
      await updateAuthor(authorId, authorData);
      // Call onSuccess but don't show toast here
      onSuccess();
    } catch (err) {
      console.error("Error updating author:", err);
      setError(err.message || 'Failed to update author');
      toast.error('Failed to update author');
    } finally {
      setLoading(false);
    }
  };

  if (!author) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Author</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TextField
          margin="normal"
          required
          fullWidth
          label="Name"
          name="name"
          value={authorData.name || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Biography"
          name="biography"
          multiline
          rows={4}
          value={authorData.biography || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Nationality"
          name="nationality"
          value={authorData.nationality || ''}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Updating...' : 'Update Author'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAuthor;