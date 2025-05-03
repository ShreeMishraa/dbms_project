import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setIsLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/students/profile')
      setUser(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching user:', error)
      logout()
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password })
      const { token } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      await fetchUser()
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (studentData) => {
    try {
      const response = await axios.post('/api/students/register', studentData)
      const { token } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      await fetchUser()
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: error.response?.data?.message || 'Registration failed' }
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
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext