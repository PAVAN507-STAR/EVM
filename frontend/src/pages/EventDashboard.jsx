import { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import EventCard from '../components/events/EventCard';
import EventSearch from '../components/events/EventSearch';
import { eventService } from '../services/api';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { AnimatePresence, motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { socket } = useWebSocket();
  const [error, setError] = useState('');

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await eventService.getEvents();
      if (response && response.events) {
        setEvents(response.events);
        setFilteredEvents(response.events);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError(error.message || 'Failed to fetch events');
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (!socket) return;

    socket.on('eventUpdate', (data) => {
      setEvents(prevEvents => {
        return prevEvents.map(event => {
          if (event._id === data.eventId) {
            return {
              ...event,
              attendees: data.attendees || event.attendees
            };
          }
          return event;
        });
      });

      setFilteredEvents(prevFiltered => {
        return prevFiltered.map(event => {
          if (event._id === data.eventId) {
            return {
              ...event,
              attendees: data.attendees || event.attendees
            };
          }
          return event;
        });
      });
    });

    return () => {
      socket.off('eventUpdate');
    };
  }, [socket]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredEvents(events);
      return;
    }
    
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </motion.div>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Events Dashboard
        </Typography>
        
        <EventSearch onSearch={handleSearch} />
      </motion.div>
      
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {filteredEvents.map(event => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <EventCard event={event} />
              </Grid>
            ))}
            {filteredEvents.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center">
                  No events found
                </Typography>
              </Grid>
            )}
          </Grid>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default EventDashboard; 