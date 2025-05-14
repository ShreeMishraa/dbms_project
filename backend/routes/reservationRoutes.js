import express from 'express';
import {
  reserveBook, getMyReservations, returnBook, getAllReservations, deleteReservation
} from '../controllers/reservationController.js';
import { authMiddleware, isStudent, isAdmin } from '../utils/auth.js';

const router = express.Router();

router.post('/', authMiddleware, isStudent, reserveBook);
router.post('/return', authMiddleware, isStudent, returnBook);
router.get('/', authMiddleware, isStudent, getMyReservations);
router.get('/all', authMiddleware, isAdmin, getAllReservations);
router.delete('/:id', authMiddleware, isAdmin, deleteReservation); // Add this route

export default router;