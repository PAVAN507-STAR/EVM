import { Box, Typography } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

const Toast = ({ message, type = 'success' }) => {
  const { isDarkMode } = useTheme();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />;
      case 'info':
        return <InfoIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: 1,
        backgroundColor: isDarkMode ? '#000' : '#fff',
        border: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minWidth: '300px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      {getIcon()}
      <Typography
        sx={{
          color: isDarkMode ? '#fff' : '#000',
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Toast; 