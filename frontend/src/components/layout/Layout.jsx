import { Box } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <Navbar />
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3,
        maxWidth: '1200px',
        mx: 'auto',
        width: '100%',
        bgcolor: 'background.default'
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 