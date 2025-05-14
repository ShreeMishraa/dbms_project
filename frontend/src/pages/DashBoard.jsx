import { useState, useEffect, useContext } from 'react'
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Book,
  Receipt,
  AccountBalance,
  MenuBook,
  Person,
  Business
} from '@mui/icons-material'
import axios from 'axios'
import AuthContext from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [dashboardData, setDashboardData] = useState({
    borrowedBooks: 0,
    activeReservations: 0,
    outstandingFines: 0,
    totalBooks: 0,
    totalAuthors: 0,
    totalPublishers: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchDashboardData = async () => {
      try {
        if (user.role === 'student') {
          const [reservationsResponse, finesResponse] = await Promise.all([
            axios.get('/api/reservations').catch(() => ({ data: [] })),
            axios.get('/api/fines').catch(() => ({ data: [] }))
          ])

          const activeReservations = (reservationsResponse.data || [])
            .filter(reservation => reservation.status === 'active').length

          const outstandingFines = (finesResponse.data || [])
            .filter(fine => fine.payment_status === 'unpaid')
            .reduce((total, fine) => {
              const amount = parseFloat(fine.amount || 0)
              return total + (isNaN(amount) ? 0 : amount)
            }, 0)

          setDashboardData(prev => ({
            ...prev,
            borrowedBooks: activeReservations,
            activeReservations,
            outstandingFines
          }))
        } else {
          const [booksResponse, authorsResponse, publishersResponse] = await Promise.all([
            axios.get('/api/books').catch(() => ({ data: [] })),
            axios.get('/api/authors').catch(() => ({ data: [] })),
            axios.get('/api/publishers').catch(() => ({ data: [] }))
          ])

          setDashboardData(prev => ({
            ...prev,
            totalBooks: (booksResponse.data || []).length,
            totalAuthors: (authorsResponse.data || []).length,
            totalPublishers: (publishersResponse.data || []).length
          }))
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const studentStats = [
    { title: 'Books Borrowed', value: dashboardData.borrowedBooks, icon: <Book fontSize="large" color="primary" /> },
    { title: 'Active Reservations', value: dashboardData.activeReservations, icon: <Receipt fontSize="large" color="primary" /> },
    { title: 'Outstanding Fines', value: `$${dashboardData.outstandingFines.toFixed(2)}`, icon: <AccountBalance fontSize="large" color="primary" /> },
  ]

  const librarianStats = [
    { title: 'Total Books', value: dashboardData.totalBooks, icon: <MenuBook fontSize="large" color="primary" /> },
    { title: 'Total Authors', value: dashboardData.totalAuthors, icon: <Person fontSize="large" color="primary" /> },
    { title: 'Total Publishers', value: dashboardData.totalPublishers, icon: <Business fontSize="large" color="primary" /> },
  ]

  const stats = user?.role === 'librarian' ? librarianStats : studentStats

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {user?.role === 'librarian' ? 'Librarian' : user?.first_name || 'User'}!
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
          {stats.map((stat, index) => (
            <Box key={index} sx={{ width: { xs: '100%', sm: '30%' }, flexGrow: 1 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" component="h2">
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box>{stat.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {user?.role === 'librarian' && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Librarian Actions
          </Typography>
          <Alert severity="info">
            As a librarian, you can manage books, authors, publishers, and issue fines. Use the sidebar navigation to access these features.
          </Alert>
        </Box>
      )}
    </Box>
  )
}

export default Dashboard
