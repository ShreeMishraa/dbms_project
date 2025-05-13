import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)
  const [backendError, setBackendError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const setupAxios = () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        fetchUser()
      } else {
        delete axios.defaults.headers.common['Authorization']
        setIsLoading(false)
      }
    }
    
    setupAxios()
  }, [token])

  const fetchUser = async () => {
    try {
      // Decode token to determine user role
      let payload
      try {
        payload = jwtDecode(token)
      } catch (err) {
        console.error('Invalid token format:', err)
        logout()
        return
      }
      
      const { role, id } = payload
      
      if (role === 'student') {
        // For student, fetch profile from API
        const response = await axios.get('/api/students/profile')
        setUser({...response.data, role: 'student'})
      } else if (role === 'librarian') {
        // For librarian, set basic info
        // Ideally, you would create an API endpoint for librarian profile
        setUser({
          id,
          role: 'librarian',
          first_name: 'Admin',
          last_name: 'Librarian'
        })
      } else {
        // Unknown role
        console.error('Unknown user role in token:', role)
        logout()
        return
      }
      
      setBackendError(false)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching user:', error)
      
      // Handle network errors (backend not running)
      if (error.code === 'ERR_NETWORK') {
        setBackendError(true)
        setIsLoading(false)
        return
      }
      
      logout()
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password })
      const { token } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      setBackendError(false)
      
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      
      if (error.code === 'ERR_NETWORK') {
        return { 
          success: false, 
          message: 'Cannot connect to server. Please check if backend is running.' 
        }
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (studentData) => {
    try {
      const response = await axios.post('/api/students/register', studentData)
      const { token } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      setBackendError(false)
      
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error.code === 'ERR_NETWORK') {
        return { 
          success: false, 
          message: 'Cannot connect to server. Please check if backend is running.' 
        }
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      backendError, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext