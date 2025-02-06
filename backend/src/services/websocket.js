import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import WebSocketManager from './WebSocketManager.js';
import { Event } from '../models/Event.js';

const ACTIVE_ROOMS_KEY = 'active_rooms';
const USER_ROOMS_PREFIX = 'user_rooms:';

export const initializeWebSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  const wsManager = new WebSocketManager(io);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    await wsManager.handleUserConnection(socket, socket.userId);

    socket.on('joinEvent', async (eventId) => {
      try {
        await wsManager.joinRoom(socket, eventId);
      } catch (error) {
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    socket.on('leaveEvent', async (eventId) => {
      try {
        await wsManager.leaveRoom(socket, eventId);
      } catch (error) {
        socket.emit('error', { message: 'Failed to leave room' });
      }
    });

    socket.on('disconnect', async () => {
      await wsManager.handleUserDisconnection(socket, socket.userId);
    });
  });

  return io;
};

export const emitEventUpdate = async (io, eventId, data) => {
  try {
    // Emit to both specific room and global listeners
    const roomId = `event:${eventId}`;
    
    // Get fresh data from database to ensure consistency
    const updatedEvent = await Event.findById(eventId)
      .populate('attendees', 'name email')
      .populate('creator', 'name')
      .lean();

    const eventData = {
      eventId,
      event: updatedEvent,
      attendees: updatedEvent.attendees,
      attendeeCount: updatedEvent.attendees.length,
      timestamp: Date.now()
    };

    io.to(roomId).emit('eventUpdate', eventData);
    io.emit('eventUpdate', eventData);
  } catch (error) {
    console.error('Failed to emit event update:', error);
  }
}; 