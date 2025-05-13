import { useState, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CssBaseline, Alert, AlertTitle, Container, Button } from '@mui/material'
import { AuthProvider } from './context/AuthContext'
import AuthContext from './context/AuthContext'

// Layout Components
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import Footer from './components/Layout/Footer'

// Pages
import Home from './pages/Home'
import Dashboard from './pages/DashBoard'
import Profile from './pages/Profile'

// Auth
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

// Books & Reservations
import BookList from './components/Books/BookList'
import AddBook from './components/Books/AddBook'
import ReserveBook from './components/Reservations/ReserveBook'

// Authors & Publishers
import AuthorList from './components/Authors/AuthorList'
import PublisherList from './components/Publishers/PublisherList'

// Other Resources
import ReservationList from './components/Reservations/ReservationList'
import FineList from './components/Fines/FineList'
import GDRoomList from './components/GD/GDRoomList'
import MyGDReservations from './components/GD/MyGDReservations'

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute'
import LibrarianRoute from './components/common/LibrarianRoute'
import Loader from './components/common/Loader'
import BackendErrorAlert from './components/common/BackendErrorAlert'
import ErrorBoundary from './components/common/ErrorBoundary'

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, isLoading, backendError } = useContext(AuthContext)
  const path = window.location.pathname

  if (isLoading) return <Loader />

  // Full-page backend-down alert (except on auth pages)
  if (backendError && path !== '/login' && path !== '/register') {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Alert severity="error" variant="outlined" sx={{ p: 3 }}>
          <AlertTitle>Backend Server Not Running</AlertTitle>
          <p>The backend isn’t accessible right now. Start it by running:</p>
          <Box
            component="pre"
            sx={{
              bgcolor: '#fafafa',
              p: 2,
              borderRadius: 1,
              fontFamily: 'monospace',
              my: 2
            }}
          >
            cd backend<br />
            node index.js
          </Box>
          <p>Then refresh this page.</p>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {user && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userRole={user.role}
        />
      )}

      {/* Main area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: user ? { sm: `${sidebarOpen ? 240 : 0}px` } : 0,
          transition: 'margin 0.2s',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register />}
            />

            {/* Authenticated Users */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                }
              />
              <Route path="/profile" element={<Profile />} />

              <Route
                path="/books"
                element={
                  <ErrorBoundary>
                    <BookList />
                  </ErrorBoundary>
                }
              />
              <Route path="/books/reserve" element={<ReserveBook />} />

              <Route
                path="/reservations"
                element={
                  <ErrorBoundary>
                    <ReservationList />
                  </ErrorBoundary>
                }
              />
              <Route path="/fines" element={<FineList />} />
              <Route path="/gd-rooms" element={<GDRoomList />} />

              <Route
                path="/my-gd-reservations"
                element={
                  <ErrorBoundary>
                    <MyGDReservations />
                  </ErrorBoundary>
                }
              />
            </Route>

            {/* Librarian-only Routes */}
            <Route element={<LibrarianRoute />}>
              <Route
                path="/books/add"
                element={
                  <ErrorBoundary>
                    <AddBook />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/authors"
                element={
                  <ErrorBoundary>
                    <AuthorList />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/publishers"
                element={
                  <ErrorBoundary>
                    <PublisherList />
                  </ErrorBoundary>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </Box>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
