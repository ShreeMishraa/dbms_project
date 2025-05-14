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

// Add deleteAuthor function
// Authors Management
export const deleteAuthor = async (authorId) => {
  try {
    const response = await axios.delete(`/api/authors/${authorId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting author:', error);
    throw new Error('Failed to delete author');
  }
};

// Publishers Management
// Publishers Management
export const deletePublisher = async (publisherId) => {
  try {
    if (!publisherId) {
      throw new Error('Publisher ID is required');
    }
    const response = await axios.delete(`/api/publishers/${publisherId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting publisher:', error);
    throw new Error('Failed to delete publisher');
  }
};

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


// ------------------ Reservations ------------------
export const reserveBook = async (bookData) => {
  try {
    const response = await axios.post('/api/reservations', bookData);
    return response.data;
  } catch (error) {
    console.error('Error reserving book:', error);
    throw error.response?.data || { message: 'Failed to reserve book' };
  }
};

// Also update the returnBook function to decrement the count
export const returnBook = async (reservationId) => {
  try {
    const response = await axios.post('/api/reservations/return', {
      reservation_id: reservationId
    });
    return response.data;
  } catch (error) {
    // Add detailed logging for troubleshooting
    console.error('Error returning book:', error);
    if (error.code === 'ERR_NETWORK') {
      throw { message: 'Cannot connect to server. Please check if backend is running.' };
    }
    throw error.response?.data || { message: 'Failed to return book' };
  }
};

export const getReservations = async () => {
  try {
    const response = await axios.get('/api/reservations')
    return response.data
  } catch (error) {
    console.error('Error fetching reservations:', error)
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
    const response = await axios.post('/api/fines/pay', { fine_id: fineId });
    return response.data;
  } catch (error) {
    console.error('Error paying fine:', error);
    throw error;
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

// Add these librarian-specific API functions

// Books Management
export const deleteBook = async (bookId) => {
  try {
    const response = await axios.delete(`/api/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error.response?.data || { message: 'Failed to delete book' };
  }
};

export const updateAuthor = async (authorId, authorData) => {
  try {
    const response = await axios.put(`/api/authors/${authorId}`, authorData);
    return response.data;
  } catch (error) {
    console.error('Error updating author:', error);
    throw error;
  }
};

export const updateBook = async (bookId, bookData) => {
  try {
    const response = await axios.put(`/api/books/${bookId}`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error.response?.data || { message: 'Failed to update book' };
  }
};

// Update or add this function

// Student Management
export const getStudents = async () => {
  try {
    const response = await axios.get('/api/students/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const deleteStudent = async (studentId) => {
  try {
    const response = await axios.delete(`/api/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// Fine Management
export const getAllFines = async () => {
  try {
    const response = await axios.get('/api/fines/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all fines:', error);
    throw new Error('Failed to fetch fines');
  }
};

export const issueFine = async (fineData) => {
  try {
    const response = await axios.post('/api/fines', fineData);
    return response.data;
  } catch (error) {
    console.error('Error issuing fine:', error);
    throw error.response?.data || { message: 'Failed to issue fine' };
  }
};

// GD Room Management
export const addGDRoom = async (roomData) => {
  try {
    const response = await axios.post('/api/gd/rooms', roomData);
    return response.data;
  } catch (error) {
    console.error('Error adding GD room:', error);
    throw error.response?.data || { message: 'Failed to add GD room' };
  }
};

export const deleteGDRoom = async (roomId) => {
  try {
    const response = await axios.delete(`/api/gd/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting GD room:', error);
    throw error.response?.data || { message: 'Failed to delete GD room' };
  }
};

// Add getAllStudents function for librarian use
export const getAllStudents = async (req, res) => {
  try {
    const [students] = await pool.promise().query(`
      SELECT member_id, roll_no, first_name, last_name, email, phone, 
             dob, age, membership_type, total_books_issued
      FROM students
    `);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

// Add this function
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await axios.put(`/api/students/${studentId}`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const updatePublisher = async (publisherId, publisherData) => {
  try {
    const response = await axios.put(`/api/publishers/${publisherId}`, publisherData);
    return response.data;
  } catch (error) {
    console.error('Error updating publisher:', error);
    throw error.response?.data || { message: 'Failed to update publisher' };
  }
};

export const deleteFine = async (fineId) => {
  try {
    const response = await axios.delete(`/api/fines/${fineId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting fine:', error);
    throw error.response?.data || { message: 'Failed to delete fine' };
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put('/api/students/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};



// Add these new functions
export const getAllReservations = async () => {
  try {
    const response = await axios.get('/api/reservations/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    throw error;
  }
};

export const deleteReservation = async (reservationId) => {
  try {
    const response = await axios.delete(`/api/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
};

export const getAllGDReservations = async () => {
  try {
    const response = await axios.get('/api/gd/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all GD reservations:', error);
    throw error;
  }
};

export const deleteGDReservation = async (reservationId) => {
  try {
    const response = await axios.delete(`/api/gd/admin/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting GD reservation:', error);
    throw error;
  }
};