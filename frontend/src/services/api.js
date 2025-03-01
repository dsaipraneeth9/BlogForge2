import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getBlogs = (params = {}) => api.get('/blog', { params });
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
export const toggleBookmarkBlog = (slug) => api.post(`/blog/${slug}/bookmark`); // New bookmark toggle
export const getBookmarkedBlogs = () => api.get('/blog/bookmarks'); // New get bookmarked blogs
export const createComment = (slug, content) => api.post(`/blog/${slug}/comments`, { content });
export const getComments = (slug) => api.get(`/blog/${slug}/comments`);
export const deleteComment = (slug, commentId) => api.delete(`/blog/${slug}/comments/${commentId}`);
export const updateProfile = (id, data) => api.patch(`/users/profile/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });