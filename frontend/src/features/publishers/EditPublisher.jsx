import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField, 
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { updatePublisher } from '../../services/api';
import toast from 'react-hot-toast';

const EditPublisher = ({ open, onClose, publisher, onSuccess }) => {
  const [publisherData, setPublisherData] = useState({
    name: '',
    location: '',
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (publisher) {
      setPublisherData({
        name: publisher.name || '',
        location: publisher.location || '',
        contact: publisher.contact || ''
      });
    }
  }, [publisher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublisherData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await updatePublisher(publisher.id, publisherData);
      toast.success('Publisher updated successfully');
      onSuccess();
    } catch (err) {
      console.error("Error updating publisher:", err);
      setError(err.message || 'Failed to update publisher');
      toast.error('Failed to update publisher');
    } finally {
      setLoading(false);
    }
  };

  if (!publisher) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Publisher</DialogTitle>
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
          value={publisherData.name}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Location"
          name="location"
          value={publisherData.location}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Contact"
          name="contact"
          value={publisherData.contact}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Publisher'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPublisher;