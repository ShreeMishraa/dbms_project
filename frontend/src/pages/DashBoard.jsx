import { Typography, Box, Grid, Card, CardContent } from '@mui/material'
import { Book, People, Receipt, AccountBalance } from '@mui/icons-material'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)

  const stats = [
    { title: 'Books Borrowed', value: 5, icon: <Book /> },
    { title: 'Active Reservations', value: 2, icon: <Receipt /> },
    { title: 'Outstanding Fines', value: '$10.50', icon: <AccountBalance /> },
  ]

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {user?.first_name}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
    </Box>
  )
}

export default Dashboard