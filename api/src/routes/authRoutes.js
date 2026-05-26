import { Router } from 'express';
import{ register, login, me, updateProfile, updatePassword } from'../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.put('/update', authMiddleware, updateProfile);
router.put('/update-password', authMiddleware, updatePassword);

export default router;