import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/auth.js';

export const registerStudent = async (req, res) => {
  try {
    const { roll_no, first_name, last_name, email, phone, dob, password } = req.body;
    const age = Math.floor((Date.now() - new Date(dob)) / (1000*60*60*24*365));
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool
      .promise()
      .query(
        `INSERT INTO students
         (roll_no, first_name, last_name, email, phone, dob, age, password)
         VALUES(?,?,?,?,?,?,?,?)`,
        [roll_no, first_name, last_name, email, phone, dob, age, hashed]
      );
    const token = generateToken(result.insertId, 'student');
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const [[stu]] = await pool
      .promise()
      .query(
        `SELECT member_id, roll_no, first_name, last_name, email, phone,
                dob, age, membership_type, total_books_issued
         FROM students WHERE member_id = ?`,
        [req.userId]
      );
    res.json(stu || {});
  } catch {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};
