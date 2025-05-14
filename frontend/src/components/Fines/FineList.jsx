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
import AuthContext from '../../context/AuthContext';
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
  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    
    try {
      // Handle MySQL datetime format "YYYY-MM-DD HH:MM:SS"
      const date = new Date(dateString);
      
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
      
      // Try alternate parsing approach
      const parts = dateString.split(/[- :]/);
      if (parts.length >= 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
        const day = parseInt(parts[2]);
        
        const validDate = new Date(year, month, day);
        return validDate.toLocaleDateString();
      }
      
      return "Date format issue";
    } catch (err) {
      console.error("Date parsing error:", err);
      return "Invalid Date";
    }
  };

  // Filter the fines based on the showPaidFines state
  const displayFines = fines.filter(fine => {
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