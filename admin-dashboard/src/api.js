import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const nightclubsAPI = {
    getAll: () => api.get('/nightclubs'),
    getById: (id) => api.get(`/nightclubs/${id}`),
    create: (data) => api.post('/nightclubs', data),
    update: (id, data) => api.put(`/nightclubs/${id}`, data),
    delete: (id) => api.delete(`/nightclubs/${id}`),
};

export const eventsAPI = {
    getAll: () => api.get('/events'),
    getByClub: (clubId) => api.get(`/events/club/${clubId}`),
    create: (data) => api.post('/events', data),
    update: (id, data) => api.put(`/events/${id}`, data),
    delete: (id) => api.delete(`/events/${id}`),
};

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile'),
};

export const usersAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

export const notificationsAPI = {
    create: (data) => api.post('/notifications', data),
    getByUser: (userId) => api.get(`/notifications/user/${userId}`),
};

export default api;
