import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { telegramService } from '../services/api/telegram';

export const TelegramAuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get auth data from URL
        const urlParams = new URLSearchParams(window.location.search);
        const authData = {
          id: urlParams.get('id'),
          first_name: urlParams.get('first_name'),
          last_name: urlParams.get('last_name'),
          username: urlParams.get('username'),
          photo_url: urlParams.get('photo_url'),
          auth_date: urlParams.get('auth_date'),
          hash: urlParams.get('hash'),
        };

        // Handle the OAuth callback
        const response = await telegramService.handleOAuthCallback(authData);
        
        // Store tokens
        if (response.access && response.refresh) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
        }

        // Redirect to home page
        navigate('/');
      } catch (err) {
        console.error('Telegram OAuth callback error:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Authentication Error</h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Completing Authentication</h2>
          <p className="mt-2 text-sm text-gray-600">Please wait while we complete your authentication...</p>
        </div>
      </div>
    </div>
  );
}; 
