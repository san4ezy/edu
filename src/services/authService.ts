import api from './api';

interface LoginResponse {
    access: string;
    refresh: string;
}

interface TelegramUserData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

// Function for Phone/Password Login
const loginWithPhonePassword = async (phone: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/token/obtain/', {
        phone_number: phone,
        password: password,
    });
    return response.data;
};

// Function for Telegram Mini App Authentication
const loginWithTelegramMiniApp = async (initData: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/telegram/mini/', {
        init_data: initData
    });
    return response.data;
};

// Function for Telegram Widget Authentication
const loginWithTelegramWidget = async (userData: TelegramUserData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/telegram/web/', userData);
    return response.data;
};

export {
    loginWithPhonePassword,
    loginWithTelegramMiniApp,
    loginWithTelegramWidget
};
