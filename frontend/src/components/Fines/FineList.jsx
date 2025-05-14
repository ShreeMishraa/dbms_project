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
  Chip,
  Button
} from '@mui/material';
import { getFines } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import PayFine from './PayFine';

const FineList = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFine, setSelectedFine] = useState(null);
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const data = await getFines();
      setFines(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch fines');
      setLoading(false);
    }
  };

  const handlePayClick = (fine) => {
    setSelectedFine(fine);
    setOpenPayDialog(true);
  };

  const handlePaymentSuccess = () => {
    setOpenPayDialog(false);
    fetchFines();
  };

  // Ensure status is properly formatted and displayed
  const getStatusChip = (status) => {
    // Convert any status format to a standard format
    const normalizedStatus = (status || "unpaid").toLowerCase();
    
    switch (normalizedStatus) {
      case 'paid': return <Chip label="Paid" color="success" size="small" />;
      case 'unpaid': return <Chip label="Unpaid" color="error" size="small" />;
      default: return <Chip label={status || "Unknown"} color="default" size="small" />;
    }
  };
  
  // Format date properly
  // Improve the formatDate function
  // Update the formatDate function to properly handle MySQL datetime format
  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    
    try {
      // For MySQL datetime format
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        // Try parsing as MySQL format (YYYY-MM-DD HH:MM:SS)
        const parts = dateString.split(/[- :]/);
        if (parts.length >= 3) {
          // At least has YYYY-MM-DD
          const newDate = new Date(parts[0], parts[1]-1, parts[2]);
          if (!isNaN(newDate.getTime())) {
            return newDate.toLocaleDateString();
          }
        }
        return "Invalid Date";
      }
      
      return date.toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Fines
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Issued Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fines.map((fine) => (
              <TableRow key={fine.fine_id || fine.id}>
                <TableCell>${parseFloat(fine.amount || 0).toFixed(2)}</TableCell>
                <TableCell>{fine.reason}</TableCell>
                <TableCell>{formatDate(fine.issued_date)}</TableCell>
                <TableCell>
                  {getStatusChip(fine.payment_status || fine.status)}
                </TableCell>
                <TableCell>
                  {(fine.payment_status === 'unpaid' || fine.status === 'unpaid') && (
                    <Button 
                      variant="outlined" 
                      onClick={() => handlePayClick(fine)}
                    >
                      Pay
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PayFine 
        open={openPayDialog} 
        onClose={() => setOpenPayDialog(false)}
        fine={selectedFine}
        onSuccess={handlePaymentSuccess}
      />
    </Box>
  );
};

export default FineList;