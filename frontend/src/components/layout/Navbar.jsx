import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Button
            color="primary"
            onClick={() => navigate('/')}
            sx={{ fontSize: '1.2rem', fontWeight: 600 }}
          >
            EventHub
          </Button>

          <Box>
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  sx={{ mr: 2 }}
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={() => navigate('/create-event')}
                  sx={{ mr: 2 }}
                >
                  Create Event
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="outlined"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/login')}
                  sx={{ mr: 2 }}
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  variant="contained"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 