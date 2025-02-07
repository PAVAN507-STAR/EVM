import { useEffect } from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';

const WebSocketErrorBoundary = ({ children }) => {
  const { isConnected, reconnect } = useWebSocket();

  useEffect(() => {
    if (!isConnected) {
      const timer = setTimeout(reconnect, 5000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, reconnect]);

  return children;
};

export default WebSocketErrorBoundary; 