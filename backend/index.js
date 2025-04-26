import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import librarianRoutes from './routes/librarianRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import publisherRoutes from './routes/publisherRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import fineRoutes from './routes/fineRoutes.js';
import gdRoutes from './routes/gdRoutes.js';
import pool from './config/db.js';
import initDb from './utils/init.js';

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// initialization
const startServer = async () => {
  try {
    await pool.promise().getConnection();
    console.log('Connected to MySQL');
    await initDb();
    console.log('Database initialized!');
    
    // mount all routes
    app.use('/api/login', authRoutes);
    app.use('/api/students', studentRoutes);
    app.use('/api/librarians', librarianRoutes);
    app.use('/api/authors', authorRoutes);
    app.use('/api/publishers', publisherRoutes);
    app.use('/api/books', bookRoutes);
    app.use('/api/reservations', reservationRoutes);
    app.use('/api/fines', fineRoutes);
    app.use('/api/gd', gdRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
  } catch (err) {
    console.error('Failed to initialize:', err);
    process.exit(1);
  }
};

startServer();
