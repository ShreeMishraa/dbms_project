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
  Button,
  FormControlLabel,
  Switch
} from '@mui/material';
import { getFines } from '../../services/api';
import AuthContext from '../../contexts/AuthContext';
import PayFine from './PayFine';

const FineList = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFine, setSelectedFine] = useState(null);
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [showPaidFines, setShowPaidFines] = useState(false);
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
  // Update the formatDate function to better handle null or invalid dates:

const formatDate = (dateString) => {
  if (!dateString) return "Not Available";
  
  try {
    // Handle all common date formats
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "Not Available";
    }
    
    // Return formatted date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
    
  } catch (err) {
    console.error("Date parsing error:", err);
    return "Not Available";
  }
};

  // Filter the fines based on the showPaidFines state
// Update the displayFines filter to exclude deleted fines
const displayFines = fines.filter(fine => {
  // First check if it's deleted - don't show deleted fines to students
  const isDeleted = fine.is_deleted === 1;
  if (isDeleted) return false;
  
  // Then apply the paid/unpaid filter
  const isPaid = (fine.payment_status === 'paid' || fine.status === 'paid');
  return showPaidFines ? true : !isPaid;
});

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          My Fines
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={showPaidFines}
              onChange={() => setShowPaidFines(!showPaidFines)}
              color="primary"
            />
          }
          label="Show Paid Fines"
        />
      </Box>
      
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
            {displayFines.map((fine) => (
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