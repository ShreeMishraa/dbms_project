import express from 'express';
import { createAuthor, getAllAuthors, deleteAuthor, updateAuthor } from '../controllers/authorController.js';
import { authMiddleware, isAdmin } from '../utils/auth.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createAuthor);
router.get('/', getAllAuthors);
router.delete('/:id', authMiddleware, isAdmin, deleteAuthor);
router.put('/:id', authMiddleware, isAdmin, updateAuthor);

export default router;
