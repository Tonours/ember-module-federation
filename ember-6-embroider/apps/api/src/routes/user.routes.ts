import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.put('/profile', userController.updateProfile);
router.put('/password', userController.updatePassword);

export default router;
