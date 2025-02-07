import { Card, CardContent, CardActions, Typography, Button, Box, useTheme, useMediaQuery } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
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
        <CardContent sx={{ 
          flexGrow: 1,
          p: { xs: 2, sm: 3 }
        }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            gutterBottom 
            component={motion.h5}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            sx={{
              fontSize: {
                xs: '1.1rem',
                sm: '1.25rem',
                md: '1.5rem'
              },
              lineHeight: 1.3,
              mb: { xs: 1, sm: 2 }
            }}
          >
            {event.title}
          </Typography>
          <Box sx={{ mb: { xs: 1, sm: 2 } }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem'
                }
              }}
            >
              {format(new Date(event.date), 'PPP')} at {format(new Date(event.date), 'p')}
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 1, sm: 2 },
              fontSize: {
                xs: '0.875rem',
                sm: '1rem'
              },
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {event.description}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: {
                xs: '0.75rem',
                sm: '0.875rem'
              }
            }}
          >
            {event.attendees?.length || 0} attending
          </Typography>
        </CardContent>
        <CardActions sx={{ 
          px: { xs: 1.5, sm: 2 }, 
          pb: { xs: 1.5, sm: 2 } 
        }}>
          <Button
            variant="contained"
            fullWidth
            size={isMobile ? "medium" : "large"}
            onClick={() => navigate(`/events/${event._id}`)}
            sx={{
              transition: 'all 0.3s ease',
              py: { xs: 1, sm: 1.5 },
              '&:hover': {
                transform: isMobile ? 'none' : 'translateY(-2px)',
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