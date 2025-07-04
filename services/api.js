// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with baseURL
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // For FormData, remove Content-Type to let browser set it with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                    refresh: refreshToken
                });

                if (response.data.access) {
                    localStorage.setItem('access_token', response.data.access);

                    // Retry original request with new token
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Authentication APIs
export const authApi = {
    login: (credentials) => apiClient.post('/auth/token/', credentials),
    refreshToken: (refresh) => apiClient.post('/auth/token/refresh/', { refresh }),
    verifyToken: (token) => apiClient.post('/auth/token/verify/', { token }),
    register: (userData) => apiClient.post('/users/register/', userData),
    getCurrentUser: () => apiClient.get('/users/me/'),
};

// Routes APIs
export const routesApi = {
    getAll: () => apiClient.get('/routes/'),
    getById: (id) => apiClient.get(`/routes/${id}/`),
    create: (data) => apiClient.post('/routes/', data),
    update: (id, data) => apiClient.put(`/routes/${id}/`, data),
    updateStatus: (id, status) => apiClient.post(`/routes/${id}/update_status/`, { status }),
    delete: (id) => apiClient.delete(`/routes/${id}/`),
};

// Farms APIs
export const farmsApi = {
    getAll: () => apiClient.get('/farms/'),
    getById: (id) => apiClient.get(`/farms/${id}/`),
    create: (data) => apiClient.post('/farms/', data),
    update: (id, data) => apiClient.put(`/farms/${id}/`, data),
    delete: (id) => apiClient.delete(`/farms/${id}/`),
    getSamples: (id) => apiClient.get(`/farms/${id}/samples/`),
    getPestDisease: (id) => apiClient.get(`/farms/${id}/pest_disease/`),
};

// Crops APIs
export const cropsApi = {
    getAll: () => apiClient.get('/crops/'),
    getByFarm: (farmId) => apiClient.get(`/crops/?farm=${farmId}`),
    create: (data) => apiClient.post('/crops/', data),
    update: (id, data) => apiClient.put(`/crops/${id}/`, data),
    delete: (id) => apiClient.delete(`/crops/${id}/`),
};

// Soil Sample APIs
export const soilSamplesApi = {
    getAll: () => apiClient.get('/soil-samples/'),
    getById: (id) => apiClient.get(`/soil-samples/${id}/`),
    getByFarm: (farmId) => apiClient.get(`/soil-samples/?farm=${farmId}`),
    create: (data) => apiClient.post('/soil-samples/', data),
    update: (id, data) => apiClient.put(`/soil-samples/${id}/`, data),
    delete: (id) => apiClient.delete(`/soil-samples/${id}/`),
};

// Water Sample APIs
export const waterSamplesApi = {
    getAll: () => apiClient.get('/water-samples/'),
    getById: (id) => apiClient.get(`/water-samples/${id}/`),
    getByFarm: (farmId) => apiClient.get(`/water-samples/?farm=${farmId}`),
    create: (data) => apiClient.post('/water-samples/', data),
    update: (id, data) => apiClient.put(`/water-samples/${id}/`, data),
    delete: (id) => apiClient.delete(`/water-samples/${id}/`),
};

// Pest & Disease APIs
export const pestDiseaseApi = {
    getAll: () => apiClient.get('/pest-disease/'),
    getById: (id) => apiClient.get(`/pest-disease/${id}/`),
    getByFarm: (farmId) => apiClient.get(`/pest-disease/?farm=${farmId}`),
    create: (data) => apiClient.post('/pest-disease/', data),
    update: (id, data) => apiClient.put(`/pest-disease/${id}/`, data),
    delete: (id) => apiClient.delete(`/pest-disease/${id}/`),
};

// Dashboard API
export const dashboardApi = {
    getData: () => apiClient.get('/dashboard/'),
};

// Export APIs
export const exportApi = {
    farms: () => apiClient.get('/export/farms/', { responseType: 'blob' }),
    soilSamples: () => apiClient.get('/export/soil-samples/', { responseType: 'blob' }),
    waterSamples: () => apiClient.get('/export/water-samples/', { responseType: 'blob' }),
    pestDisease: () => apiClient.get('/export/pest-disease/', { responseType: 'blob' }),
};

export default apiClient;


/*
ts version
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with baseURL
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // For FormData, remove Content-Type to let browser set it with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                    refresh: refreshToken
                });

                if (response.data.access) {
                    localStorage.setItem('access_token', response.data.access);

                    // Retry original request with new token
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Authentication APIs
export const authApi = {
    login: (credentials: { username: string; password: string }) =>
        apiClient.post('/auth/token/', credentials),
    refreshToken: (refresh: string) =>
        apiClient.post('/auth/token/refresh/', { refresh }),
    verifyToken: (token: string) =>
        apiClient.post('/auth/token/verify/', { token }),
    register: (userData: any) =>
        apiClient.post('/users/register/', userData),
    getCurrentUser: () =>
        apiClient.get('/users/me/'),
};

// Routes APIs
export const routesApi = {
    getAll: () =>
        apiClient.get('/routes/'),
    getById: (id: string) =>
        apiClient.get(`/routes/${id}/`),
    create: (data: any) =>
        apiClient.post('/routes/', data),
    update: (id: string, data: any) =>
        apiClient.put(`/routes/${id}/`, data),
    updateStatus: (id: string, status: string) =>
        apiClient.post(`/routes/${id}/update_status/`, { status }),
    delete: (id: string) =>
        apiClient.delete(`/routes/${id}/`),
};

// Farms APIs
export const farmsApi = {
    getAll: () =>
        apiClient.get('/farms/'),
    getById: (id: string) =>
        apiClient.get(`/farms/${id}/`),
    create: (data: any) =>
        apiClient.post('/farms/', data),
    update: (id: string, data: any) =>
        apiClient.put(`/farms/${id}/`, data),
    delete: (id: string) =>
        apiClient.delete(`/farms/${id}/`),
    getSamples: (id: string) =>
        apiClient.get(`/farms/${id}/samples/`),
    getPestDisease: (id: string) =>
        apiClient.get(`/farms/${id}/pest_disease/`),
};

// Crops APIs
export const cropsApi = {
    getAll: () =>
        apiClient.get('/crops/'),
    getByFarm: (farmId: string) =>
        apiClient.get(`/crops/?farm=${farmId}`),
    create: (data: any) =>
        apiClient.post('/crops/', data),
    update: (id: string, data: any) =>
        apiClient.put(`/crops/${id}/`, data),
    delete: (id: string) =>
        apiClient.delete(`/crops/${id}/`),
};

// Soil Sample APIs
export const soilSamplesApi = {
    getAll: () =>
        apiClient.get('/soil-samples/'),
    getById: (id: string) =>
        apiClient.get(`/soil-samples/${id}/`),
    getByFarm: (farmId: string) =>
        apiClient.get(`/soil-samples/?farm=${farmId}`),
    create: (data: any) =>
        apiClient.post('/soil-samples/', data),
    update: (id: string, data: any) =>
        apiClient.put(`/soil-samples/${id}/`, data),
    delete: (id: string) =>
        apiClient.delete(`/soil-samples/${id}/`),
};

// Water Sample APIs
export const waterSamplesApi = {
    getAll: () =>
        apiClient.get('/water-samples/'),
    getById: (id: string) =>
        apiClient.get(`/water-samples/${id}/`),
    getByFarm: (farmId: string) =>
        apiClient.get(`/water-samples/?farm=${farmId}`),
    create: (data: any) =>
        apiClient.post('/water-samples/', data),
    update: (id: string, data: any) =>
        apiClient.put(`/water-samples/${id}/`, data),
    delete: (id: string) =>
        apiClient.delete(`/water-samples/${id}/`),
};

// Pest & Disease APIs
export const pestDiseaseApi = {
    getAll: () =>
        apiClient.get('/pest-disease/'),
    getById: (id: string) =>
        apiClient.get(`/pest-disease/${id}/`),
    getByFarm: (farmId: string) =>
        apiClient.get(`/pest-disease/?farm=${farmId}`),
    create: (data: any) =>
        apiClient.post('/pest-disease/', data),
    update: (id: string, data: any) =>
        apiClient.put(`/pest-disease/${id}/`, data),
    delete: (id: string) =>
        apiClient.delete(`/pest-disease/${id}/`),
};

// Dashboard API
export const dashboardApi = {
    getData: () =>
        apiClient.get('/dashboard/'),
};

// Export APIs
export const exportApi = {
    farms: () =>
        apiClient.get('/export/farms/', { responseType: 'blob' }),
    soilSamples: () =>
        apiClient.get('/export/soil-samples/', { responseType: 'blob' }),
    waterSamples: () =>
        apiClient.get('/export/water-samples/', { responseType: 'blob' }),
    pestDisease: () =>
        apiClient.get('/export/pest-disease/', { responseType: 'blob' }),
};

export default apiClient;

 */
