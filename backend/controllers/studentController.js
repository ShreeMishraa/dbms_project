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

// Add these functions to the existing file

export const getAllStudents = async (req, res) => {
  try {
    const [students] = await pool
      .promise()
      .query(`
        SELECT s.member_id, s.roll_no, s.first_name, s.last_name, s.email, 
               s.phone, s.dob, s.age, s.membership_type, s.total_books_issued,
               (SELECT COUNT(*) FROM gd_reservations g WHERE g.member_id = s.member_id) as gd_bookings
        FROM students s
      `);
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if student exists
    const [[student]] = await pool
      .promise()
      .query('SELECT * FROM students WHERE member_id = ?', [id]);
      
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Delete the student
    await pool.promise().query('DELETE FROM students WHERE member_id = ?', [id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ message: 'Failed to delete student', error: err.message });
  }
};

// Add this function
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, membership_type } = req.body;
    
    // First check if student exists
    const [[student]] = await pool
      .promise()
      .query('SELECT * FROM students WHERE member_id = ?', [id]);
      
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Update the student (only allowed fields)
    await pool.promise().query(
      `UPDATE students 
       SET first_name = ?, last_name = ?, email = ?, phone = ?, membership_type = ?
       WHERE member_id = ?`,
      [first_name, last_name, email, phone, membership_type, id]
    );
    
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ message: 'Failed to update student', error: err.message });
  }
};

// Update the updateProfile function to allow both students and librarians
export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, email, phone } = req.body;
    const member_id = req.userId;
    const userRole = req.userRole; // Get role from auth middleware
    
    if (userRole === 'student') {
      // Update student info
      await pool.promise().query(
        `UPDATE students 
         SET first_name = ?, last_name = ?, email = ?, phone = ?
         WHERE member_id = ?`,
        [first_name, last_name, email, phone, member_id]
      );
      
      // Get updated user info
      const [[student]] = await pool.promise().query(
        `SELECT member_id, roll_no, first_name, last_name, email, phone,
                dob, age, membership_type, total_books_issued
         FROM students WHERE member_id = ?`,
        [member_id]
      );
      
      res.json(student);
    } else if (userRole === 'librarian') {
      // Update librarian info
      await pool.promise().query(
        `UPDATE librarians 
         SET name = ?, email = ?, phone = ?
         WHERE librarian_id = ?`,
        [first_name + ' ' + last_name, email, phone, member_id]
      );
      
      // Get updated user info
      const [[librarian]] = await pool.promise().query(
        `SELECT librarian_id, eid, name, email, phone
         FROM librarians WHERE librarian_id = ?`,
        [member_id]
      );
      
      res.json(librarian);
    } else {
      res.status(403).json({ message: 'Unauthorized role' });
    }
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};