import pool from '../config/db.js';

export const reserveBook = async (req, res) => {
  try {
    const member_id = req.userId;
    const { book_id } = req.body;
    const [[book]] = await pool
      .promise()
      .query('SELECT available_copies FROM books WHERE book_id=?', [book_id]);
    if (!book || book.available_copies < 1)
      return res.status(400).json({ message: 'Book not available' });

    const [{ insertId }] = await pool
      .promise()
      .query(
        'INSERT INTO reservations(member_id,book_id) VALUES(?,?)',
        [member_id, book_id]
      );
    await pool
      .promise()
      .query(
        'UPDATE books SET available_copies=available_copies-1 WHERE book_id=?',
        [book_id]
      );

    res.status(201).json({ reservationId: insertId });
  } catch (err) {
    res.status(500).json({ message: 'Reservation failed', error: err.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const member_id = req.userId;
    const { reservation_id } = req.body;
    
    // Begin transaction
    const connection = await pool.promise().getConnection();
    await connection.beginTransaction();
    
    try {
      const [[r]] = await connection.query(
        'SELECT * FROM reservations WHERE reservation_id=? AND member_id=?',
        [reservation_id, member_id]
      );
      
      if (!r) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ message: 'Reservation not found' });
      }

      // Update book's available copies
      await connection.query(
        'UPDATE books SET available_copies=available_copies+1 WHERE book_id=?',
        [r.book_id]
      );
      
      // Update student's issued books count
      // In the returnBook function, ensure the count cannot go below 0
      await connection.query(
        'UPDATE students SET total_books_issued = GREATEST(total_books_issued - 1, 0) WHERE member_id = ?',
        [member_id]
      );
      
      // Delete the reservation
      await connection.query(
        'DELETE FROM reservations WHERE reservation_id=?', 
        [reservation_id]
      );
      
      await connection.commit();
      connection.release();
      
      res.json({ message: 'Book returned successfully' });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    console.error('Error returning book:', err);
    res.status(500).json({ message: 'Return failed', error: err.message });
  }
};

export const getMyReservations = async (req, res) => {
  try {
    const member_id = req.userId;
    const [rows] = await pool
      .promise()
      .query(
        `SELECT r.*, b.title, a.name as author_name
         FROM reservations r
         JOIN books b ON r.book_id = b.book_id
         LEFT JOIN authors a ON b.author_id = a.author_id
         WHERE r.member_id = ?`,
        [member_id]
      );
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch reservations:', err);
    res.status(500).json({ message: 'Failed to fetch reservations' });
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
               s.roll_no,
               a.name as author_name
        FROM reservations r
        JOIN books b ON r.book_id = b.book_id
        JOIN students s ON r.member_id = s.member_id
        LEFT JOIN authors a ON b.author_id = a.author_id
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
        'UPDATE students SET total_books_issued = GREATEST(total_books_issued - 1, 0) WHERE member_id = ?',
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
