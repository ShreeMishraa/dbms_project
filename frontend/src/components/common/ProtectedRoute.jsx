import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import Loader from './Loader'

const ProtectedRoute = () => {
  const { user, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return <Loader />
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute