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

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
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
              <TableRow key={fine.id}>
                <TableCell>${fine.amount.toFixed(2)}</TableCell>
                <TableCell>{fine.reason}</TableCell>
                <TableCell>{new Date(fine.issued_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={fine.status} 
                    color={getStatusColor(fine.status)} 
                  />
                </TableCell>
                <TableCell>
                  {fine.status === 'pending' && (
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