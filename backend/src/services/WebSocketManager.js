import redis from '../config/redis.js';

class WebSocketManager {
  constructor(io) {
    this.io = io;
    this.activeRooms = new Map();
    this.userConnections = new Map();
  }

  async handleUserConnection(socket, userId) {
    const userConnections = this.userConnections.get(userId) || new Set();
    userConnections.add(socket.id);
    this.userConnections.set(userId, userConnections);

    const rooms = await redis.smembers(`user_rooms:${userId}`);
    await Promise.all(rooms.map(room => this.joinRoom(socket, room)));
  }

  async handleUserDisconnection(socket, userId) {
    const userConnections = this.userConnections.get(userId);
    if (userConnections) {
      userConnections.delete(socket.id);
      if (userConnections.size === 0) {
        this.userConnections.delete(userId);
        await this.cleanupUserRooms(userId);
      }
    }
  }

  async joinRoom(socket, eventId) {
    const roomId = `event:${eventId}`;
    const room = this.activeRooms.get(roomId) || new Set();
    room.add(socket.id);
    this.activeRooms.set(roomId, room);

    await redis.sadd(`user_rooms:${socket.userId}`, roomId);
    socket.join(roomId);

    this.io.to(roomId).emit('userJoined', {
      userId: socket.userId,
      eventId,
      activeUsers: room.size
    });
  }

  async leaveRoom(socket, eventId) {
    const roomId = `event:${eventId}`;
    const room = this.activeRooms.get(roomId);
    
    if (room) {
      room.delete(socket.id);
      if (room.size === 0) {
        this.activeRooms.delete(roomId);
      }
    }

    await redis.srem(`user_rooms:${socket.userId}`, roomId);
    socket.leave(roomId);

    this.io.to(roomId).emit('userLeft', {
      userId: socket.userId,
      eventId,
      activeUsers: room?.size || 0
    });
  }

  async cleanupUserRooms(userId) {
    const rooms = await redis.smembers(`user_rooms:${userId}`);
    await Promise.all(rooms.map(room => redis.srem(`user_rooms:${userId}`, room)));
  }
}

export default WebSocketManager; 