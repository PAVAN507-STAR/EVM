import { Event } from '../models/Event.js';
import { io } from '../app.js';
import { clearCache } from '../middleware/cache.js';
import { emitEventUpdate } from '../services/websocket.js';
import redis from '../config/redis.js';

const CACHE_DURATION = 300; // 5 minutes

export const eventController = {
  async createEvent(req, res) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ 
          message: 'Authentication required' 
        });
      }

      const event = await Event.create({
        ...req.body,
        creator: req.user._id
      });

      await event.populate('creator', 'name');
      io.emit('newEvent', event);
      res.status(201).json(event);
    } catch (error) {
      console.error('Create Event Error:', error);
      res.status(400).json({ 
        message: error.message || 'Failed to create event'
      });
    }
  },

  async getEvents(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { term, categories } = req.query;
      const skip = (page - 1) * limit;

      const query = {};
      if (term) {
        query.title = { $regex: term, $options: 'i' };
      }
      if (categories?.length) {
        query.category = { $in: categories };
      }

      const [events, total] = await Promise.all([
        Event.find(query)
          .sort({ date: 1 })
          .skip(skip)
          .limit(limit)
          .populate('creator', 'name')
          .populate('attendees', 'name email')
          .lean(),
        Event.countDocuments(query)
      ]);

      const response = {
        events: events || [],
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          current: page
        }
      };

      // Set cache with populated data
      const cacheKey = `events:${JSON.stringify(query)}:page:${page}:limit:${limit}`;
      await redis.setex(cacheKey, CACHE_DURATION, JSON.stringify(response));

      res.json(response);
    } catch (error) {
      console.error('Get Events Error:', error);
      res.status(500).json({ message: 'Failed to fetch events' });
    }
  },

  async getEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id)
        .populate('creator', 'name email')
        .populate('attendees', 'name email')
        .lean();
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.json(event);
    } catch (error) {
      console.error('Get Event Error:', error);
      res.status(500).json({ message: 'Failed to fetch event details' });
    }
  },

  async updateEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      if (event.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this event' });
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('creator', 'name');

      await clearCache(`events:*`);
      io.to(`event:${req.params.id}`).emit('eventUpdate', updatedEvent);

      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      if (event.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this event' });
      }

      await event.deleteOne();
      await clearCache(`events:*`);
      io.to(`event:${req.params.id}`).emit('eventDeleted', req.params.id);

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async attendEvent(req, res) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Check if user is already attending
      const alreadyAttending = event.attendees.includes(req.user._id);
      if (alreadyAttending) {
        return res.status(400).json({ message: 'Already attending this event' });
      }

      // Check if event has reached max attendees
      if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event has reached maximum capacity' });
      }

      // Add user to attendees
      event.attendees.push(req.user._id);
      await event.save();

      // Get updated event with populated fields
      const updatedEvent = await Event.findById(req.params.id)
        .populate('attendees', 'name email')
        .populate('creator', 'name email');

      // Emit socket event with full event data
      io.emit('eventUpdate', {
        eventId: event._id,
        event: updatedEvent,
        attendees: updatedEvent.attendees,
        attendeeCount: updatedEvent.attendees.length
      });

      res.json(updatedEvent);
    } catch (error) {
      console.error('Attend event error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  async updateEventAttendees(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findById(id).populate('attendees', 'name email');
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Clear cache for this event
      await clearCache(`events:*`);
      await clearCache(`event:${id}`);

      // Emit real-time update
      io.to(`event:${id}`).emit('attendeesUpdated', {
        eventId: id,
        attendees: event.attendees
      });

      res.json({ attendees: event.attendees });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getEventUpdates(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findById(id)
        .populate('attendees', 'name email')
        .populate('creator', 'name email');

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Subscribe to real-time updates
      req.app.get('io').to(`event:${id}`).emit('eventData', event);
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}; 