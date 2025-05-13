import { useState, useEffect } from 'react'
import { Typography, Box, Grid, Card, CardContent, CircularProgress } from '@mui/material'
import { Book, Receipt, AccountBalance } from '@mui/icons-material'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [dashboardData, setDashboardData] = useState({
    borrowedBooks: 0,
    activeReservations: 0,
    outstandingFines: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch reservations to count active ones
        const reservationsResponse = await axios.get('/api/reservations');
        const activeReservations = reservationsResponse.data.filter(
          reservation => reservation.status === 'active'
        ).length;

        // Fetch fines to calculate outstanding amount
        const finesResponse = await axios.get('/api/fines');
        const outstandingFines = finesResponse.data
          .filter(fine => fine.status === 'pending')
          .reduce((total, fine) => total + parseFloat(fine.amount), 0);

        setDashboardData({
          borrowedBooks: activeReservations, // Same as active reservations
          activeReservations,
          outstandingFines
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const stats = [
    { title: 'Books Borrowed', value: dashboardData.borrowedBooks, icon: <Book /> },
    { title: 'Active Reservations', value: dashboardData.activeReservations, icon: <Receipt /> },
    { title: 'Outstanding Fines', value: `$${dashboardData.outstandingFines.toFixed(2)}`, icon: <AccountBalance /> },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {user?.first_name || 'Librarian'}!
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Grid key={index} lg={4} md={6} sm={12} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }}}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box>
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;