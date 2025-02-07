import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import { format } from 'date-fns';
import { eventService } from '../services/api';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useAuth } from '../contexts/AuthContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../hooks/useNotification';
import { motion } from 'framer-motion';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribeToEvent, unsubscribeFromEvent, socket } = useWebSocket();
  const { showNotification } = useNotification();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleSocketEvents = useCallback(() => {
    if (!socket) return () => {};

    socket.on('eventUpdate', (data) => {
      if (data.eventId === id) {
        setEvent(prev => ({
          ...prev,
          ...data.event,
          attendees: data.attendees || prev.attendees,
        }));
      }
    });

    return () => {
      socket.off('eventUpdate');
    };
  }, [socket, id]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getEvent(id);
        if (response) {
          setEvent(response);
          if (socket) {
            subscribeToEvent(id);
          }
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.response?.data?.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    const cleanup = handleSocketEvents();

    return () => {
      cleanup();
      if (socket) {
        unsubscribeFromEvent(id);
      }
    };
  }, [id, subscribeToEvent, unsubscribeFromEvent, handleSocketEvents, socket]);

  const handleAttend = async () => {
    try {
      setAttending(true);
      const updatedEvent = await eventService.attendEvent(id);
      setEvent(updatedEvent);
      showNotification('Successfully joined the event!', 'success');
    } catch (err) {
      console.error('Failed to join event:', err);
      showNotification(err.message, 'error');
      setError(err.message);
    } finally {
      setAttending(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!event) return <Alert severity="info">Event not found</Alert>;

  const isAttending = event.attendees?.some(attendee => 
    attendee._id === user?.id || attendee === user?.id
  );
  const isCreator = event.creator?._id === user?.id;
  const isEventFull = event.maxAttendees && event.attendees.length >= event.maxAttendees;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          mb: 4,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                gutterBottom
                sx={{ 
                  wordBreak: 'break-word',
                  fontSize: {
                    xs: '1.75rem',
                    sm: '2.25rem',
                    md: '3rem'
                  }
                }}
              >
                {event.title}
              </Typography>
            </motion.div>
            
            <Stack 
              direction={isMobile ? "column" : "row"} 
              spacing={2} 
              sx={{ mb: 3 }}
            >
              <Chip 
                icon={<CalendarTodayIcon />} 
                label={format(new Date(event.date), 'PPP at p')}
                sx={{ maxWidth: isMobile ? '100%' : 'auto' }}
              />
              <Chip 
                icon={<LocationOnIcon />} 
                label={event.location}
                sx={{ maxWidth: isMobile ? '100%' : 'auto' }}
              />
              <Chip 
                icon={<GroupIcon />} 
                label={`${event.attendees?.length || 0} attending${event.maxAttendees ? ` / ${event.maxAttendees} max` : ''}`}
                sx={{ maxWidth: isMobile ? '100%' : 'auto' }}
              />
            </Stack>

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4,
                fontSize: {
                  xs: '0.875rem',
                  sm: '1rem'
                }
              }}
            >
              {event.description}
            </Typography>

            {!isCreator && !isAttending && (
              <Button 
                variant="contained" 
                onClick={handleAttend}
                disabled={attending || isEventFull}
                size={isMobile ? "medium" : "large"}
                fullWidth={isMobile}
              >
                {attending ? 'Joining...' : isEventFull ? 'Event Full' : 'Join Event'}
              </Button>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: { xs: 1.5, sm: 2 },
                mt: { xs: 2, md: 0 }
              }}
            >
              <Typography variant="h6" gutterBottom>
                Attendees {event.maxAttendees && `(${event.attendees.length}/${event.maxAttendees})`}
              </Typography>
              <List dense={isMobile}>
                {event.attendees?.map(attendee => (
                  <ListItem key={attendee._id}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }}>
                        {attendee.name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={attendee.name} 
                      sx={{ 
                        '& .MuiListItemText-primary': {
                          fontSize: isMobile ? '0.875rem' : '1rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default EventDetail; 