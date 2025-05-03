import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

axios.defaults.baseURL = API_BASE_URL

export const getBooks = async () => {
  try {
    const response = await axios.get('/api/books')
    return response.data
  } catch (error) {
    console.error('Error fetching books:', error)
    throw error
  }
}

export const addBook = async (bookData) => {
  try {
    const response = await axios.post('/api/books', bookData)
    return response.data
  } catch (error) {
    console.error('Error adding book:', error)
    throw error
  }
}

export const getAuthors = async () => {
  try {
    const response = await axios.get('/api/authors')
    return response.data
  } catch (error) {
    console.error('Error fetching authors:', error)
    throw error
  }
}

export const addAuthor = async (authorData) => {
  try {
    const response = await axios.post('/api/authors', authorData)
    return response.data
  } catch (error) {
    console.error('Error adding author:', error)
    throw error
  }
}

export const getPublishers = async () => {
  try {
    const response = await axios.get('/api/publishers')
    return response.data
  } catch (error) {
    console.error('Error fetching publishers:', error)
    throw error
  }
}

export const addPublisher = async (publisherData) => {
  try {
    const response = await axios.post('/api/publishers', publisherData)
    return response.data
  } catch (error) {
    console.error('Error adding publisher:', error)
    throw error
  }
}

export const reserveBook = async (bookId) => {
  try {
    const response = await axios.post('/api/reservations', { book_id: bookId })
    return response.data
  } catch (error) {
    console.error('Error reserving book:', error)
    throw error
  }
}

export const getReservations = async () => {
  try {
    const response = await axios.get('/api/reservations')
    return response.data
  } catch (error) {
    console.error('Error fetching reservations:', error)
    throw error
  }
}

export const returnBook = async (reservationId) => {
  try {
    const response = await axios.post('/api/reservations/return', { reservation_id: reservationId })
    return response.data
  } catch (error) {
    console.error('Error returning book:', error)
    throw error
  }
}

export const getFines = async () => {
  try {
    const response = await axios.get('/api/fines')
    return response.data
  } catch (error) {
    console.error('Error fetching fines:', error)
    throw error
  }
}

export const payFine = async (fineId) => {
  try {
    const response = await axios.post('/api/fines/pay', { fine_id: fineId })
    return response.data
  } catch (error) {
    console.error('Error paying fine:', error)
    throw error
  }
}

export const getGDRooms = async () => {
  try {
    const response = await axios.get('/api/gd/rooms')
    return response.data
  } catch (error) {
    console.error('Error fetching GD rooms:', error)
    throw error
  }
}

export const reserveGDRoom = async (reservationData) => {
  try {
    const response = await axios.post('/api/gd', reservationData)
    return response.data
  } catch (error) {
    console.error('Error reserving GD room:', error)
    throw error
  }
}

export const getMyGDReservations = async () => {
  try {
    const response = await axios.get('/api/gd')
    return response.data
  } catch (error) {
    console.error('Error fetching GD reservations:', error)
    throw error
  }
}

export const cancelGDReservation = async (reservationId) => {
  try {
    const response = await axios.delete(`/api/gd/${reservationId}`)
    return response.data
  } catch (error) {
    console.error('Error canceling GD reservation:', error)
    throw error
  }
}