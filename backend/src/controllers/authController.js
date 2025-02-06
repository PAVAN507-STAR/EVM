import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const authController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      
      // Validate required fields
      if (!email || !password || !name) {
        return res.status(400).json({ 
          message: 'Please provide email, password, and name' 
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const user = await User.create({
        email,
        password,
        name
      });

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({ 
        token, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email 
        } 
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        message: error.message || 'Registration failed',
        details: error.errors // Include mongoose validation errors if any
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Log successful login
      console.log('Login successful for user:', user._id);
      
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ message: error.message });
    }
  },

  async guestLogin(req, res) {
    try {
      const guestUser = await User.create({
        email: `guest_${Date.now()}@example.com`,
        password: 'guest123',
        name: `Guest_${Date.now()}`,
        role: 'user'
      });

      const token = jwt.sign({ id: guestUser._id }, process.env.JWT_SECRET);
      res.json({ token, user: { id: guestUser._id, name: guestUser.name, email: guestUser.email } });
    } catch (error) {
      console.error('Guest login error:', error);
      res.status(400).json({ message: error.message });
    }
  }
}; 