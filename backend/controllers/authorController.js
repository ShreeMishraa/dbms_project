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

// Add this function to the existing file

export const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if author exists
    const [[author]] = await pool
      .promise()
      .query('SELECT * FROM authors WHERE author_id = ?', [id]);
      
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    
    // Delete the author
    await pool.promise().query('DELETE FROM authors WHERE author_id = ?', [id]);
    res.json({ message: 'Author deleted successfully' });
  } catch (err) {
    console.error('Error deleting author:', err);
    res.status(500).json({ message: 'Failed to delete author', error: err.message });
  }
};

// Add this function
export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, biography, nationality } = req.body;
    
    // Check if author exists
    const [[author]] = await pool
      .promise()
      .query('SELECT * FROM authors WHERE author_id = ?', [id]);
      
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    
    // Update the author
    await pool.promise().query(
      'UPDATE authors SET name = ?, biography = ?, nationality = ? WHERE author_id = ?',
      [name, biography, nationality, id]
    );
    res.json({ message: 'Author updated successfully' });
  } catch (err) {
    console.error('Error updating author:', err);
    res.status(500).json({ message: 'Failed to update author', error: err.message });
  }
};