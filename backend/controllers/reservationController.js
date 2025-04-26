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
    const [[r]] = await pool
      .promise()
      .query(
        'SELECT * FROM reservations WHERE reservation_id=? AND member_id=?',
        [reservation_id, member_id]
      );
    if (!r) return res.status(404).json({ message: 'Reservation not found' });

    await pool
      .promise()
      .query(
        'UPDATE books SET available_copies=available_copies+1 WHERE book_id=?',
        [r.book_id]
      );
    await pool
      .promise()
      .query('DELETE FROM reservations WHERE reservation_id=?', [reservation_id]);

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Return failed', error: err.message });
  }
};

export const getMyReservations = async (req, res) => {
  try {
    const member_id = req.userId;
    const [rows] = await pool
      .promise()
      .query(
        `SELECT r.*, b.title
         FROM reservations r
         JOIN books b ON r.book_id=b.book_id
         WHERE r.member_id=?`,
        [member_id]
      );
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Failed to fetch reservations' });
  }
};
