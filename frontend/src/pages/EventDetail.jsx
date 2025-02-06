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
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';
import { eventService } from '../services/api';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useAuth } from '../contexts/AuthContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSnackbar } from 'notistack';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribeToEvent, unsubscribeFromEvent, socket } = useWebSocket();
  const { enqueueSnackbar } = useSnackbar();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);

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
      enqueueSnackbar('Successfully joined the event!', { variant: 'success' });
    } catch (err) {
      console.error('Failed to join event:', err);
      enqueueSnackbar(err.message, { variant: 'error' });
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

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom>
              {event.title}
            </Typography>
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
              <Chip icon={<CalendarTodayIcon />} 
                    label={format(new Date(event.date), 'PPP at p')} />
              <Chip icon={<LocationOnIcon />} 
                    label={event.location} />
              <Chip icon={<GroupIcon />} 
                    label={`${event.attendees?.length || 0} attending`} />
            </Box>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {event.description}
            </Typography>
            {!isCreator && !isAttending && (
              <Button 
                variant="contained" 
                onClick={handleAttend}
                disabled={attending}
                size="large"
              >
                {attending ? 'Joining...' : 'Join Event'}
              </Button>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Attendees
              </Typography>
              <List>
                {event.attendees?.map(attendee => (
                  <ListItem key={attendee._id}>
                    <ListItemAvatar>
                      <Avatar>{attendee.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={attendee.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EventDetail; 