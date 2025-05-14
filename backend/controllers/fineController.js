import pool from '../config/db.js';

// Admin-only: Create a fine for a student by member_id or roll_no
export const createFine = async (req, res) => {
  try {
    let { member_id, amount, reason, roll_no } = req.body;

    // If roll_no provided instead of member_id, look it up
    if (!member_id && roll_no) {
      const [[stu]] = await pool
        .promise()
        .query('SELECT member_id FROM students WHERE roll_no = ?', [roll_no]);
      if (!stu) return res.status(404).json({ message: 'Student not found by roll_no' });
      member_id = stu.member_id;
    }

    if (!member_id) {
      return res.status(400).json({ message: 'Either member_id or roll_no is required' });
    }

    // Verify student exists
    const [[check]] = await pool
      .promise()
      .query('SELECT 1 FROM students WHERE member_id = ?', [member_id]);
    if (!check) {
      return res.status(404).json({ message: 'Student not found by member_id' });
    }

    // Insert the fine
    const [{ insertId }] = await pool
      .promise()
      .query(
        'INSERT INTO fines(member_id, amount, reason) VALUES (?, ?, ?)',
        [member_id, amount, reason]
      );

    res.status(201).json({ fine_id: insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create fine', error: err.message });
  }
};

// Student-only: Pay a fine
export const payFine = async (req, res) => {
  try {
    const { fine_id } = req.body;
    const member_id = req.userId;

    const [fines] = await pool
      .promise()
      .query(
        'SELECT * FROM fines WHERE fine_id = ? AND member_id = ? AND payment_status = "unpaid"',
        [fine_id, member_id]
      );
    if (fines.length === 0) {
      return res.status(404).json({ message: 'Fine not found or already paid' });
    }

    await pool
      .promise()
      .query(
        `UPDATE fines
         SET payment_status = 'paid',
             payment_date   = CURRENT_TIMESTAMP
         WHERE fine_id = ?`,
        [fine_id]
      );

    res.json({ message: 'Fine paid successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Payment failed', error: err.message });
  }
};

// Student-only: List my fines
// Update the getMyFines function
export const getMyFines = async (req, res) => {
  try {
    const member_id = req.userId;
    
    // Fix the query to handle possible missing issued_date field
    const [rows] = await pool
      .promise()
      .query(`
        SELECT fine_id, amount, reason, payment_status, 
               IFNULL(issued_date, CURRENT_TIMESTAMP) as issued_date, 
               payment_date 
        FROM fines 
        WHERE member_id = ?
      `, [member_id]);
      
    res.json(rows);
  } catch (err) {
    console.error('Error fetching fines:', err);
    res.status(500).json({ message: 'Failed to fetch fines', error: err.message });
  }
};

// Add this function to the existing file

export const getFinesByLibrarian = async (req, res) => {
  try {
    const [rows] = await pool
      .promise()
      .query(`
        SELECT f.*, s.roll_no, CONCAT(s.first_name, ' ', s.last_name) AS student_name
        FROM fines f
        JOIN students s ON f.member_id = s.member_id
        ORDER BY f.payment_status ASC, f.fine_id DESC
      `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching fines by librarian:', err);
    res.status(500).json({ message: 'Failed to fetch fines', error: err.message });
  }
};

// Add this function to the existing file

export const deleteFine = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if fine exists
    const [[fine]] = await pool
      .promise()
      .query('SELECT * FROM fines WHERE fine_id = ?', [id]);
      
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }
    
    // Delete the fine
    await pool.promise().query('DELETE FROM fines WHERE fine_id = ?', [id]);
    
    res.json({ message: 'Fine deleted successfully' });
  } catch (err) {
    console.error('Error deleting fine:', err);
    res.status(500).json({ message: 'Failed to delete fine', error: err.message });
  }
};