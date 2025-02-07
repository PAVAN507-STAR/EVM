import { createTheme } from '@mui/material';

export const getTheme = (isDarkMode) => createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: isDarkMode ? '#FFFFFF' : '#000000',
    },
    secondary: {
      main: isDarkMode ? '#71767B' : '#404040',
    },
    background: {
      default: isDarkMode ? '#000000' : '#ffffff',
      paper: isDarkMode ? '#000000' : '#ffffff',
    },
    text: {
      primary: isDarkMode ? '#FFFFFF' : '#000000',
      secondary: isDarkMode ? '#71767B' : '#666666',
    },
    divider: isDarkMode ? '#2F3336' : '#e0e0e0',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          color: isDarkMode ? '#FFFFFF' : '#000000',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&.logo-button': {
            border: isDarkMode ? '1px solid rgba(167, 139, 250, 0.3)' : 'none',
            background: isDarkMode ? 'rgba(167, 139, 250, 0.05)' : 'transparent',
            '&:hover': {
              background: isDarkMode ? 'rgba(167, 139, 250, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            },
          },
          '&.nav-action': {
            border: `1px solid ${isDarkMode ? '#FFFFFF' : 'transparent'}`,
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
        contained: {
          backgroundColor: isDarkMode ? '#FFFFFF' : '#000000',
          color: isDarkMode ? '#000000' : '#FFFFFF',
          '&:hover': {
            backgroundColor: isDarkMode ? '#EBEBEB' : '#333333',
          },
        },
        outlined: {
          borderColor: isDarkMode ? '#333333' : '#000000',
          color: isDarkMode ? '#FFFFFF' : '#000000',
          '&:hover': {
            borderColor: isDarkMode ? '#FFFFFF' : '#000000',
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          borderColor: isDarkMode ? '#333333' : '#e0e0e0',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: isDarkMode ? '#ffffff' : '#000000',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          borderBottom: `1px solid ${isDarkMode ? '#2F3336' : '#e0e0e0'}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: isDarkMode ? '#ffffff' : '#000000',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: isDarkMode ? '#333333' : '#f5f5f5',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: isDarkMode ? '#000000' : '#ffffff',
            '& fieldset': {
              borderColor: isDarkMode ? '#FFFFFF' : '#e0e0e0',
              borderWidth: isDarkMode ? '1px' : '1px',
            },
            '&:hover fieldset': {
              borderColor: isDarkMode ? '#FFFFFF' : '#000000',
              borderWidth: isDarkMode ? '2px' : '1px',
            },
            '&.Mui-focused fieldset': {
              borderColor: isDarkMode ? '#FFFFFF' : '#000000',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: isDarkMode ? '#FFFFFF' : '#666666',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            backgroundColor: isDarkMode ? '#000000' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`,
          },
        },
      },
    },
  },
}); 