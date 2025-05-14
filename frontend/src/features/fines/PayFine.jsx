import { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { payFine } from '../../services/api';

const PayFine = ({ open, onClose, fine, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Use the correct ID property (fine_id from database or id from frontend)
      const fineId = fine.fine_id || fine.id;
      await payFine(fineId);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (!fine) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pay Fine</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          You are about to pay a fine of <strong>${parseFloat(fine.amount || 0).toFixed(2)}</strong> for:
        </DialogContentText>
        <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic' }}>
          "{fine.reason}"
        </Typography>
        <DialogContentText sx={{ mt: 2 }}>
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handlePayment} 
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : 'Confirm Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayFine;