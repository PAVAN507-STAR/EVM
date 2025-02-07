import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Link, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../hooks/useNotification';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState(null);
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { showNotification } = useNotification();

  useEffect(() => {
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [retryTimeout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(credentials);
      showNotification('Login successful!', 'success');
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      showNotification(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const success = await guestLogin();
      if (success) navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Guest login failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            disabled={isSubmitting}
          />
          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            disabled={isSubmitting}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Please wait...' : 'Login'}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGuestLogin}
            sx={{ mt: 2 }}
          >
            Continue as Guest
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 