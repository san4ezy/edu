import api from './api';

// Function for Phone/Password Login - uses the 'api' instance
const loginWithPhonePassword = async (phone: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/v1/auth/token/obtain/', {
        phone_number: phone,
        password: password,
    });
    return response.data.data!;
};

// Function for Telegram Mini App Authentication - uses the 'api' instance
const loginWithTelegramMiniApp = async (initData: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/v1/telegram/mini/', {
        init_data: initData
    });
    return response.data;
};

// Function for Telegram Widget Authentication - uses the 'api' instance
const loginWithTelegramWidget = async (userData: any): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/v1/telegram/web/', userData);
    return response.data;
};

export {
    loginWithPhonePassword,
    loginWithTelegramMiniApp,
    loginWithTelegramWidget
};