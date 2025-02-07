import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { SnackbarProvider } from 'notistack';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import EventDashboard from './pages/EventDashboard';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { getTheme } from './theme';
import { CssBaseline } from '@mui/material';

const AppContent = () => {
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        style={{
          backgroundColor: isDarkMode ? '#000' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
          border: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
        }}
      >
        <Router>
          <AuthProvider>
            <WebSocketProvider>
              <Layout>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route
                    path="/create-event"
                    element={
                      <ProtectedRoute>
                        <CreateEvent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <EventDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Layout>
            </WebSocketProvider>
          </AuthProvider>
        </Router>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
