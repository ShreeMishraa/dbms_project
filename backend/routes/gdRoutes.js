import express from 'express';
import {
  createRoom, getAllRooms,
  reserveGD, getMyGD, cancelGD
} from '../controllers/gdController.js';
import { authMiddleware, isAdmin, isStudent } from '../utils/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateRoom = [
  body('room_name').notEmpty(),
  body('capacity').isInt({ min: 1 }),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  }
];

const validateGD = [
  body('room_id').isInt(),
  body('reservation_time').isISO8601(),
  body('duration_minutes').isInt({ min: 1 }),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  }
];

router.post('/rooms', authMiddleware, isAdmin, validateRoom, createRoom);
router.get('/rooms', getAllRooms);

router.post('/', authMiddleware, isStudent, validateGD, reserveGD);
router.get('/', authMiddleware, isStudent, getMyGD);
router.delete('/:gd_reservation_id', authMiddleware, isStudent, cancelGD);

export default router;
