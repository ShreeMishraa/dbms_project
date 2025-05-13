import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import { addAuthor } from '../../services/api';

const AddAuthor = ({ onSuccess }) => {
  const [authorData, setAuthorData] = useState({
    name: '',
    biography: '',
    nationality: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await addAuthor(authorData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add author');
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
        value={authorData.name}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Biography"
        name="biography"
        multiline
        rows={4}
        value={authorData.biography}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Nationality"
        name="nationality"
        value={authorData.nationality}
        onChange={handleChange}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Adding...' : 'Add Author'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddAuthor;