import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api/auth';
import { telegramService } from '../services/api/telegram';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTelegramUser, setIsTelegramUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkAuthState = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const isValid = await authService.verifyToken(token);
        setIsAuthenticated(isValid);
        if (!isValid) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsTelegramUser(authService.isTelegramUser());
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setIsTelegramUser(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        setAuthError(null);
        
        // Initialize Telegram Web App if running in Telegram
        if (telegramService.isTelegramWebApp()) {
          telegramService.initializeTelegramWebApp();
        }

        // Only check current auth state
        await checkAuthState();
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setAuthError(error instanceof Error ? error.message : 'Authentication failed');
          setIsAuthenticated(false);
          setIsTelegramUser(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [checkAuthState]);

  const login = async (credentials: any) => {
    try {
      setAuthError(null);
      const response = await authService.login(credentials);
      
      // Ensure tokens are stored
      if (response.access && response.refresh) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      }
      
      await checkAuthState();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error instanceof Error ? error.message : 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      telegramService.resetAuthState();
      setIsAuthenticated(false);
      setIsTelegramUser(false);
      setAuthError(null);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  const checkAuth = async () => {
    await checkAuthState();
    return isAuthenticated;
  };

  return {
    isAuthenticated,
    isTelegramUser,
    isLoading,
    authError,
    login,
    logout,
    checkAuth
  };
};
