import express from 'express';
import authRoutes from './auth.js';
import { eventRoutes } from './events.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);

export default router; 