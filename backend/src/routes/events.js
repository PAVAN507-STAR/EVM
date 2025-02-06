import { Router } from 'express';
import { eventController } from '../controllers/eventController.js';
import { validateEvent } from '../middleware/validate.js';
import { protect, authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, validateEvent, eventController.createEvent);
router.get('/', protect, eventController.getEvents);
router.get('/:id', protect, eventController.getEvent);
router.patch('/:id', protect, validateEvent, eventController.updateEvent);
router.delete('/:id', protect, eventController.deleteEvent);
router.post('/:id/attend', protect, eventController.attendEvent);

export const eventRoutes = router; 