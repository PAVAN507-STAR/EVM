import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validateUser } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/register', 
  authLimiter,
  validateUser,
  authController.register
);

router.post('/login', authLimiter, authController.login);
router.post('/guest-login', authLimiter, authController.guestLogin);

export default router; 