import express from 'express';
import {
  reserveBook, getMyReservations, returnBook
} from '../controllers/reservationController.js';
import { authMiddleware, isStudent } from '../utils/auth.js';

const router = express.Router();

router.post('/', authMiddleware, isStudent, reserveBook);
router.post('/return', authMiddleware, isStudent, returnBook);
router.get('/', authMiddleware, isStudent, getMyReservations);

export default router;
