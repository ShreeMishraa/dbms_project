import pool from '../config/db.js';

export const createAuthor = async (req, res) => {
  const { name, biography, nationality } = req.body;
  try {
    const [result] = await pool
      .promise()
      .query(
        'INSERT INTO authors (name, biography, nationality) VALUES (?, ?, ?)',
        [name, biography, nationality]
      );
    res.status(201).json({ authorId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create author', error: error.message });
  }
};

export const getAllAuthors = async (req, res) => {
  try {
    const [authors] = await pool.promise().query('SELECT * FROM authors');
    res.json(authors);
  } catch {
    res.status(500).json({ message: 'Failed to fetch authors' });
  }
};
