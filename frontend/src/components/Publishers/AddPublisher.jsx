import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import { addPublisher } from '../../services/api';

const AddPublisher = ({ onSuccess }) => {
  const [publisherData, setPublisherData] = useState({
    name: '',
    location: '',
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublisherData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await addPublisher(publisherData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add publisher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Adding...' : 'Add Publisher'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddPublisher;