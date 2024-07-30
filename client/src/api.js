import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signup = (user) => api.post('/auth/signup', user)
  .then(response => {
    localStorage.setItem('token', response.data.token);
    return response;
  });
export const signin = (user) => api.post('/auth/signin', user)
  .then(response => {
    localStorage.setItem('token', response.data.token);
    return response;
  });
export const fetchProfile = () => api.get('/auth/profile');
export const fetchTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const takeTask = (id) => api.post(`/tasks/${id}/take`);
export const completeTask = (id) => api.post(`/tasks/${id}/complete`);
export const getCompletedTasks = () => api.get('/tasks/completed');
export const getCreatedTasks = () => api.get('/tasks/created');
export const getTakenTasks = () => api.get('/tasks/taken');
export const getTaskDetails = (id) => api.get(`/tasks/${id}`);

export default api;
