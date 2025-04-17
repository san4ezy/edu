import { apiClient } from './config';

export interface SignupData {
  phone_number: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  phone_number: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  pagination: null;
  errors: any[];
  data: T;
  service_data: null;
}

export const authService = {
  async signup(data: SignupData): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/users/auth/signup/', data);
  },

  async login(data: LoginData): Promise<TokenResponse> {
    const response = await apiClient.post<ApiResponse<TokenResponse>>('/users/auth/token/obtain/', data);
    const { access, refresh } = response.data.data;
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return response.data.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async verifyToken(token: string): Promise<boolean> {
    try {
      await apiClient.post<ApiResponse<void>>('/users/auth/token/verification/', { token });
      return true;
    } catch (error) {
      return false;
    }
  },

  async getCurrentUser() {
    const response = await apiClient.get<ApiResponse<any>>('/users/users/me/');
    return response.data.data;
  },
}; 
