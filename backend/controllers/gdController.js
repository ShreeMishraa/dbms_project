import pool from '../config/db.js';

// Admin-only: create a new GD room
export const createRoom = async (req, res) => {
  try {
    const { room_name, capacity } = req.body;
    const [{ insertId }] = await pool
      .promise()
      .query('INSERT INTO gd_rooms(room_name, capacity) VALUES (?, ?)', [
        room_name,
        capacity
      ]);
    res.status(201).json({ room_id: insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create room', error: err.message });
  }
};

// Public: list all GD rooms
export const getAllRooms = async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT gr.room_id,
             gr.room_name,
             gr.capacity,
             COUNT(g.gd_reservation_id) AS current_reservations
      FROM gd_rooms gr
      LEFT JOIN gd_reservations g
        ON g.room_id = gr.room_id
      GROUP BY gr.room_id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching GD rooms:', err);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
};

// Student-only: reserve a GD room
export const reserveGD = async (req, res) => {
  try {
    const member_id = req.userId;
    const { room_id, reservation_time, duration_minutes } = req.body;

    // Convert ISO string to MySQL DATETIME format
    const dt = new Date(reservation_time);
    if (isNaN(dt.getTime())) {
      return res.status(400).json({ message: 'Invalid reservation_time format' });
    }
    const formatted = dt.toISOString().slice(0, 19).replace('T', ' ');

    const [{ insertId }] = await pool
      .promise()
      .query(
        `INSERT INTO gd_reservations
           (member_id, room_id, reservation_time, duration_minutes)
         VALUES (?, ?, ?, ?)`,
        [member_id, room_id, formatted, duration_minutes]
      );

    res.status(201).json({ gd_reservation_id: insertId });
  } catch (err) {
    res.status(500).json({ message: 'Reservation failed', error: err.message });
  }
};

// Student-only: list my GD reservations
export const getMyGD = async (req, res) => {
  try {
    const [rows] = await pool
      .promise()
      .query(
        `SELECT g.*, r.room_name
           FROM gd_reservations g
           JOIN gd_rooms r ON g.room_id = r.room_id
          WHERE g.member_id = ?`,
        [req.userId]
      );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch GD reservations', error: err.message });
  }
};

// Student-only: cancel a GD reservation
export const cancelGD = async (req, res) => {
  try {
    const { gd_reservation_id } = req.params;
    await pool
      .promise()
      .query('DELETE FROM gd_reservations WHERE gd_reservation_id = ?', [
        gd_reservation_id
      ]);
    res.json({ message: 'GD reservation cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Cancel failed', error: err.message });
  }
};

// Add this function
export const deleteRoom = async (req, res) => {
  try {
    const { room_id } = req.params;
    
    // Check if room exists
    const [[room]] = await pool
      .promise()
      .query('SELECT * FROM gd_rooms WHERE room_id = ?', [room_id]);
      
    if (!room) {
      return res.status(404).json({ message: 'GD room not found' });
    }
    
    // Delete the room
    await pool.promise().query('DELETE FROM gd_rooms WHERE room_id = ?', [room_id]);
    res.json({ message: 'GD room deleted successfully' });
  } catch (err) {
    console.error('Error deleting GD room:', err);
    res.status(500).json({ message: 'Failed to delete GD room', error: err.message });
  }
};

// Update the getAllGDReservations function
export const getAllGDReservations = async (req, res) => {
  try {
    // First verify if the status column exists in the gd_reservations table
    const [columns] = await pool.promise().query(`
      SHOW COLUMNS FROM gd_reservations LIKE 'status'
    `);
    
    let query;
    if (columns.length > 0) {
      // If status column exists, use it in the query
      query = `
        SELECT g.gd_reservation_id, g.member_id, g.room_id, g.reservation_time, 
               g.duration_minutes, g.status, r.room_name, 
               CONCAT(s.first_name, ' ', s.last_name) as student_name,
               s.roll_no
        FROM gd_reservations g
        JOIN gd_rooms r ON g.room_id = r.room_id
        JOIN students s ON g.member_id = s.member_id
        ORDER BY g.reservation_time DESC
      `;
    } else {
      // If status column doesn't exist, don't include it in the query
      query = `
        SELECT g.gd_reservation_id, g.member_id, g.room_id, g.reservation_time, 
               g.duration_minutes, r.room_name, 
               CONCAT(s.first_name, ' ', s.last_name) as student_name,
               s.roll_no
        FROM gd_reservations g
        JOIN gd_rooms r ON g.room_id = r.room_id
        JOIN students s ON g.member_id = s.member_id
        ORDER BY g.reservation_time DESC
      `;
    }
    
    const [rows] = await pool.promise().query(query);
    
    // Add derived status for rows that don't have status from the database
    const rowsWithStatus = rows.map(row => {
      if (!row.status) {
        const reservationTime = new Date(row.reservation_time);
        const now = new Date();
        row.status = reservationTime < now ? 'completed' : 'upcoming';
      }
      return row;
    });
    
    res.json(rowsWithStatus);
  } catch (err) {
    console.error('Error fetching all GD reservations:', err);
    res.status(500).json({ message: 'Failed to fetch GD reservations', error: err.message });
  }
};

export const deleteGDReservation = async (req, res) => {
  try {
    const { gd_reservation_id } = req.params;
    
    // Check if reservation exists
    const [[reservation]] = await pool
      .promise()
      .query('SELECT * FROM gd_reservations WHERE gd_reservation_id = ?', [gd_reservation_id]);
      
    if (!reservation) {
      return res.status(404).json({ message: 'GD reservation not found' });
    }
    
    // Delete the reservation
    await pool.promise().query('DELETE FROM gd_reservations WHERE gd_reservation_id = ?', [gd_reservation_id]);
    
    res.json({ message: 'GD reservation deleted successfully' });
  } catch (err) {
    console.error('Error deleting GD reservation:', err);
    res.status(500).json({ message: 'Failed to delete GD reservation' });
  }
};