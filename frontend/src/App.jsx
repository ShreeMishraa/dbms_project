import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import Dashboard from './pages/DashBoard'
import Profile from './pages/Profile'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import BookList from './components/Books/BookList'
import AddBook from './components/Books/AddBook'
import AuthorList from './components/Authors/AuthorList'
import AddAuthor from './components/Authors/AddAuthor'
import PublisherList from './components/Publishers/PublisherList'
import AddPublisher from './components/Publishers/AddPublisher'
import ReservationList from './components/Reservations/ReservationList'
import ReserveBook from './components/Reservations/ReserveBook'
import FineList from './components/Fines/FineList'
import PayFine from './components/Fines/PayFine'
import GDRoomList from './components/GD/GDRoomList'
import ReserveGDRoom from './components/GD/ReserveGDRoom'
import MyGDReservations from './components/GD/MyGDReservations'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const decoded = JSON.parse(atob(token.split('.')[1]))
      setUserRole(decoded.role || 'student')
    }
  }, [])

  return (
    <AuthProvider>
      <div className="app">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userRole={userRole} />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/reserve" element={<ReserveBook />} />
              <Route path="/reservations" element={<ReservationList />} />
              <Route path="/fines" element={<FineList />} />
              <Route path="/fines/pay" element={<PayFine />} />
              <Route path="/gd-rooms" element={<GDRoomList />} />
              <Route path="/gd-rooms/reserve" element={<ReserveGDRoom />} />
              <Route path="/my-gd-reservations" element={<MyGDReservations />} />
              
              <Route path="/books/add" element={
                userRole === 'librarian' ? <AddBook /> : <Navigate to="/dashboard" />
              } />
              <Route path="/authors" element={<AuthorList />} />
              <Route path="/authors/add" element={
                userRole === 'librarian' ? <AddAuthor /> : <Navigate to="/dashboard" />
              } />
              <Route path="/publishers" element={<PublisherList />} />
              <Route path="/publishers/add" element={
                userRole === 'librarian' ? <AddPublisher /> : <Navigate to="/dashboard" />
              } />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App