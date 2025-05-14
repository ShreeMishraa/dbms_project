import pool from '../config/db.js';

export const addBook = async (req, res) => {
  const { isbn, title, genre, total_copies, author_id, publisher_id, published_year } = req.body;
  try {
    const [result] = await pool
      .promise()
      .query(
        `INSERT INTO books
         (isbn, title, genre, total_copies, available_copies, author_id, publisher_id, published_year)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [isbn, title, genre, total_copies, total_copies, author_id, publisher_id, published_year]
      );
    res.status(201).json({ bookId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add book', error: error.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const [books] = await pool
      .promise()
      .query(`
        SELECT b.*, a.name AS author_name, p.name AS publisher_name
        FROM books b
        LEFT JOIN authors a ON b.author_id = a.author_id
        LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      `);
    res.json(books);
  } catch {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

// Add updateBook and deleteBook functions
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      isbn, 
      title, 
      genre, 
      total_copies, 
      available_copies, 
      author_id, 
      publisher_id, 
      published_year 
    } = req.body;
    
    await pool.promise().query(
      `UPDATE books SET 
        isbn = ?,
        title = ?,
        genre = ?,
        total_copies = ?,
        available_copies = ?,
        author_id = ?,
        publisher_id = ?,
        published_year = ?
       WHERE book_id = ?`,
      [
        isbn,
        title,
        genre,
        total_copies,
        available_copies,
        author_id,
        publisher_id,
        published_year,
        id
      ]
    );
    
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.promise().query('DELETE FROM books WHERE book_id = ?', [id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};

// Add this function
export const getAllReservations = async (req, res) => {
  try {
    const [rows] = await pool
      .promise()
      .query(`
        SELECT r.*, b.title, 
               CONCAT(s.first_name, ' ', s.last_name) as student_name,
               s.roll_no
        FROM reservations r
        JOIN books b ON r.book_id = b.book_id
        JOIN students s ON r.member_id = s.member_id
        ORDER BY r.reservation_date DESC
      `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching all reservations:', err);
    res.status(500).json({ message: 'Failed to fetch reservations' });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Begin transaction
    const connection = await pool.promise().getConnection();
    await connection.beginTransaction();
    
    try {
      // Get reservation details
      const [[reservation]] = await connection.query(
        'SELECT * FROM reservations WHERE reservation_id = ?',
        [id]
      );
      
      if (!reservation) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ message: 'Reservation not found' });
      }
      
      // Update book available copies
      await connection.query(
        'UPDATE books SET available_copies = available_copies + 1 WHERE book_id = ?',
        [reservation.book_id]
      );
      
      // Update student's issued books count
      await connection.query(
        'UPDATE students SET total_books_issued = total_books_issued - 1 WHERE member_id = ?',
        [reservation.member_id]
      );
      
      // Delete reservation
      await connection.query(
        'DELETE FROM reservations WHERE reservation_id = ?',
        [id]
      );
      
      await connection.commit();
      connection.release();
      
      res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    console.error('Error deleting reservation:', err);
    res.status(500).json({ message: 'Failed to delete reservation' });
  }
};


