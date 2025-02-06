import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      bgcolor: 'background.default'
    }}>
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Create and Join Amazing Events
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Connect with people who share your interests and passions
            </Typography>
            {!user ? (
              <Box sx={{ '& > button': { mr: 2 } }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </Box>
            ) : (
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box component="img" 
                 src="/event-illustration.svg" 
                 alt="Events"
                 sx={{ width: '100%', maxWidth: 500 }} 
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 