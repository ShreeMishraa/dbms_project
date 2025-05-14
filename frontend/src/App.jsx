import React, { useState, useContext } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import {
  Box,
  CssBaseline,
  Alert,
  AlertTitle,
  Container,
  Button,
  Toolbar
} from '@mui/material'
import { Toaster } from 'react-hot-toast'

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
import AddAuthor from './components/Authors/AddAuthor'
import PublisherList from './components/Publishers/PublisherList'
import AddPublisher from './components/Publishers/AddPublisher'

// Other Resources
import ReservationList from './components/Reservations/ReservationList'
import FineList from './components/Fines/FineList'
import GDRoomList from './components/GD/GDRoomList'
import MyGDReservations from './components/GD/MyGDReservations'

// Librarian-only Components
import LibrarianBooksManage from './components/Librarian/LibrarianBooksManage'
import IssueFine from './components/Librarian/IssueFine'
import AllFines from './components/Librarian/AllFines'
import AddGDRoom from './components/Librarian/AddGDRoom'
import StudentList from './components/Librarian/StudentList'
import StudentReservations from './components/Librarian/StudentReservations';
import StudentGDReservations from './components/Librarian/StudentGDReservations';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute'
import LibrarianRoute from './components/common/LibrarianRoute'
import Loader from './components/common/Loader'
import ErrorBoundary from './components/common/ErrorBoundary'

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, isLoading, backendError } = useContext(AuthContext)
  const location = useLocation()

  if (isLoading) return <Loader />

  if (backendError && !['/login', '/register'].includes(location.pathname)) {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      {/* Navbar */}
      {user && <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

      <Box sx={{ display: 'flex', flex: 1, overflow: 'auto' }}>
        {/* Sidebar */}
        {user && (
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userRole={user.role}
          />
        )}

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: user ? 8 : 0,
            width: {
              sm: `calc(100% - ${sidebarOpen && user ? 240 : 0}px)`
            },
            ml: {
              sm: sidebarOpen && user ? '240px' : 0
            },
            transition: 'margin 225ms cubic-bezier(0,0,0.2,1)'
          }}
        >
          {user && <Toolbar />}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register />}
            />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/books" element={<BookList />} />
              <Route path="/books/reserve" element={<ReserveBook />} />

              <Route path="/authors" element={<AuthorList />} />
              <Route path="/publishers" element={<PublisherList />} />

              <Route path="/reservations" element={<ReservationList />} />
              <Route path="/fines" element={<FineList />} />

              <Route path="/gd-rooms" element={<GDRoomList />} />
              <Route path="/my-gd-reservations" element={<MyGDReservations />} />

              <Route path="/librarian/students" element={<StudentList />} />
            </Route>

            <Route element={<LibrarianRoute />}>
              <Route path="/books/add" element={<AddBook />} />
              <Route
                path="/librarian/books/manage"
                element={<LibrarianBooksManage />}
              />
              <Route path="/authors/add" element={<AddAuthor />} />
              <Route path="/publishers/add" element={<AddPublisher />} />
              <Route path="/librarian/fines/issue" element={<IssueFine />} />
              <Route path="/librarian/fines/all" element={<AllFines />} />
              <Route path="/librarian/gd-rooms/add" element={<AddGDRoom />} />
              <Route path="/librarian/reservations/books" element={<StudentReservations />} />
              <Route path="/librarian/reservations/gd" element={<StudentGDReservations />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
      <Toaster position="top-right" />
    </AuthProvider>
  )
}
