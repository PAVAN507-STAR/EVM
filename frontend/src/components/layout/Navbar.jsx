import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Container, 
  IconButton, 
  Menu, 
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import MenuIcon from '@mui/icons-material/Menu';
import { useNotification } from '../../hooks/useNotification';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    showNotification('Logged out successfully');
    navigate('/');
    handleMenuClose();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: 'background.paper', 
        borderBottom: '1px solid', 
        borderColor: 'divider' 
      }}
    >
      <Container>
        <Toolbar 
          disableGutters 
          sx={{ 
            justifyContent: 'space-between',
            minHeight: { xs: '56px', sm: '64px' }
          }}
        >
          <Button
            color="primary"
            onClick={() => navigate('/')}
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.2rem' }, 
              fontWeight: 600,
              padding: { xs: 1, sm: 1.5 }
            }}
          >
            EventHub
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <ThemeToggle />
            
            {isMobile ? (
              <>
                <IconButton
                  edge="end"
                  color="primary"
                  aria-label="menu"
                  onClick={handleMenuClick}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {user ? (
                    [
                      <MenuItem key="dashboard" onClick={() => handleNavigation('/dashboard')}>
                        Dashboard
                      </MenuItem>,
                      <MenuItem key="create" onClick={() => handleNavigation('/create-event')}>
                        Create Event
                      </MenuItem>,
                      <MenuItem key="logout" onClick={handleLogout}>
                        Logout
                      </MenuItem>
                    ]
                  ) : (
                    [
                      <MenuItem key="login" onClick={() => handleNavigation('/login')}>
                        Login
                      </MenuItem>,
                      <MenuItem key="signup" onClick={() => handleNavigation('/register')}>
                        Sign Up
                      </MenuItem>
                    ]
                  )}
                </Menu>
              </>
            ) : (
              <>
                {user ? (
                  <>
                    <Button onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </Button>
                    <Button onClick={() => navigate('/create-event')}>
                      Create Event
                    </Button>
                    <Button onClick={handleLogout} variant="outlined">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => navigate('/login')}>
                      Login
                    </Button>
                    <Button onClick={() => navigate('/register')} variant="contained">
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 