import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }
      }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom component={motion.h5}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {event.title}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {format(new Date(event.date), 'PPP')} at {format(new Date(event.date), 'p')}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {event.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.attendees?.length || 0} attending
          </Typography>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate(`/events/${event._id}`)}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              }
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default EventCard; 