import { useState, useCallback } from 'react';
import { authService, LoginData, SignupData } from '../services/api/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('access_token');
    return !!token;
  });

  const login = useCallback(async (data: LoginData) => {
    try {
      await authService.login(data);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    try {
      await authService.signup(data);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }

    try {
      const isValid = await authService.verifyToken(token);
      setIsAuthenticated(isValid);
      return isValid;
    } catch (error) {
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  return {
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth,
  };
}; 
