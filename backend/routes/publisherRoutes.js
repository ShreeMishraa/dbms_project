import express from 'express';
import {
  createPublisher, getAllPublishers
} from '../controllers/publisherController.js';
import { authMiddleware, isAdmin } from '../utils/auth.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createPublisher);
router.get('/', getAllPublishers);

export default router;
