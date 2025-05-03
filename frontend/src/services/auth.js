import axios from 'axios'

export const login = async (email, password) => {
  try {
    const response = await axios.post('/api/login', { email, password })
    return response.data
  } catch (error) {
    throw error.response?.data?.message || 'Login failed'
  }
}

export const registerStudent = async (studentData) => {
  try {
    const response = await axios.post('/api/students/register', studentData)
    return response.data
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed'
  }
}

export const getProfile = async () => {
  try {
    const response = await axios.get('/api/students/profile')
    return response.data
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch profile'
  }
}