import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/auth.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // try student
    const [[student]] = await pool
      .promise()
      .query('SELECT * FROM students WHERE email=?', [email]);
    if (student && await bcrypt.compare(password, student.password)) {
      const token = generateToken(student.member_id, 'student');
      return res.json({ token });
    }
    // try librarian
    const [[lib]] = await pool
      .promise()
      .query('SELECT * FROM librarians WHERE email=?', [email]);
    if (lib && await bcrypt.compare(password, lib.password)) {
      const token = generateToken(lib.librarian_id, 'librarian');
      return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};
