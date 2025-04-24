import { apiClient } from './config';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date: number;
          hash: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramAuthResponse {
  access: string;
  refresh: string;
  user: TelegramUser;
}

// Keep track of authentication attempts and failures
let isAuthenticating = false;
let authFailureCount = 0;
const MAX_AUTH_ATTEMPTS = 3;

// Telegram OAuth configuration
const TELEGRAM_BOT_USERNAME = 'codingbrobot'; // Replace with your bot username
const TELEGRAM_OAUTH_URL = `https://oauth.telegram.org/auth?bot_id=${TELEGRAM_BOT_USERNAME}&origin=${window.location.origin}&return_to=${window.location.origin}/auth/telegram`;

export const telegramService = {
  isTelegramWebApp(): boolean {
    return typeof window.Telegram !== 'undefined' && window.Telegram.WebApp !== undefined;
  },

  getTelegramUser(): TelegramUser | null {
    if (!this.isTelegramWebApp()) {
      return null;
    }
    return window.Telegram.WebApp.initDataUnsafe.user || null;
  },

  async authenticateWithTelegram(): Promise<TelegramAuthResponse> {
    if (this.isTelegramWebApp()) {
      return this.authenticateWithMiniApp();
    } else {
      return this.authenticateWithOAuth();
    }
  },

  async authenticateWithMiniApp(): Promise<TelegramAuthResponse> {
    if (!this.isTelegramWebApp()) {
      throw new Error('Not running in Telegram Web App');
    }

    // Check if we've exceeded maximum auth attempts
    if (authFailureCount >= MAX_AUTH_ATTEMPTS) {
      throw new Error('Maximum authentication attempts exceeded');
    }

    // Prevent multiple simultaneous authentication attempts
    if (isAuthenticating) {
      throw new Error('Authentication already in progress');
    }

    // Check if we already have a valid token
    const existingToken = localStorage.getItem('access_token');
    if (existingToken) {
      try {
        // Verify the token is still valid without making a network request
        const tokenData = JSON.parse(atob(existingToken.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        
        if (currentTime < expirationTime) {
          console.log('Using existing valid token');
          return {
            access: existingToken,
            refresh: localStorage.getItem('refresh_token') || '',
            user: this.getTelegramUser() || {} as TelegramUser
          };
        }
      } catch (error) {
        console.log('Existing token is invalid, proceeding with new authentication');
        // Token is invalid, continue with new authentication
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }

    try {
      isAuthenticating = true;
      const initData = window.Telegram.WebApp.initData;
      
      if (!initData) {
        throw new Error('No Telegram init data available');
      }

      const response = await apiClient.post<TelegramAuthResponse>('/users/auth/social/telegram/', {
        init_data: initData
      });

      const { access, refresh, user } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      console.log('Successfully saved new tokens');
      
      // Reset failure count on successful authentication
      authFailureCount = 0;
      
      return response.data;
    } catch (error) {
      console.error('Authentication failed:', error);
      // Increment failure count
      authFailureCount++;
      
      // Clear any existing tokens on failure
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      throw error;
    } finally {
      isAuthenticating = false;
    }
  },

  async authenticateWithOAuth(): Promise<TelegramAuthResponse> {
    // Redirect to Telegram OAuth
    window.location.href = TELEGRAM_OAUTH_URL;
    // This will never be reached as the page will redirect
    throw new Error('Redirecting to Telegram OAuth');
  },

  handleOAuthCallback(authData: any): Promise<TelegramAuthResponse> {
    return apiClient.post<TelegramAuthResponse>('/users/auth/social/telegram/oauth/', authData);
  },

  initializeTelegramWebApp(): void {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  },

  // Reset authentication state
  resetAuthState(): void {
    isAuthenticating = false;
    authFailureCount = 0;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};
