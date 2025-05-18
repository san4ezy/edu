import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error("VITE_API_URL is not defined in your environment variables.");
}

interface TokenResponse {
    access: string;
    refresh: string;
}

interface QueueItem {
    resolve: (value: string) => void;
    reject: (reason: any) => void;
}

// Navigation function that will be set from AuthContext
let navigateToLogin: (() => void) | null = null;

// Function to set the navigation callback
export const setNavigationCallback = (callback: (() => void) | null) => {
    navigateToLogin = callback;
};

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Queue of requests that are waiting for the token refresh
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });

    failedQueue = [];
};

// Function to handle logout and redirect
const handleAuthFailure = (error: Error) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Use React Router navigation if available, otherwise fallback to window.location
    if (navigateToLogin) {
        navigateToLogin();
    } else {
        // Fallback to direct navigation
        window.location.href = '/login';
    }
    
    // Create a silent error that won't show to the user
    const silentError = new Error('Authentication failed');
    silentError.name = 'AuthenticationError';
    return Promise.reject(silentError);
};

// This runs BEFORE a request is sent
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// This runs AFTER a response is received
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // If the error is due to an invalid token (401 or 403) and we haven't tried refreshing yet
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            if (isRefreshing) {
                // If we're already refreshing the token, add this request to the queue
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers!['Authorization'] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => {
                        // If this is an auth error, handle it silently
                        if (err.name === 'AuthenticationError') {
                            return handleAuthFailure(err);
                        }
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    // No refresh token available, handle auth failure silently
                    isRefreshing = false;
                    processQueue(error as Error, null);
                    return handleAuthFailure(error as Error);
                }

                // Call the refresh token endpoint
                const response = await axios.post<TokenResponse>(`${API_URL}/auth/token/refresh/`, {
                    refresh: refreshToken
                });

                if (response.data.access) {
                    // Store the new tokens
                    localStorage.setItem('accessToken', response.data.access);
                    localStorage.setItem('refreshToken', response.data.refresh);

                    // Update auth header for the original request
                    originalRequest.headers!['Authorization'] = `Bearer ${response.data.access}`;

                    // Process any queued requests with the new token
                    processQueue(null, response.data.access);

                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh token is invalid, handle auth failure silently
                processQueue(refreshError as Error, null);
                return handleAuthFailure(refreshError as Error);
            } finally {
                isRefreshing = false;
            }
        }

        // If the error is something other than 401/403 or refresh failed
        return Promise.reject(error);
    }
);

// Authentication functions
export const authService = {
    login: async (phoneNumber: string, password: string): Promise<TokenResponse> => {
        try {
            const response = await api.post<TokenResponse>('/auth/token/obtain/', {
                phone_number: phoneNumber,
                password: password
            });

            if (response.data.access && response.data.refresh) {
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
                return response.data;
            }

            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    signup: async (userData: {
        phone_number: string;
        password: string;
        first_name: string;
        last_name: string;
    }) => {
        try {
            const response = await api.post('/auth/signup/', userData);
            return response.data;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },

    verifyToken: async (token: string) => {
        try {
            const response = await api.post('/auth/token/verification/', { token });
            return response.data;
        } catch (error) {
            console.error('Token verification error:', error);
            throw error;
        }
    }
};

export default api;
