import pool from '../config/db.js';

export const createPublisher = async (req, res) => {
  const { name, location, contact } = req.body;
  try {
    const [result] = await pool
      .promise()
      .query(
        'INSERT INTO publishers (name, location, contact) VALUES (?, ?, ?)',
        [name, location, contact]
      );
    res.status(201).json({ publisherId: result.insertId });
  } catch {
    res.status(500).json({ message: 'Failed to create publisher' });
  }
};

export const getAllPublishers = async (req, res) => {
  try {
    const [publishers] = await pool.promise().query('SELECT * FROM publishers');
    res.json(publishers);
  } catch {
    res.status(500).json({ message: 'Failed to fetch publishers' });
  }
};
