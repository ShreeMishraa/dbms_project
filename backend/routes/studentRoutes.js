import express from 'express'
import { authMiddleware, isStudent, isAdmin } from '../utils/auth.js'
import { body, validationResult } from 'express-validator'
import {
  registerStudent,
  getProfile,
  getAllStudents,
  deleteStudent,
  updateStudent,
  updateProfile
} from '../controllers/studentController.js'

const router = express.Router()

// Validation chain for new student registration
const validateStudent = [
  body('roll_no').notEmpty(),
  body('first_name').notEmpty(),
  body('email').isEmail(),
  body('phone').isMobilePhone(),
  body('dob').isDate(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() })
    }
    next()
  }
]

// Public registration
router.post('/register', validateStudent, registerStudent)

// Get your own profile (students only)
router.get('/profile', authMiddleware, isStudent, getProfile)

// Update your own profile (any authenticated user)
router.put('/profile', authMiddleware, updateProfile)

// Admin‑only student management
router.get('/all', authMiddleware, isAdmin, getAllStudents)
router.delete('/:id', authMiddleware, isAdmin, deleteStudent)
router.put('/:id', authMiddleware, isAdmin, updateStudent)

export default router
