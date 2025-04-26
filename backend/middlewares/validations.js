import { body, validationResult } from 'express-validator';

// Student Registration Validation
export const validateStudentRegistration = [
  body('roll_no').notEmpty().withMessage('Roll number is required'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  body('dob').isDate().withMessage('Invalid date format (YYYY-MM-DD)'),
  body('age').isInt({ min: 10 }).withMessage('Age must be at least 10'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Book Validation
export const validateBook = [
  body('isbn').isISBN().withMessage('Invalid ISBN'),
  body('title').notEmpty().withMessage('Title is required'),
  body('total_copies').isInt({ min: 1 }).withMessage('Total copies must be at least 1'),
];

// Fine Validation
export const validateFine = [
  body('amount').isFloat({ min: 0 }).withMessage('Fine amount must be a positive number'),
  body('reason').notEmpty().withMessage('Reason is required'),
];

// Generic Error Handler Middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};