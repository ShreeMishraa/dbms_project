import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/auth.js';

export const registerLibrarian = async (req, res) => {
  try {
    const {
      eid, name, email, phone,
      dob, date_of_employment, shift_timings, password
    } = req.body;
    const age = Math.floor((Date.now() - new Date(dob)) / (1000*60*60*24*365));
    const hashed = await bcrypt.hash(password, 10);
    const [{ insertId }] = await pool
      .promise()
      .query(
        `INSERT INTO librarians
         (eid, name, email, phone, dob, age, date_of_employment, shift_timings, password)
         VALUES(?,?,?,?,?,?,?,?,?)`,
        [eid, name, email, phone, dob, age, date_of_employment, shift_timings, hashed]
      );
    const token = generateToken(insertId, 'librarian');
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
};

export const getAllLibrarians = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM librarians');
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Failed to fetch librarians' });
  }
};

export const deleteLibrarian = async (req, res) => {
  try {
    const { librarian_id } = req.params;
    await pool.promise().query('DELETE FROM librarians WHERE librarian_id=?', [librarian_id]);
    res.json({ message: 'Librarian deleted' });
  } catch {
    res.status(500).json({ message: 'Delete failed' });
  }
};
