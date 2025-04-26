import express from 'express';
import {
  createFine, payFine, getMyFines
} from '../controllers/fineController.js';
import { authMiddleware, isAdmin, isStudent } from '../utils/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateFine = [
  body('member_id').isInt(),
  body('amount').isFloat({ min: 0 }),
  body('reason').notEmpty(),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  }
];

router.post('/', authMiddleware, isAdmin, validateFine, createFine);
router.post('/pay', authMiddleware, isStudent, payFine);
router.get('/', authMiddleware, isStudent, getMyFines);

export default router;
