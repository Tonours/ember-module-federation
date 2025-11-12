import { Router } from 'express';
import { getTags, getTagById } from '../controllers/tags.controller.js';

const router = Router();

router.get('/', getTags);
router.get('/:id', getTagById);

export default router;
