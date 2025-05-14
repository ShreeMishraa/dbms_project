import express from 'express';
import { 
  addBook, 
  getAllBooks, 
  deleteBook, 
  updateBook, getAllReservations, deleteReservation
} from '../controllers/bookController.js';
import { authMiddleware, isAdmin } from '../utils/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateBook = [
  body('isbn').isISBN(),
  body('title').notEmpty(),
  body('total_copies').isInt({ min: 1 }),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  }
];

router.post('/', authMiddleware, isAdmin, validateBook, addBook);
router.put('/:id', authMiddleware, isAdmin, updateBook);
router.delete('/:id', authMiddleware, isAdmin, deleteBook);
router.get('/', getAllBooks);
router.get('/all', authMiddleware, isAdmin, getAllReservations);
router.delete('/:id', authMiddleware, isAdmin, deleteReservation);

export default router;