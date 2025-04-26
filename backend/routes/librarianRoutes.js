import express from 'express';
import {
  registerLibrarian, getAllLibrarians, deleteLibrarian
} from '../controllers/librarianController.js';
import { authMiddleware, isAdmin } from '../utils/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateLib = [
  body('eid').notEmpty(),
  body('name').notEmpty(),
  body('email').isEmail(),
  body('phone').isMobilePhone(),
  body('dob').isDate(),
  body('date_of_employment').isDate(),
  body('shift_timings').notEmpty(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  }
];

router.post('/register', validateLib, registerLibrarian);
router.get('/', authMiddleware, isAdmin, getAllLibrarians);
router.delete('/:librarian_id', authMiddleware, isAdmin, deleteLibrarian);

export default router;
