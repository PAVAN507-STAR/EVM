import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, MenuItem } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import { eventService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const categories = ['conference', 'workshop', 'social', 'other'];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
    category: categories[0],
    location: '',
    maxAttendees: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!event.title || !event.description || !event.date || !event.category || !event.location) {
      return;
    }

    if (new Date(event.date) < new Date()) {
      return;
    }

    try {
      const formattedEvent = {
        title: event.title.trim(),
        description: event.description.trim(),
        date: new Date(event.date).toISOString(),
        category: event.category,
        location: event.location.trim(),
        maxAttendees: event.maxAttendees ? parseInt(event.maxAttendees) : null
      };

      await eventService.createEvent(formattedEvent);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ 
          p: 4,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          }
        }}>
          <Typography variant="h5" gutterBottom>
            Create New Event
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              label="Title"
              margin="normal"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
            />
            <TextField
              required
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={4}
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Date and Time"
                value={event.date}
                onChange={(newValue) => setEvent({ ...event, date: newValue })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    margin="normal"
                  />
                )}
              />
            </LocalizationProvider>
            <TextField
              required
              select
              fullWidth
              label="Category"
              margin="normal"
              value={event.category}
              onChange={(e) => setEvent({ ...event, category: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              fullWidth
              label="Location"
              margin="normal"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
            />
            <TextField
              fullWidth
              label="Max Attendees"
              type="number"
              margin="normal"
              value={event.maxAttendees}
              onChange={(e) => setEvent({ ...event, maxAttendees: e.target.value })}
              inputProps={{ min: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ 
                mt: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Create Event
            </Button>
          </form>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default CreateEvent; 