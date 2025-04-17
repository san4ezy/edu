import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export const API_BASE_URL = 'http://localhost:8110/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  pagination: null;
  errors: any[];
  data: T;
  service_data: null;
}

export interface ApiError {
  message: string;
  status: number;
}

export const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for adding auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for handling token refresh and response format
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // If the response is successful, return the data directly
      if (response.data.success) {
        return response;
      }
      
      // If the response indicates an error, throw it
      throw new Error(response.data.errors?.[0] || 'An error occurred');
    },
    async (error) => {
      const originalRequest = error.config;

      // If the error status is 401 and there's no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post<ApiResponse<{ access: string }>>(
            `${API_BASE_URL}/users/auth/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data.data;
          localStorage.setItem('access_token', access);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createApiClient(); 
