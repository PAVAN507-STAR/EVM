import express from 'express';
import { eventController } from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/:id/attend', authenticate, eventController.attendEvent);

export default router; 