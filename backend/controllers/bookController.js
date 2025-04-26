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
