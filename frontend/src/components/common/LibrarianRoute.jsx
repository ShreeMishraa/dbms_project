import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import Loader from './Loader'

const LibrarianRoute = () => {
  const { user, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return <Loader />
  }

  return user && user.role === 'librarian' ? <Outlet /> : <Navigate to="/dashboard" replace />
}

export default LibrarianRoute