import { useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useWebSocket } from '../../contexts/WebSocketContext';

const WebSocketErrorBoundary = ({ children }) => {
  const { isConnected, reconnect } = useWebSocket();

  useEffect(() => {
    if (!isConnected) {
      const timer = setTimeout(reconnect, 5000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, reconnect]);

  return (
    <>
      <Snackbar
        open={!isConnected}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning">
          Connection lost. Attempting to reconnect...
        </Alert>
      </Snackbar>
      {children}
    </>
  );
};

export default WebSocketErrorBoundary; 