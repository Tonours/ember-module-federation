import express from 'express';
import * as articlesController from '../controllers/articles.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', articlesController.getArticles);
router.get('/:id', articlesController.getArticleById);
router.post('/', authMiddleware, articlesController.createArticle);
router.patch('/:id', authMiddleware, articlesController.updateArticle);
router.delete('/:id', authMiddleware, articlesController.deleteArticle);

export default router;
