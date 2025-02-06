import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format'
  }),
  category: z.string(),
  location: z.string().min(1, 'Location is required'),
  maxAttendees: z.number().optional()
});

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const validateEvent = (req, res, next) => {
  try {
    console.log('Validating event data:', req.body);
    const validation = eventSchema.safeParse(req.body);
    
    if (!validation.success) {
      console.error('Validation errors:', validation.error.errors);
      return res.status(400).json({
        message: 'Event validation failed',
        errors: validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    req.body = validation.data;
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({
      message: 'Event validation failed',
      error: error.message
    });
  }
};

export const validateUser = (req, res, next) => {
  try {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validation.error.errors 
      });
    }
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ 
      message: 'Validation failed',
      errors: error.errors || [error.message]
    });
  }
}; 