import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Interceptor token:', token); // Add logging
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const registerUser = (data) => api.post('/users/register', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const loginUser = (data) => api.post('/users/login', data);
export const forgotPassword = (email) => api.post('/users/forgot-password', { email });
export const resetPassword = (token, data) => api.post(`/users/reset-password/${token}`, data);
export const logoutUser = () => api.get('/users/logout');
export const updateProfile = (id, data) => api.patch(`/users/profile/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });