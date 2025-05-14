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


// Add this function to the existing file

export const deletePublisher = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if publisher exists
    const [[publisher]] = await pool
      .promise()
      .query('SELECT * FROM publishers WHERE publisher_id = ?', [id]);
      
    if (!publisher) {
      return res.status(404).json({ message: 'Publisher not found' });
    }
    
    // Delete the publisher
    await pool.promise().query('DELETE FROM publishers WHERE publisher_id = ?', [id]);
    res.json({ message: 'Publisher deleted successfully' });
  } catch (err) {
    console.error('Error deleting publisher:', err);
    res.status(500).json({ message: 'Failed to delete publisher', error: err.message });
  }
};

// Add this function to the existing file

export const updatePublisher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, contact } = req.body;
    
    // Check if publisher exists
    const [[publisher]] = await pool
      .promise()
      .query('SELECT * FROM publishers WHERE publisher_id = ?', [id]);
      
    if (!publisher) {
      return res.status(404).json({ message: 'Publisher not found' });
    }
    
    // Update the publisher
    await pool.promise().query(
      'UPDATE publishers SET name = ?, location = ?, contact = ? WHERE publisher_id = ?',
      [name, location, contact, id]
    );
    
    res.json({ message: 'Publisher updated successfully' });
  } catch (err) {
    console.error('Error updating publisher:', err);
    res.status(500).json({ message: 'Failed to update publisher', error: err.message });
  }
};