import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api' // La URL de tu servidor Node.js
});

// Este interceptor pegará automáticamente el Token en cada petición si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;