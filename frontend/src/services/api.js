import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
axios.defaults.baseURL = API_BASE_URL

// Axios Interceptor for global error handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error: Backend server is not running or not accessible')
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// ------------------ Books ------------------
export const getBooks = async () => {
  try {
    const response = await axios.get('/api/books')
    return response.data
  } catch (error) {
    console.error('Error fetching books:', error)
    if (error.code === 'ERR_NETWORK') {
      throw { message: 'Cannot connect to server. Please check if backend is running.' }
    }
    throw error.response?.data || { message: 'Failed to fetch books' }
  }
}

export const getBookById = async (id) => {
  try {
    const allBooks = await getBooks()
    const book = allBooks.find(book => book.book_id.toString() === id.toString())

    if (!book) throw new Error('Book not found')

    return {
      id: book.book_id,
      isbn: book.isbn || '',
      title: book.title,
      genre: book.genre || '',
      available_copies: book.available_copies || 0,
      published_year: book.published_year || new Date().getFullYear(),
      author: {
        id: book.author_id,
        name: book.author_name || 'Unknown Author'
      },
      publisher: {
        id: book.publisher_id,
        name: book.publisher_name || 'Unknown Publisher'
      }
    }
  } catch (error) {
    console.error('Error fetching book by ID:', error)
    if (error.code === 'ERR_NETWORK') {
      throw { message: 'Cannot connect to server. Please check if backend is running.' }
    }
    throw { message: error.message || 'Failed to fetch book details' }
  }
}

export const addBook = async (bookData) => {
  try {
    const response = await axios.post('/api/books', bookData)
    return response.data
  } catch (error) {
    console.error('Error adding book:', error)
    if (error.code === 'ERR_NETWORK') {
      throw { message: 'Cannot connect to server. Please check if backend is running.' }
    }
    throw error.response?.data || { message: 'Failed to add book' }
  }
}

// ------------------ Authors ------------------
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

export const deleteAuthor = async (id) => {
  try {
    const response = await axios.delete(`/api/authors/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting author:', error)
    throw error
  }
}

// ------------------ Publishers ------------------
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

export const deletePublisher = async (id) => {
  try {
    const response = await axios.delete(`/api/publishers/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting publisher:', error)
    throw error
  }
}

// ------------------ Reservations ------------------
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

// ------------------ Fines ------------------
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

// ------------------ GD Rooms ------------------
export const getGDRooms = async () => {
  try {
    const response = await axios.get('/api/gd/rooms')
    return response.data
  } catch (error) {
    console.error('Error fetching GD rooms:', error)
    throw error
  }
}

// Add/fix the GD API functions
export const reserveGDRoom = async (reservationData) => {
  try {
    const response = await axios.post('/api/gd', reservationData);
    return response.data;
  } catch (error) {
    console.error('Error reserving GD room:', error);
    if (error.code === 'ERR_NETWORK') {
      throw { message: 'Cannot connect to server. Please check if backend is running.' };
    }
    throw error.response?.data || { message: 'Failed to reserve GD room' };
  }
};

export const getMyGDReservations = async () => {
  try {
    const response = await axios.get('/api/gd');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching GD reservations:', error);
    if (error.code === 'ERR_NETWORK') {
      throw { message: 'Cannot connect to server. Please check if backend is running.' };
    }
    throw error.response?.data || { message: 'Failed to fetch GD reservations' };
  }
};

export const cancelGDReservation = async (reservationId) => {
  try {
    const response = await axios.delete(`/api/gd/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling GD reservation:', error);
    if (error.code === 'ERR_NETWORK') {
      throw { message: 'Cannot connect to server. Please check if backend is running.' };
    }
    throw error.response?.data || { message: 'Failed to cancel GD reservation' };
  }
};
