import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
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
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard; 