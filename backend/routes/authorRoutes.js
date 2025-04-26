import express from 'express';
import { createAuthor, getAllAuthors } from '../controllers/authorController.js';
import { authMiddleware, isAdmin } from '../utils/auth.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createAuthor);
router.get('/', getAllAuthors);

export default router;
