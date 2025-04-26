import express from 'express';
import { registerStudent, getProfile } from '../controllers/studentController.js';
import { authMiddleware, isStudent } from '../utils/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateStudent = [
  body('roll_no').notEmpty(),
  body('first_name').notEmpty(),
  body('email').isEmail(),
  body('phone').isMobilePhone(),
  body('dob').isDate(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  }
];

router.post('/register', validateStudent, registerStudent);
router.get('/profile', authMiddleware, isStudent, getProfile);

export default router;
