import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  guestLogin: async () => {
    const response = await api.post('/auth/guest');
    return response.data;
  },
  me: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  }
};

export const eventService = {
  getEvents: async () => {
    const response = await api.get('/api/events');
    return response.data;
  },
  getEvent: async (id) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await api.post('/api/events', eventData);
    return response.data;
  },
  attendEvent: async (eventId) => {
    const response = await api.post(`/api/events/${eventId}/attend`);
    return response.data;
  },
  updateEvent: (id, data) => api.patch(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`)
}; 