import express from 'express';
import {
  createPublisher, getAllPublishers, deletePublisher, updatePublisher // Add this import
} from '../controllers/publisherController.js';
import { authMiddleware, isAdmin } from '../utils/auth.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createPublisher);
router.get('/', getAllPublishers);
router.delete('/:id', authMiddleware, isAdmin, deletePublisher);
router.put('/:id', authMiddleware, isAdmin, updatePublisher); // Add this route

export default router;