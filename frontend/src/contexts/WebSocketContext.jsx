import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ['websocket'],
      path: '/socket.io',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  const subscribeToEvent = (eventId) => {
    if (socket) {
      socket.emit('joinEvent', eventId);
    }
  };

  const unsubscribeFromEvent = (eventId) => {
    if (socket) {
      socket.emit('leaveEvent', eventId);
    }
  };

  return (
    <WebSocketContext.Provider value={{ 
      socket, 
      subscribeToEvent, 
      unsubscribeFromEvent 
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext); 