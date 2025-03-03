import axios from 'axios';

// Create an Axios instance with base URL and default headers
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Match your backend API base URL
  headers: { 'Content-Type': 'application/json' },
});

// Add request interceptor to include the authentication token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling (optional, for debugging or global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// Users API
export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);
export const updateProfile = (id, data) => api.patch(`/users/profile/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const forgotPassword = (email) => api.post('/users/forgot-password', { email });
export const resetPassword = (token, passwordData) => api.post(`/users/reset-password/${token}`, passwordData);

// Blogs API
export const getBlogs = (params = {}) => api.get('/blog', { params }); // For pagination, e.g., ?page=1&limit=3
export const getBlog = (slug) => {
  if (!slug) {
    console.error('Slug is undefined in getBlog');
    throw new Error('Invalid slug');
  }
  return api.get(`/blog/${slug}`);
};
export const createBlog = (data) => api.post('/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog = (slug, data) => api.patch(`/blog/${slug}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog = (slug) => api.delete(`/blog/${slug}`);
export const toggleLike = (slug) => api.post(`/blog/${slug}/like`);
export const toggleBookmarkBlog = (slug) => api.post(`/blog/${slug}/bookmark`);
export const getBookmarkedBlogs = () => api.get('/blog/bookmarks');
export const createComment = (slug, content) => api.post(`/blog/${slug}/comments`, { content });
export const getComments = (slug) => api.get(`/blog/${slug}/comments`);
export const deleteComment = (slug, commentId) => api.delete(`/blog/${slug}/comments/${commentId}`);

// Notifications API
export const getNotifications = () => api.get('/notifications');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const markNotificationAsRead = (id) => api.patch(`/notifications/${id}/read`); // Assuming this endpoint marks a notification as read

export default api;